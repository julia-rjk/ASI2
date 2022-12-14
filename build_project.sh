echo "> Building java project..."
cd backend_java

cd ./lib-transverse
echo ">> Building lib-transverse..."
mvn clean install

cd ../ms-card
echo ">> Building card service..."
mvn clean install

cd ../ms-cardbasic
echo ">> Building card basic service..."
mvn clean install

cd ../ms-chathistory
echo ">> Building chat history service..."
mvn clean install

cd ../ms-logesb
echo ">> Building log esb service..."
mvn clean install


# cd ../ms-store
# echo ">> Building store service..."
# mvn clean install


cd ../ms-user
echo ">> Building user service..."
mvn clean install


echo "> Running docker compose..."
cd ../..
sudo docker-compose build && sudo docker-compose up