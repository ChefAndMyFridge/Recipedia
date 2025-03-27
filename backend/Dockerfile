# 빌드단계
FROM openjdk:17-jdk-alpine3.13 AS build

# WORKDIR /app

COPY . .

RUN chmod +x gradlew

RUN ./gradlew clean build -x test

# 실행단계
FROM openjdk:17-jdk-alpine3.13

# WORKDIR /app

# ARG JAR_FILE=build/libs/*.jar
# COPY --from=build ${JAR_FILE} app.jar
COPY --from=build /build/libs/*.jar app.jar

# COPY ${JAR_FILE} app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-Duser.timezone=Asia/Seoul", "-jar","/app.jar"]