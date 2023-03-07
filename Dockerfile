# syntax=docker/dockerfile:1
   
FROM node:18-alpine
WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .

RUN npm i && npm cache clean --force

COPY . .

RUN yarn install --production

EXPOSE 4000

CMD [ "npm", "start" ]