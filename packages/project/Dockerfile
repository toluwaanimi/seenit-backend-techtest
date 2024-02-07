FROM node:18

LABEL Maintainer="Emmanuel ADEBAYO <emmanueltolu.adebayo@gmail.com>"
LABEL For="Project API"

WORKDIR /usr/src/app

COPY ./packages/project/package*.json ./

RUN npm install --force

COPY ./packages/project .


ENV PORT=$PROJECT_PORT
EXPOSE $PROJECT_PORT

RUN npm run build

CMD ["npm", "run", "start:prod"]