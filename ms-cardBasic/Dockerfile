# Run
FROM openjdk:11-jre
ENV CARDBASICSERVICE_HOME /opt/cardbarsicservice
WORKDIR $CARDBASICSERVICE_HOME
COPY ./target/*.jar $CARDBASICSERVICE_HOME/cardbarsicservice.jar

EXPOSE 8083

ENTRYPOINT java -jar cardbasicservice.jar
