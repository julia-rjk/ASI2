cd ./lib-transverse
mvn clean install
cd ../ms-user
mvn clean install 
cd ../ms-cardbasic
mvn clean install
cd ../ms-card 
mvn clean install 
cd ../ms-store/ms-store-public
mvn clean install 
cd ../ms-store
mvn clean install 
cd ..
sudo docker-compose build
sudo docker-compose up