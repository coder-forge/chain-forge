#! /bin/bash

source /root/.nvm/nvm.sh

chown -R root /root/.nvm
chmod -R 777 /root/.nvm

ls -la /root/.nvm

npm install -g ethereumjs-testrpc
