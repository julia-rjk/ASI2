cd ./Lib-transverse
mvn clean install
cd ../MS-User 
mvn clean install 
cd ../ms-cardBasic
mvn clean install
cd ../MS-Card 
mvn clean install 
cd ../ms-store/ms-store-public
mvn clean install 
cd ../ms-store
mvn clean install 
cd ..
sudo docker-compose build
sudo docker-compose up