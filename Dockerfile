FROM node:iron-alpine

RUN mkdir -p /usr/src/app \
 && chown -R node:node /usr/src

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
USER node
RUN yarn install --pure-lockfile --only=production
COPY --chown=node:node . .

EXPOSE 7832
CMD ["yarn", "start"]