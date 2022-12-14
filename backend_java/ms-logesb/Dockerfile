# Run
FROM openjdk:11-jre
ENV LOGSERVICE_HOME /opt/logservice
WORKDIR $LOGSERVICE_HOME
COPY ./target/*.jar $LOGSERVICE_HOME/logservice.jar

EXPOSE 8088

ENTRYPOINT java -jar logservice.jar
