# Run
FROM openjdk:11-jre
ENV USERSERVICE_HOME /opt/userservice
WORKDIR $USERSERVICE_HOME
COPY ./target/*.jar $USERSERVICE_HOME/userservice.jar

EXPOSE 8081

ENTRYPOINT java -jar userservice.jar
