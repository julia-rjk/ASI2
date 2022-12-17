# ASI 2 

## Questionnaires :
- Atelier 1 : [ici](./Organisation/Atelier1.md)
- Atelier 2 : [ici](./Organisation/Atelier2.md)
- Atelier 3 : [ici](./Organisation/Atelier3.md)

## Informations :
- Ports : 
    - 8081 : User Service
    - 8082 : Auth Service
    - 8083 : CardBasic Service
    - 8084 : Store Service
    - 8085 : Card Service
    - 8086 : Conversation Service
    - 8087 : Game & Chat Service
    - 8088 : LogESB Service
    - 3000 : Client

- Les routes avec proxy sont : 
    - /client http://client:3000/client
    - /api/login http://authservice:8082/
    - /api/cardbasics http://cardbasicservice:8083/api/cardbasics
    - /api/stores http://storeservice:8084/api/stores
    - /api/cards http://cardservice:8085/api/cards
    - /api/messages http://chathistoryservice:8086/api/messages
    - /api/game http://gameservice:8087/
    - /api/log http://logesbservice:8088/api/log

## Docker
### Automatique
Il faut lancer le script : ``sudo sh build_project.sh``

### Manuel
- Avant de lancer docker il faut faire un ```mvn clean install``` de chaque projet maven
- Exemple pour lancer un container : ```sudo docker build --tag userservice . && sudo docker run userservice ```