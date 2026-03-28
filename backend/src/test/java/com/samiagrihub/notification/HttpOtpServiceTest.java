package com.samiagrihub.notification;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.samiagrihub.common.config.OtpProperties;
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

class HttpOtpServiceTest {

    private HttpServer server;

    @AfterEach
    void tearDown() {
        if (server != null) {
            server.stop(0);
        }
    }

    @Test
    void shouldDispatchOtpViaHttpProvider() throws IOException {
        AtomicReference<String> authHeader = new AtomicReference<>();
        AtomicReference<String> requestBody = new AtomicReference<>();

        server = HttpServer.create(new InetSocketAddress(0), 0);
        server.createContext("/messages/otp", exchange -> {
            authHeader.set(exchange.getRequestHeaders().getFirst("Authorization"));
            requestBody.set(readBody(exchange));
            respond(exchange, 202);
        });
        server.start();

        OtpProperties otpProperties = new OtpProperties(
                "http",
                true,
                "http://localhost:" + server.getAddress().getPort(),
                "/messages/otp",
                "secret-token",
                "Authorization",
                "SAMIAGRI",
                5000,
                10,
                60
        );

        HttpOtpService service = new HttpOtpService(RestClient.builder().baseUrl(otpProperties.baseUrl()).build(), otpProperties);

        service.sendOtp("+255700111222", "123456");

        assertThat(authHeader.get()).isEqualTo("Bearer secret-token");
        assertThat(requestBody.get()).contains("\"phoneNumber\":\"+255700111222\"");
        assertThat(requestBody.get()).contains("\"senderId\":\"SAMIAGRI\"");
        assertThat(requestBody.get()).contains("\"channel\":\"sms\"");
        assertThat(requestBody.get()).contains("123456");
        assertThat(requestBody.get()).contains("10 minutes");
    }

    @Test
    void shouldMapProviderFailureToServiceUnavailable() throws IOException {
        server = HttpServer.create(new InetSocketAddress(0), 0);
        server.createContext("/messages/otp", exchange -> respond(exchange, 500));
        server.start();

        OtpProperties otpProperties = new OtpProperties(
                "http",
                true,
                "http://localhost:" + server.getAddress().getPort(),
                "/messages/otp",
                "secret-token",
                "Authorization",
                "SAMIAGRI",
                5000,
                10,
                60
        );

        HttpOtpService service = new HttpOtpService(RestClient.builder().baseUrl(otpProperties.baseUrl()).build(), otpProperties);

        assertThatThrownBy(() -> service.sendOtp("+255700111222", "123456"))
                .isInstanceOf(AppException.class)
                .satisfies(throwable -> {
                    AppException exception = (AppException) throwable;
                    assertThat(exception.getCode()).isEqualTo("OTP_DELIVERY_FAILED");
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
