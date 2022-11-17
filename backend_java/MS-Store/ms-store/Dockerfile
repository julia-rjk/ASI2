# Run
FROM openjdk:11-jre
ENV STORESERVICE_HOME /opt/storeservice
WORKDIR $STORESERVICE_HOME
COPY ./target/*.jar $STORESERVICE_HOME/storeservice.jar

EXPOSE 8084

ENTRYPOINT java -jar storeservice.jar
