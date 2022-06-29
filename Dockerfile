FROM node:16-alpine

RUN mkdir -p /usr/src/app
ENV PORT 80

WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app

RUN yarn install --production

ENV NODE_ENV=production

COPY . /usr/src/app

RUN yarn build

EXPOSE 80
CMD [ "yarn", "start" ]