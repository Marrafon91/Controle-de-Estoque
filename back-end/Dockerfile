========================================
Stage 1: Build
========================================
FROM eclipse-temurin:25-jdk AS build
WORKDIR /app

Wrapper e pom primeiro, para aproveitar cache de dependências
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B

Código-fonte
COPY src ./src
RUN ./mvnw clean package -DskipTests -B

========================================
Stage 2: Runtime
========================================
FROM eclipse-temurin:25-jre AS runtime
WORKDIR /app

Usuário sem privilégios
RUN groupadd -r spring && useradd -r -g spring spring

COPY --from=build /app/target/*.jar app.jar
RUN chown spring:spring app.jar
USER spring

ENV SPRING_PROFILES_ACTIVE=prod
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0"

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar --server.port=${PORT:-8080}"]