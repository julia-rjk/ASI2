# Atelier 2

- WebSocket :
    - Qu’est ce que les Websockets ?
        
        Build Realtime feature by establishing a two way connexion between the backend and the frontend.
        
    - Comment fonctionne-t-elle ?
        
        Le client demande au serveur d’ouvrir une connexion TCP/IP qui leurs permet de communiquer en direct.
        
    - Quelle est la différence entre [socket.io](http://socket.io/) et les web sockets ?
        
        Websocket est le protocol de communication alors que socket.io est la library qui utilise ce protocole. 
        
        Cette library permet donc plus que Websocket. Par exemple, [socket.io](http://socket.io) permet au backend d’envoyer un message à plusieurs client en simultané (ou en tout cas simplifie ce processus
        
- npm
    - Qu’est ce que npm ?
        
        Npm est un package manager pour javascrpit
        
    - Comment fonctionne-t-il ?
        
        It install, downloads packages and dependencies. We can use it in the command line using `npm`
        
- Qu’est ce qu’une fonction de callback ?
    
    Une fonction de callback est une référence à du code exécutable passé en argument d’une autre fonction. Le code dois donc callback cette partie de code pasé en paramètre
    
- Expliquer la différence entre une programmation séquentielle et une programmation évènementielle.
    
    La programmation séquentielle est un déroulement d’instruction qui ne change pas alors que la programmation évènementielle, la séquence d’instructions est déterminée o modifiée par les différents évènements extérieur qui ont une conséquence sur le traitement (durant l’exécution)
    
- Pourquoi a-ton besoin d’utiliser un proxy pour qu’on web browser puisse communiquer avec deux backend différents ?
- Quels sont les principaux avantages de nodejs vis-à-vis d’autre serveur web (E.g apache tomcat + Springboot) ?
- La communication via websocket consomme-t-elle plus de ressource coté serveur ?
- Comment peut-on réaliser une authentification pour une application qui possèdent des backends distinct ?
- Quels arguments/situations peuvent conduire à l’usage d’un bus de communication pour une communication entre backends plutôt que les webServices ?
- Qu'est-ce qu'un callback ? Qu'est-ce qu'une promise ? Qu'est-ce qu'un observable ?
- Alternative à activemq ? Q'est-ce que Spring Framework par rapport à SpringBoot ? Quel partie de SpringBoot permet de créer des web services REST ? Qu'est-ce qu'ExpressJS ? Quels sont les alternatives ? Quel est le transport utilisé par Spring pour communiquer avec activemq ? Quel est le transport utilisé par Nodejs pour communiquer avec activemq ?