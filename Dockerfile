FROM node:7.4-alpine

RUN mkdir -p /usr/src/chain-forge
WORKDIR /usr/src/chain-forge

COPY ./package.json package.json
RUN apk add -t .gyp --no-cache git python g++ make \
    && npm install -g truffle@3.2.x \
    && npm install \
    && apk del .gyp

COPY . /usr/src/chain-forge
RUN npm run build

CMD ["npm", "run", "dev"]
#CMD ["node", "foo"]
