# Run
FROM openjdk:11-jre
ENV CONVERSATIONSERVICE_HOME /opt/chathistoryservice
WORKDIR $CONVERSATIONSERVICE_HOME
COPY ./target/*.jar $CONVERSATIONSERVICE_HOME/chathistoryservice.jar

EXPOSE 8088

ENTRYPOINT java -jar chathistoryservice.jar
