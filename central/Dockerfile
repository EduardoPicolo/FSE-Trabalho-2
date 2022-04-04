FROM node:14

WORKDIR /www

COPY package*.json ./

RUN yarn install

COPY . .

EXPOSE 3000
EXPOSE 10049

RUN yarn build

CMD  yarn start