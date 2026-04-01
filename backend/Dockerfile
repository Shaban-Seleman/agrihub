FROM eclipse-temurin:21-jdk-jammy AS builder

WORKDIR /workspace

COPY gradlew gradlew
COPY gradlew.bat gradlew.bat
COPY gradle gradle
COPY build.gradle.kts build.gradle.kts
COPY settings.gradle.kts settings.gradle.kts
COPY src src

RUN chmod +x gradlew
RUN ./gradlew --no-daemon bootJar
RUN JAR_FILE="$(find build/libs -maxdepth 1 -type f -name '*.jar' ! -name '*-plain.jar' | head -n 1)" \
    && test -n "$JAR_FILE" \
    && cp "$JAR_FILE" /workspace/app.jar

FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

COPY --from=builder /workspace/app.jar /app/app.jar

RUN useradd --create-home --shell /usr/sbin/nologin appuser \
    && chown -R appuser:appuser /app

USER appuser

EXPOSE 8080

CMD ["sh", "-c", "java ${JAVA_OPTS:-} -Dserver.port=${PORT:-8080} -jar /app/app.jar"]
