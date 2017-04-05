## Chain Forge

A blockchain tutorial from [Coder Forge](http://coderforge.io)

*Currently this project is a work in progress.*
*Project is conceptual only, not ready for production servers.*
*You have been warned... 3 times*

Another shout...
*Unstable. This project is currently being bumped up to truffle v3*

*deploying using truffle against `rospen` testnet works as expected. Integrating
with webservices in this repo does not. Security has been integrated, but a
code review by ---blockchain engineer--- is need and recommended before using
this... ie... help please*

# About truffle-init-webpack
This project is build using the webpack project with Truffle. Includes contracts, migrations, tests, user interface and webpack build pipeline.
Project built using [truffle-init-webpack](https://github.com/trufflesuite/truffle-init-webpack)

For the tutorial checkout this branch [TBA]

## Installation
```
npm install -g ethereumjs-testrpc truffle
npm install
```

## Running

Copy the file `config/params-dist.json` to `config/params.json`, and update if
needed but defaults should work fine.

In first terminal window...
```
npm run testrpc
```
In second terminal run...
```
truffle compile
truffle migrate
npm run build
npm run dev
```

Now visit http://localhost:8080
