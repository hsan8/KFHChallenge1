# Setting up the development environment

1- Install docker 
please refer to this link:
https://docs.docker.com/engine/install/ubuntu/

2- Install docker compose:
please refer to this link:
https://docs.docker.com/compose/install/linux/

# My system configuration:
```
RAM: 16.0 GiB
CPU: 11th Gen Intel® Core™ i7-1165G7 @ 2.80GHz × 8
OS Name: Ubuntu 22.04.1 LTS
OS Type: 64-bit
GNOME VERSION: 42.2
```
# To Run the Project:
Not: make sur that the port 3000, 80, 5050, 5432 are available to run proprly the project

- clone the project 

- change directory to the project directory

```
sudo docker-compose build
sudo docker-compose up
```
# Project part:

1- backend: http://localhost:3000/

2- frontend:http://localhost/

3- pgadmin 4 : http://localhost:5050/ (email:kfhadmin@gmail.com, password:admin )

    3.1: to connect to the db server
     * let side -> servers -> register
     * window will opning: 
        GENERAL section ==> Name: ('KFH SERVER')
        CONNECTION section ==> Host name/address:('dbserver') , Port:(5432), Username:('kfhusername'), Password:('kfhpassword')
     * click (save) buuton 
     Note: any issue or you need any clarification just call or email me and I will be happy to answer

Once you connect to pgadmin just restart the containers  using ```sudo docker-compose down``` then ```sudo docker-compose up``` 

# Encryption part

why I'm using Crypto-js?

```
    There are many encryption libraries available for Node.js, and the choice of which one to use depends on various factors, such as the level of security required, ease of use, performance, and community support.
One popular library for encryption and decryption in Node.js is crypto-js. Here are some reasons why crypto-js might be a good choice:
Ease of use: Crypto-js provides a simple and easy-to-use API for encryption and decryption, with a wide range of supported encryption algorithms.
Wide range of algorithms: Crypto-js supports a wide range of encryption algorithms, including AES, DES, TripleDES, Rabbit, and more.
Cross-platform compatibility: Crypto-js can be used in both Node.js and browser environments, making it a good choice for web applications that need to encrypt data on the client side and send it securely to the server.
Community support: Crypto-js is a popular library with a large and active community, which means that there are many resources available for learning how to use it and troubleshooting any issues.
Open source: Crypto-js is an open-source library, which means that the source code is freely available and can be audited for security vulnerabilities.
Overall, crypto-js is a good choice for encrypting and decrypting credit card information in Node.js because it provides a simple and easy-to-use API,
supports a wide range of encryption algorithms, and has a large and active community of developers.
```

#TODO
- Use clustring to balncing the load on the server
- use microservice to let the project more scalable and more efficient 
- use redis to catch the data and minimize the load on on the main db 
- use redis stream as message broker to exchange the messages between each microservices
- improve the security part
