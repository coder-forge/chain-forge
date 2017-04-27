FROM node:7.4-alpine

RUN mkdir -p /usr/src/chain-forge
WORKDIR /usr/src/chain-forge

COPY ./package.json package.json
COPY ./.bowerrc .bowerrc
COPY ./bower.json bower.json
RUN apk add -t .gyp --no-cache git python g++ make \
    && npm install -g truffle@3.2.x \
    && npm install -g bower@1.8.x \
    && npm install \
    && bower install --allow-root \
    && apk del .gyp

COPY . /usr/src/chain-forge
RUN truffle compile
RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "dev"]
