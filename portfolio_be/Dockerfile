FROM eclipse-temurin:17-jdk AS builder

WORKDIR /app
COPY . .

RUN ./gradlew build --no-daemon  # Run Gradle build

FROM eclipse-temurin:17-jdk
WORKDIR /app

RUN ls /app/build/libs/  # Debug step: check built files
COPY --from=builder /app/build/libs/*-SNAPSHOT.jar /app/app.jar

# Copy Firebase credentials file
COPY src/main/resources/portfolio-de542-firebase-adminsdk-fbsvc-63773f3e0b.json /app/src/main/resources/

CMD ["java", "-jar", "/app/app.jar"]
