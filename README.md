## Chain Forge

A blockchain tutorial from [Coder Forge](http://coderforge.io)

*Currently this project is a work in progress.*
*Project is conceptual only, not ready for production servers.*
*You have been warned... 3 times*

Update...
*deploying using truffle against `rospen` testnet works as expected. Integrating
with webservices in this repo does not. Security has been integrated, but a
code review is definitely needed*

### About truffle-init-webpack

This project is build using the webpack project with Truffle. Includes contracts, migrations, tests, user interface and webpack build pipeline.
Project built using [truffle-init-webpack](https://github.com/trufflesuite/truffle-init-webpack)

# Explaination

This dapp allows individual entities within a federated non profit source their
own funding. In the case of the Coder Forge Foundation, this means that
individual forges can independencly source their own funds. Upon registration
of a new forge through the website, a contract, that will accept funds from
anyone but will only release them to the orginaser, is created and deployed to
the `Ethereum` network.

Not everyone that is organising a forge will have knowledge, or even interest,
in blockchain development, therefore the service needs to cater for all as much
as possible. So the creation of a contract that can accept funds from anybody
but only release to the organiser sounds like the perfect solution.

The most simpler solution would be to leave instructions on how to obtain a
blockchain wallet and use it. But that would leave us without an excuse for a
training project, and expecialy it wouldn't be half as much fun ;)

# Tutorial

Part 1: Using only the solidity language and an internet browser, build the
social contract concept.

Part 2: Truffle, testrpc, parity. Build and test contracts

Part 3: Truffle, webpack. Build the web front end

Part 4: Setup deployment and docker

# Methods used

Special caution must be taken to cover all attack surfaces when dealing with
contract creation and sending Ether. These are mainly loops that can
continuously drain `gas` from the account. The best way to circumvent this is
to store the values in an array of account address, one address for each forge:

```solidity
mapping(address=>uint) balances
```

However, in our situation this would tie us to the individual wallets created
for the forges. We would become the manager of their funds, where as if we give
them their own wallet then we completely decomplex our processes, keep the
initial reasoning for funding, and thus increase scalability.

The solution we are using is...

```solidity
  // release funds to organizer
  function payOrganizer() payable returns(bool){
      uint fund = funds[_organiser];
      funds[_organiser] = 0;

      if(!_organiser.send(fund)){
          TransferStatus('it failed');
          funds[_organiser] = fund;
      }
      else{
          TransferStatus('success');
      }
      return true;
  }
```

It is hoped that, very soon, this will also be turned into a tutorial.

## Installation

Download and install [Parity](https://github.com/paritytech/parity/releases).
This will run as our node on the Ethererum blockchain.

```
npm install -g ethereumjs-testrpc truffle
npm install
```

## Connecting to the Ethereum Blockchain's Testnet

In first terminal window...
```
parity --geth --force-ui --chain=ropsten  --jsonrpc-cors "http://localhost:8081"
```

Parity's web interface for its node on the ethereum network is at:
http://localhost:8080

Next create a default account using the web interface. This default account is
also known as a `coinbase`.

## Starting the Chain Forge Dapp

Make sure you leave parity running.

#### Configuration

Copy the file `config/params-dist.json` to `config/params.json`.
Enter the coinbase's (default account in parity) address as the `coderforge`
param.

#### Running

In a second terminal run...

```
truffle compile
truffle migrate
npm run build
npm run dev
```

The Chain forge app can be found at: http://localhost:8081
