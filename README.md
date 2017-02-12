# Chain Forge

A blockchain tutorial from [Coder Forge](http://coderforge.io).

### Parts
|[Part 1](https://github.com/coder-forge/chain-forge/tree/part-1)|
|Part 2|

# Part 2

Next we will:

 - clear default truffle samples
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

```javascript
pragma solidity ^0.4.2;

import 'Forge.sol';

contract CoderForge{
}
```

`contracts/Forge.sol`

```javascript
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

Next we deploy our empty contracts to our local blockchain (`testrpc`). Open up
two terminals...

In `1st` terminal:

```bash
testrpc
```

This will spin up a local blockchain and provision it with 10 accounts, the
public and private keys of each will be shown in the output. When you see the
following: `Listening on localhost:8545` then in `2nd` terminal run:

```bash
truffle migrate
```

In the output you can see truffle compiling and deploying the code. You are also
provided with the deployed contracts address's. eg:

```
...
Running migration: 2_deploy_contracts.js
  Deploying CoderForge...
  CoderForge: 0x45f5dd7acc233ffa46e41ae67936f777b8b77122
  Deploying Forge...
  Forge: 0x987859cfbb6315f67743a70f45aef62ea54b9529
...
```

Part of the migration is also creating javascript objects for each of the
contracts. We will use these object later to interact with each contract.

### Tests for our contracts

CoderForge always promotes `TDD`, where possible. For the purpose of this
tutorial we've created our contracts first, but in the TDD world we would have
written these first.

So we will now create some test cases for our contracts. Unit testing with
truffle follows the same pattern as `Mocha`, with the added `contract()`
function. The signature for this is:

```
contract('ContractName', fn(accounts))
```

The accounts parameter in the callback function returns an array of the 10
accounts created when testrpc is started. Later we will use these accounts for
testing. For now create the following two test cases...

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

Now we can run out tests in the 2nd terminal using truffle. (make sure that
  testrpc is still running in the 1st terminal).

```bash
truffle test
```

Continue to |[Part 3](https://github.com/coder-forge/chain-forge/tree/part-3)|...
