FROM node:latest

#create app directory
WORKDIR /usr/pocket-safe

RUN npm i -g @nestjs/cli

RUN npm install -g pnpm

COPY ./package.json ./

RUN pnpm i

COPY . .

EXPOSE 3000

CMD [ "pnpm","start:dev" ]