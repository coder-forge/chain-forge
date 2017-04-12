# Chain Forge

A blockchain tutorial from [Coder Forge](http://coderforge.io).

### Parts
|Part 1|
|[Part 2](https://github.com/coder-forge/chain-forge/tree/part-2)|
|[Part 3](https://github.com/coder-forge/chain-forge/tree/part-3)|
|[Part 4](https://github.com/coder-forge/chain-forge/tree/part-4)|

# Part 1

An explaination of the `Dapp` and the tools that we will be using.


### Tools

 - parity
 - truffle
 - testrpc
 - remix solidity browser

##### Parity

Remembering that blockchain is a decentralized network, meaning that there is
no one ip address, or url, to connect to. When working with blockchian you set
up  a node on the network, like everyone else.

Parity is your node on the network. It provides a web interface for managing
accounts and also an API localy that you can connect to and issue commands. It
is normally this API that websites would interact with in order to do actions
on the blockchain.

##### Truffle

Truffle serve's two purposes:

 1. A deploy tool.
 2. A webserver provitioned for `Dapp`'s.

As a deployment tool we will use truffle for deploying our contracts to the
ethereurm testnet and also locally. Once our contracts are good, and working as
expected, then we will use truffle to provition a webserver, ready to connect
to our nodes API's!

##### Testrpc

With a node on the testnet, or the live ethereum network, it has to be in sync.
This can be irritating if your node has been down for a day or two. Testrpc is
a mock node that runs localy. You don't have to be synced with it and its API's
are near perfect match - although there can be issues when new contracts need to
be mined.

##### Remix Solidity Browser

An online IDE that allows quick prototyping of contracts. With realtime code
validation and also it connects easily with `testrpc`.

### Install NodeJS - NVM

The repo is built using node version `6.9.1`. We recommend using a node version
manager to easily swap between versions.

 - OSX & Linux: [NVM](https://github.com/creationix/nvm#installation)
 - Windows: [NVM Windows](https://github.com/coreybutler/nvm-windows/wiki)

If you like you can install without a version manager. You can find a list of
node releases [here](https://nodejs.org/en/download/releases/). Once you have
node js installed you can check the current version with:

```bash
node -v
```

### Install Dependencies - npm packages

Once `node` is installed you can install the required dependencies with the
following line (this may take a while for some, go grab a coffee ;) ):

```bash
npm install -g truffle ethereumjs-testrpc bower
```

### Project Folder

Once installed we will initiate our project with truffle. Create a project
folder and change directory into it. Then run the command:

```bash
truffle init
```

This should give you the same files that are in this branch. Truffle gives you
some default contracts and their unit tests to play with. This is the basic
folder structure:

 - app/ Where the webserver files live
 - contracts/ Your solidity contracts for the blockchain
 - migrations/ Sorting order contracts are deployed and their linkage
 - test/ The unit tests directory.

Continue to |[Part 2](https://github.com/coder-forge/chain-forge/tree/part-2)|...
