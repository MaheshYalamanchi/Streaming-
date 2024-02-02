### STAGE 1: Build ###
#FROM node:12.7-alpine AS build
FROM node:18.17.0 AS build

RUN npm config set registry http://registry.npmjs.org/ 

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 8000

CMD ["node","server"]