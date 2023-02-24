# Use an official Apache runtime as a parent image
FROM httpd:latest

WORKDIR /
COPY package*.json /usr/local/apache2/htdocs/
EXPOSE 8080

ENV NODE_ENV=production
RUN npm install 
COPY . /

