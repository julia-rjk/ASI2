# Run
FROM openjdk:11-jre
ENV CARDBASICSERVICE_HOME /opt/cardbasicservice
WORKDIR $CARDBASICSERVICE_HOME
COPY ./target/*.jar $CARDBASICSERVICE_HOME/cardbasicservice.jar

EXPOSE 8083

ENTRYPOINT java -jar cardbasicservice.jar
