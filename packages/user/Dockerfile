FROM node:18

LABEL Maintainer="Emmanuel ADEBAYO <emmanueltolu.adebayo@gmail.com>"
LABEL For="User API"

WORKDIR /usr/src/app

COPY packages/user/package*.json ./

RUN npm install --force

COPY ./packages/user .


ENV PORT=$USER_PORT
EXPOSE $USER_PORT

RUN npm run build

CMD ["npm", "run", "start:prod"]