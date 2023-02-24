# Setting up the development environment

Node JS

```
1- sudo apt update
2- sudo apt install nodejs
3- node -v (my node version is v16.16.0)
```

NPM

```
1- sudo apt install npm
```

PostgreSQL (v12.14.1)

```
1- sudo sh -cecho "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
2- wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
3- sudo apt-get update
4- sudo apt-get -y install postgresql
```

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

- Register user using OTP
- validate transaction using OTP
- add more details for cart table
- add more details for payment and user table
- split the project to production devolpment environement
-
