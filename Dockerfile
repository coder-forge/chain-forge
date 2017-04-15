FROM ubuntu:17.04
SHELL ["/bin/bash", "-c"]

RUN apt-get update \
  && apt-get install -y curl git python g++ make \
  && apt-get -y autoclean

RUN mkdir /root/chain-forge
COPY . /root/chain-forge
RUN chmod -R +x /root/chain-forge/bin/*
WORKDIR /root/chain-forge

ENV NVM_DIR /root/.nvm
ENV NODE_VERSION 7.9.0

RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash

RUN source $NVM_DIR/nvm.sh \
  && nvm install $NODE_VERSION \
  && nvm alias default $NODE_VERSION \
  && nvm use default

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

RUN node -v
RUN npm -v

RUN npm install

RUN node -v
RUN npm -v

CMD ["bash" "/root/chain-forge/bin/start.sh"]
