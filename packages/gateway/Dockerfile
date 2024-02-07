FROM node:18

LABEL Maintainer="Emmanuel ADEBAYO <emmanueltolu.adebayo@gmail.com>"
LABEL For="Gateway API"

RUN apt-get update && apt-get install -y wget

RUN wget https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-linux-amd64-v0.6.1.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-v0.6.1.tar.gz \
    && rm dockerize-linux-amd64-v0.6.1.tar.gz


WORKDIR /usr/src/app

COPY ./packages/gateway/package*.json ./

RUN npm install --force

COPY ./packages/gateway .

ENV PORT=$GATEWAY_PORT
EXPOSE $GATEWAY_PORT

RUN npm run build

CMD ["dockerize", "-wait", "tcp://user:3000", "-timeout", "30s", "npm", "run", "start:prod"]