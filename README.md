# Chain Forge

A blockchain tutorial from [Coder Forge](http://coderforge.io).

### Parts
|[Part 1](https://github.com/coder-forge/chain-forge/tree/part-1)|
|Part 2|

# Part 2

Next we will work on the front end app:

 - clearing default truffle
 - add empty contracts
 - migrate contracts
 - run unit tests on contracts

### Remove sample contracts

Delete the following sample contracts added by `truffle`:
(make sure you leave the file `contracts/Migrations.sol`)

 - contracts/ConvertLib.sol
 - contracts/MetaCoin.sol
 - test/metacoin.js

### Create default contracts for our project

Create the following files with the code below:

`contracts/CoderForge.sol`
```solidity
pragma solidity ^0.4.2;

import 'Forge.sol';

contract CoderForge{
}
```

`contracts/Forge.sol`
```solidity
pragma solidity ^0.4.2;

contract Forge{
}
```

### Setup Migrations

Truffle uses the concept of migrations for compiling and deploying contracts. In order to prevent race conditions when your deploying multiple contracts you can specify the order they are deployed.

Replace all the code in `migrations/2_deploy_contracts.js` with the following:
```javascript
module.exports = function(deployer) {
  deployer.deploy(CoderForge);
  deployer.deploy(Forge);
};
```

### Compiling and deploying your (empty) contracts

We now have two very basic and simple contracts, that do absolutely nothing - and yes they can pointlessly accept funds, but the funds can't be collected :P

Next to deploy our pointless contracts to our local blockchain (`testrpc`). Open up two terminals...

In `1st` terminal:
```bash
testrpc
```

This will spin up a local blockchain and provision it with 10 accounts, the public and private keys of each will be shown in the output. When you see the following: `Listening on localhost:8545` then in `2nd` terminal run:
```bash
truffle migrate
```

### Tests for our contracts

CoderForge always promotes `TDD`, where possible. So we will now create some test cases for our contracts.

`test/CoderForge.test.js`
```javascript
contract('CoderForge', function(accounts){

  let cf;

  it('deploys contract', (done)=>{

    cf = CoderForge.at(CoderForge.deployed().address);
    assert.isTrue(true);
    done();
  });
});
```

`test/Forge.test.js`
```javascript
contract('Forge', function(accounts){

  let forge;

  it('deploys contract', (done)=>{

    forge = Forge.at(Forge.deployed().address);
    assert.isTrue(true);
    done();
  });
});
```
