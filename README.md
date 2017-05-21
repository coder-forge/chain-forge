## Chain Forge

A blockchain tutorial from [Coder Forge](http://coderforge.io)

### Parts
|[Part 1](https://github.com/coder-forge/chain-forge/tree/part-1)|
|Part 2|
|[Part 3](https://github.com/coder-forge/chain-forge/tree/part-3)|
|[Part 4](https://github.com/coder-forge/chain-forge/tree/part-4)|
|[Part 5](https://github.com/coder-forge/chain-forge/tree/part-5)|

# Part 2

What we are going to attempt here is run a `mock` ethereum node locally, to
build out and test handling of funds (`ether`) between our contracts and the
organiser. With this there will be a second tool that will server our web
application and deploy our contracts to the `mock` ethereum node, then later
deploy to the `ethereum testnet`. We will leave deploying to the live
ethereum network for you to do, with proper instructions of course ;) There
are many tools for the job:

 - [testrpc](https://github.com/ethereumjs/testrpc) mock ethereum node to build and test against.
 - [geth](https://github.com/ethereum/go-ethereum/wiki/geth) command line for creating local private network or running as node.
 - [parity](https://github.com/paritytech/parity) mock and live node in one, has handy web interface as well.
 - [truffle](http://truffleframework.com/) tool for building web interfaces and deploying contracts to mock or
 live nodes.


### Tools

The tools we will be using from the list above are:

 - [testrpc](https://github.com/ethereumjs/testrpc)
 - [truffle](http://truffleframework.com/) For our Dapp.

Both above require `nodejs` to be installed. I highly recommend using a `node
version manager` for your particular operating system. Once you have node
installed then move on to install `testrpc` and truffle...

##### Install Truffle

Truffle serve's two purposes:

 1. A deploy tool.
 2. A webserver provitioned for `Dapp`'s.

As a deployment and development tool we will use truffle for deploying our
contracts and building the web application, all of which compose our Dapp.

We can easily install it with the command:

```bash
npm install -g truffle
```

If you have any issues installing please leave an issue, that way we can
improve this documentation where ever possible.

##### Install Testrpc

Fairly simple...

```
npm install -g ethereumjs-testrpc
```

### Setting up our contracts in truffle

Next we will import our `Parent` and `Child` contracts to `truffle` and deploy
them to our mock blockchain being managed by `testrpc`. First delete
`ConvertLib.sol` and `MetaCoin.sol` files from `/contracts`, make sure you
leave the `Migrations.sol` file there as its part of the `truffle` core.

Next copy and past the code we have so far in `Browser Solidity` into two
new files in the `/contracts` folder, name them `Child.sol` and `Parent.sol`
respectively.

There is a file for handling the "loading" of contracts to be deployed, you
can find it in `/migrations/2_deploy_contracts.js`. Here we can state which
contracts to load and when. For our purposes it doesn't matter though so we
will keep it simple, replace the contents of that file with the following...

```javascript
var Parent = artifacts.require('./Parent.sol');
var Child = artifacts.require('./Child.sol');

module.exports = function(deployer) {
    deployer.deploy(Parent);
    deployer.deploy(Child);
};
```

There is one other change we need to make. Our `import` statement in the
`Parent` contract is looking for a file called `Child`, which is now called
`Child.sol`. Change the import state to reflect that.

`Parent`

```javascript
pragma solidity ^0.4.10;

import './Child.sol';

contract Parent{
    ...
}
```

Now compile the solidity contracts using:

```
truffle compile
```

Another issue you might run into is the compiler version. We were using version
`^0.4.10` in `Browser Solidity` but the one on your machine may be different. If
you get an error like the following...

```
/opt/coder-forge/chain-forge/contracts/Child.sol:1:1: Error: Source file requires different compiler version (current compiler is 0.4.8+commit.60cc1668.Emscripten.clang - note that nightly builds are considered to be strictly less than the released version
pragma solidity ^0.4.10;
^----------------------^
,/opt/coder-forge/chain-forge/contracts/Parent.sol:1:1: Error: Source file requires different compiler version (current compiler is 0.4.8+commit.60cc1668.Emscripten.clang - note that nightly builds are considered to be strictly less than the released version
pragma solidity ^0.4.10;
^----------------------^
Compiliation failed. See above.
```

Change the version in the files `Child.sol` and `Parent.sol` to match the
version number the error states is your current. In the error above this would
be `0.4.8` because of the line `(current compiler is
0.4.8+commit.60cc1668.Emscripten.clang`.

Now deploy using the `migrate` command...

```
$ truffle migrate
Using network 'development'.

Running migration: 1_initial_migration.js
  Deploying Migrations...
  Migrations: 0x62d69f6867a0a084c6d313943dc22023bc263691
Saving successful migration to network...
Saving artifacts...
Running migration: 2_deploy_contracts.js

  Deploying Parent...
  Parent: 0x7c276dcaab99bd16163c1bcce671cad6a1ec0945
  Deploying Child...
  Child: 0x3f85d0b6119b38b7e6b119f7550290fec4be0e3c
Saving successful migration to network...
Saving artifacts...
```

So the address's of our parent and child contracts are (using the above output)

 - parent: `0x7c276dcaab99bd16163c1bcce671cad6a1ec0945`
 - child: `0x3f85d0b6119b38b7e6b119f7550290fec4be0e3c`

### Recap

 - We have `Solidity Browser` to prototype our contracts
 - Next we run a local mock blockchain locally using `testrpc`
 - Finally we have used `truffle` to deploy our contracts to our local blockchain

In the next section we will write up some tests for the functionality we have
at the moment.
