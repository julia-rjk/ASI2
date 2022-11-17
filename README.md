# ASI 2 

Questionnaires :
- Atelier 1 : [ici](./Organisation/Atelier1.md)

Informations :
- Ports : 
    - 8081 : User Service
    - 8082 : Auth Service
    - 8083 : CardBasic Service
    - 8084 : Store Service
    - 8085 : Card Service

Docker : 
- Pour tout installer automatiquement, il faut lancer le script : ````sudo sh build_project.sh``
- Avant de lancer docker il faut faire un ```mvn clean install``` de chaque projet maven
- Exemple pour lancer un container : ```sudo docker build --tag userservice . && sudo docker run userservice ```