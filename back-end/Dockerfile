# ========================================
# Stage 1: Build
# ========================================
FROM eclipse-temurin:25-jdk AS build

WORKDIR /app

# Copia primeiro o wrapper e o pom.xml para aproveitar cache de dependências
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw

# Baixa as dependências (fica em cache se o pom.xml não mudar)
RUN ./mvnw dependency:go-offline -B

# Agora copia o restante do código-fonte
COPY src ./src

# Builda o jar, pulando os testes (Railway não deve rodar testes no build de produção)
RUN ./mvnw clean package -DskipTests -B

# ========================================
# Stage 2: Runtime
# ========================================
FROM eclipse-temurin:25-jre AS runtime

WORKDIR /app

# Copia apenas o jar final da etapa de build (imagem final fica bem menor)
COPY --from=build /app/target/*.jar app.jar

# Railway injeta a variável PORT dinamicamente; o Spring precisa escutar nela
ENV SPRING_PROFILES_ACTIVE=prod

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -XX:MaxRAMPercentage=75.0 -XX:+ExitOnOutOfMemoryError -jar app.jar --server.port=${PORT:-8080}"]