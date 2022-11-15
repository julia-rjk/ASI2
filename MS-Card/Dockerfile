# Run
FROM openjdk:11-jre
ENV CARDSERVICE_HOME /opt/cardservice
WORKDIR $CARDSERVICE_HOME
COPY ./target/*.jar $CARDSERVICE_HOME/cardservice.jar

EXPOSE 8085

ENTRYPOINT java -jar cardservice.jar
