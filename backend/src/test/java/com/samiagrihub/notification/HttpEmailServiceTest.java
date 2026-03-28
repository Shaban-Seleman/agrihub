package com.samiagrihub.notification;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.samiagrihub.common.config.EmailProperties;
import com.samiagrihub.common.exception.AppException;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.io.InputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.atomic.AtomicReference;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.RestClient;

class HttpEmailServiceTest {

    private HttpServer server;

    @AfterEach
    void tearDown() {
        if (server != null) {
            server.stop(0);
        }
    }

    @Test
    void shouldDispatchEmailViaHttpProvider() throws IOException {
        AtomicReference<String> authHeader = new AtomicReference<>();
        AtomicReference<String> requestBody = new AtomicReference<>();

        server = HttpServer.create(new InetSocketAddress(0), 0);
        server.createContext("/messages/email", exchange -> {
            authHeader.set(exchange.getRequestHeaders().getFirst("Authorization"));
            requestBody.set(readBody(exchange));
            respond(exchange, 202);
        });
        server.start();

        EmailProperties emailProperties = new EmailProperties(
                "http",
                true,
                "http://localhost:" + server.getAddress().getPort(),
                "/messages/email",
                "secret-token",
                "Authorization",
                "no-reply@samiagrihub.test",
                "SamiAgriHub",
                "support@samiagrihub.test",
                5000
        );

        HttpEmailService service = new HttpEmailService(RestClient.builder().baseUrl(emailProperties.baseUrl()).build(), emailProperties);

        service.send("demo@example.com", "Welcome", "Hello from SamiAgriHub");

        assertThat(authHeader.get()).isEqualTo("Bearer secret-token");
        assertThat(requestBody.get()).contains("\"to\":\"demo@example.com\"");
        assertThat(requestBody.get()).contains("\"subject\":\"Welcome\"");
        assertThat(requestBody.get()).contains("\"body\":\"Hello from SamiAgriHub\"");
        assertThat(requestBody.get()).contains("\"fromAddress\":\"no-reply@samiagrihub.test\"");
        assertThat(requestBody.get()).contains("\"fromName\":\"SamiAgriHub\"");
        assertThat(requestBody.get()).contains("\"replyTo\":\"support@samiagrihub.test\"");
    }

    @Test
    void shouldMapProviderFailureToServiceUnavailable() throws IOException {
        server = HttpServer.create(new InetSocketAddress(0), 0);
        server.createContext("/messages/email", exchange -> respond(exchange, 500));
        server.start();

        EmailProperties emailProperties = new EmailProperties(
                "http",
                true,
                "http://localhost:" + server.getAddress().getPort(),
                "/messages/email",
                "secret-token",
                "Authorization",
                "no-reply@samiagrihub.test",
                "SamiAgriHub",
                "",
                5000
        );

        HttpEmailService service = new HttpEmailService(RestClient.builder().baseUrl(emailProperties.baseUrl()).build(), emailProperties);

        assertThatThrownBy(() -> service.send("demo@example.com", "Welcome", "Hello from SamiAgriHub"))
                .isInstanceOf(AppException.class)
                .satisfies(throwable -> {
                    AppException exception = (AppException) throwable;
                    assertThat(exception.getCode()).isEqualTo("EMAIL_DELIVERY_FAILED");
                    assertThat(exception.getStatus()).isEqualTo(HttpStatus.SERVICE_UNAVAILABLE);
                });
    }

    private String readBody(HttpExchange exchange) throws IOException {
        try (InputStream inputStream = exchange.getRequestBody()) {
            return new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
        }
    }

    private void respond(HttpExchange exchange, int statusCode) throws IOException {
        exchange.sendResponseHeaders(statusCode, -1);
        exchange.close();
    }
}
