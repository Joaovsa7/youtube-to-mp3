FROM node:16-alpine

RUN mkdir -p /usr/src/app
ENV PORT 3000

WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app

RUN yarn install --production

ENV NODE_ENV=production

COPY . /usr/src/app

RUN npm run build

EXPOSE 3000
CMD [ "npm", "run","start" ]