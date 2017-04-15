#! /bin/bash

export NVM_DIR="$HOME/.nvm"
source $NVM_DIR/nvm.sh
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
nvm install 7.9.0
nvm alias default 7.9.0

npm install -g  ethereumjs-testrpc truffle
