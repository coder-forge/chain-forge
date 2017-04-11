## Chain Forge

A blockchain tutorial from [Coder Forge](http://coderforge.io)

*Currently this project is a work in progress.*
*Project is conceptual only, not ready for production servers.*
*You have been warned... 3 times*

Update...
*deploying using truffle against `rospen` testnet works as expected. Integrating
with webservices in this repo does not. Security has been integrated, but a
code review is definitely needed*

# About truffle-init-webpack

This project is build using the webpack project with Truffle. Includes contracts, migrations, tests, user interface and webpack build pipeline.
Project built using [truffle-init-webpack](https://github.com/trufflesuite/truffle-init-webpack)

# Explaination

Coming soon...

## Installation

```
npm install -g parity ethereumjs-testrpc truffle
npm install
```

## Connecting to the Ethereum Blockchain's Testnet

In first terminal window...
```
parity --geth --force-ui --chain=ropsten
```

Parity's interface for its node on the ethereum network is at: http://localhost:8080
Create a default account, also known as a coinbase.

## Settings

Copy the file `config/params-dist.json` to `config/params.json`.
Enter the coinbase's (default account in parity) address as the `coderforge`
param.

## Starting the Chain Forge Dapp

In a second terminal run...
```
truffle compile
truffle migrate
npm run build
npm run dev
```

The Chain forge app can be found at: http://localhost:8081
