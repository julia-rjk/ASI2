# Atelier 3

---

- Qu’est ce que la CI ? Expliquer ses avantages

  La CI (Continuous Integration) est une approche visant à automatiser le build des applications en fonction des ajouts
  des différents développeurs.

- Qu’est ce que la CD ? Que permet-elle de faire ?

  La CD (Continuous Deployment) est l'approche permettant d'automatiser le déploiement des applications.

- Quel est l'intérêt de la virtualisation ?

  La virtualisation est une pratique permettant d'exécuter plusieurs environnements à partir d'une machine. Les
  performances dépendent donc de cette dernière.

- Pourquoi docker devient-il un outil très utile sur des architectures multi-backend et pour la CD ?

  Docker est très utile dans des architectures de ce type car, à la vue de la multitude de services/applications, il
  nous
  suffit juste d'écrire un DockerFile décrivant les ressources nécessaires pour l'application en question. Une fois cela
  fait, il suffit juste de lancer des outils comme Docker compose ou Kubernetes pour déployer l'ensemble de l'
  architecture.

- Quelles sont les principales différences entre les containers dockers et les autres systèmes de
  virtualisation (vmware, virtualbox) ?

  Les containers docker ne cherchent pas à répliquer une machine entière, ce qui le rend très léger. En effet, ce
  dernier à juste besoin de ces dépendances.

- Quels sont les limites des conteneurs lors de leur exécution (CPU, RAM, architecture processeur...) ?

  Par défaut, il n'y a aucune limite au niveau des ressources, ces dernières prennent donc de la machine hôte.

- Quels problèmes peuvent survenir lorsque plusieurs conteneurs sont démarrés sur le même hôte ?
  Comment prévenir ces problèmes ?

  // TODO

- En quoi les volumes de docker sont intéressants ? Pourquoi sont-ils indispensables dans l’usage de
  base de données ?

  Les volumes Docker sont intéressants, car ces derniers permettent la persistence des données. Ils sont indispensables
  dans les bases de données sinon aucunes données ne seraient sauvegardées lors du redémarrage du conteneur.

- Quels sont les outils permettant de manager efficacement le déploiement de nombreux containers
  (et leur passage à l’échelle) ?

  Parmis les outils indispensables, nous retrouvons Docker Compose qui permet d'orchestrer la configuration et le
  lancement des différents containers. Nous pouvons aussi noter Kubernetes permettant le deployment de ces derniers.