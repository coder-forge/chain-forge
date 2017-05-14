## Chain Forge

A blockchain tutorial from [Coder Forge](http://coderforge.io)

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

 - [parity](https://github.com/paritytech/parity) Ethereum Node.
 - [truffle](http://truffleframework.com/) For our Dapp.

Both above require `nodejs` to be installed. I highly recommend using a `node
version manager` for your particular operating system. Once you have node
installed then move on to install parity and truffle...

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

##### Install Parity

Parity is a cool tool for Dapp development. It can sync to the live ethereum
network, the test network, or run a local mock network. Also the team at
`paritytech` have provided us with installers, head to the releases section
and install the revelant package for your operating system...

https://github.com/paritytech/parity/releases

You can find documentation for Parity in their [github wiki](https://github.com/paritytech/parity/wiki).
Of special interest to us is the instructions for creating a [local private
development chain](https://github.com/paritytech/parity/wiki/Private-development-chain)

##### Setting up for mock network

First we will start our Development Parity node with the command. Do note that
this command will run a ethereum blockchain locally, so can't accept real funds
and any 'ether' generated is valueless, its just for development purposes.

```bash
parity --chain dev
```

```notice
**notice**
If you ever need to reset parity completely without uninstall / install, then
deletes its data folder. Note if you have any address created/managed with
parity, especially  on the live net, they will also be deleted and can't be
revived unless backed up first.

On some machines the folder should be one of the following:

 - `~/.parity`
 - `~/.local/share/io.parity.ethereum/`
```

As the [documentation](https://github.com/paritytech/parity/wiki/Private-development-chain)
states, you can create default accounts using the command line or the handy
user interface at: [http://localhost:8080](http://localhost:8080)

We will describe setting up using the user interface here, head to
[http://localhost:8080](http://localhost:8080)

 1. 1st screenshot
 2. 2nd screenshot
 3. 3rd screenshot

This address you created is the default address, also known as the coinbase.

Next we will create another address that `Parity` will nicely fill with ether,
so we can play about.

 1. click on `Create Account`
 2. click on `Recovery Passphrase`
 3. give it only an account name, I use `fund account` as this will hold all our
 mock ether.
 4. click create.

In the accounts page you will now see another account with an unreal amount of
ether. A sick amount. Obviously this will only work on your local development
net and not on the live Ethereum network.

##### Talk to our private net

Next we are going to use a node library called `web3`, this is perfect for
communicating with the a blockchain network. The `RPC` port of parity is set at
default: `8485`. These commands can easily be put in a file and run with node,
but its much easier to use from the node console as you get method lists from
objects.

From the directory you ran `truffle init webpack` from, should be current,
start the node console with:

```
node
```

In the output load the `web3` package, should have been auto installed with
`truffle` command above...

```node
> Web3 = require('web3');    // notice capital 'W'
```

which should return

```
{ [Function: Web3]
  providers:
   { HttpProvider: [Function: HttpProvider],
     IpcProvider: [Function: IpcProvider] } }
```

Next create an instance connected to our local RPC port that parity has
exposed...

```node
> web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
```

To test that we are connected we will check the balances of our two accounts.

```
> web3.eth.accounts
```

This will return a list of accounts that you have. Which should be two, the
initial account, aka `coinbase`, and the account populated with dummy ether, Which
I named `fund account`.

### Deploying to our private net

Next we will import our `Parent` and `Child` contracts to `truffle` and deploy
them to our private blockchain being managed by `Parity`. First delete
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
truffle migrate
```

When you do this it will hang. The reason is that you need to unlock the
account that is paying for this deployment. In the real ethereum world it will
use the account returned by `web3.eth.coinbase`, unless you specify otherwords.
In this development environment it should automatically use the funded account
we created earlier.

You will need to `unlock` the account by providing the password. In real world
parity, the popular Mist chrome plugin, or the command line can be used to
unlock the paying account. For us we will use the handy parity interface. Go
back to the parity UI and click on the `signer` tab.

Click `confirm request`. You will have to do this for each of the truffle
migration contract, the parent contract and the child contract.

Now check your console and you should see the address's of your new contracts..

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

Both contracts are created but we only need to interact with one, the parent
contract. So lets add this to our parity account. Select the `Address Book` tab
and then `add new`. Enter in the address reported by truffle migrate above and
give it the name `Parent Contract`. Click `save address`.

### Recap

 - We have `Solidity Browser` to prototype our contracts
 - Next we run a private mock blockchain locally using `Parity`
 - Finally we have used `truffle` to deploy our contracts to our private blockchain

In the next section we will write up some tests for the functionality we have
at the moment.
