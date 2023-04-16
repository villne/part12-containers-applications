FROM node:16

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY --chown=node:node . .
RUN npm ci --only=production

ENV DEBUG=playground:*

USER node
CMD npm start