# Setting up the development environment

Node JS
1- sudo apt update
2- sudo apt install nodejs
3- node -v (my node version is v16.16.0)
NPM
1- sudo apt install npm
PostgreSQL (v12.14.1)
1- sudo sh -cecho "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
2- wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
3- sudo apt-get update
4- sudo apt-get -y install postgresql
