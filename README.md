# Chain Forge

A blockchain tutorial from [Coder Forge](http://coderforge.io).

### Parts
|Part 1|
|[Part 2](https://github.com/coder-forge/chain-forge/tree/part-2)|

# Part 1

First we will get all our tools setup:

 - `node`: The main runtime environment we will be using.
 - `git`: The code management system.

Next we'll install our required node packages
 - `truffle`: A framework for developing web services with blockchain.
 - `testrpc`: A blockchain that runs locally, ie on your machine, for development.
 - `bower`: A package manager for front end javascript libraries, eg jQuery

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
