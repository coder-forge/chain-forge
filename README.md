# Chain Forge

A blockchain tutorial from [Coder Forge](http://coderforge.io).

### Parts
|[Part 1](https://github.com/coder-forge/chain-forge/tree/part-1)|
|[Part 2](https://github.com/coder-forge/chain-forge/tree/part-2)|
|Part 3|

# Part 3

In this section we will:

 - Write the test cases for our contracts
 - Use solidity compiler for testing
 - Pass our test cases

### First, the test cases

The end goal is that when a user registers they will have their own `wallet`, or
`smart contract` in the case of Ethereum, to manage their own funds. So our
first test is that our parent contract: `CoderForge` can create a child contract,
aka `Forge`.

We want to make sure we are testing a clean javascript instance of the CoderForge
contract, so we will add a `beforeEach` that will run before every test case.

Replace everything in `test/CoderForge.test.js` with the following:

```javascript
'use strict';

contract('CoderForge', function(accounts){

  //globals
  let cf, forge;

  beforeEach((done)=>{

    // test on a clean instance
    cf = CoderForge.at(CoderForge.deployed().address);
    done();
  });


  it('constructs new forge', ()=>{

    // create forge.
    return cf.newForge();

    // test forge contract exists
  });

  it('stores forge address', ()=>{

    return cf.getForge(forge.index);
  });
});
```

Now we have to get them to pass :) Running our tests should rightly fail our 2
tests above in `tests/CoderForge.test.js` and pass 1 test in `testes/Forge.test.js`
...

```bash
truffle test
```

### Prototyping our contracts

With new tech, comes new tools and the online solidity compiler is excellent.
It lets you put your contracts in an editor and compiles and deploys to a test
blockchain in your browser.

https://ethereum.github.io/browser-solidity/

When you head there you should see a sample contract, a voting contract. Click
the `Create` button on the right. Wait a second, then you should see some data
filling in the following fields:
 - `Bytecode`
 - `Interface` (aka `Abi`)
 - `Web3 deploy`

#### Bytecode

This is what gets put on the blockchain. It is a representation of your contract
in a language that blockchain understand. We work in `solidity` and blockchain
works in `bytecode`.

In fact you can copy and paste the ByteCode into `geth` on the command line and
deploy the same contract. But that is for another tutorial.

#### Interface (aka Abi)

This can be seen as an array of the function signatures. What this means is it
is an array detailing what public variables, methods and calls the contract has.
With frameworks like `web3` we can connect to a blockchain, then by injecting
this abi array we can interact with the contract. The contracts bytecode would
have be deployed to the blockchain first.

#### Web3 deploy

Don't want to deploy ByteCode yourself? (seriously we have to do that as a
  tutorial). Don't want to inject the Abi... then copy and paste the code
  here into any html page with the `Web3` javascript library. Web3 would have
to be configure to connect to right blockchain first.


Besides the above 3 fields, the online compiler can also be used for Prototyping
your contracts and especially measuring gas.

#### Gas

When we write to a blockchain it costs processing to update all the nodes,
validate etc. This costs us, but it costs a fraction, of a fraction. In
Ethereum we deal with units of gas. Different operations have different costs,
so estimating this for a method can be difficult.

Using the online compiler we can see in the `Web3 deploy` textarea that it
costs `4700000` gas to deploy the contract.

Very importantly - reading data from the blockchain is `FREE` - it costs nothing
to read.

### Setup our Contracts in online compiler

Click new file icon, at the top left of the document window. Create two new
files (you can set their name by click their relevant tabs):
 - CoderForge.sol
 - Forge.sol

And enter in the relevant code from our files in `contracts/`.

The constructor for the contract is a public method with the same name. This
will only every get called once, because although our contract is copied across
many nodes on the network, it only ever exists as one thing. It could be seen
as a singleton. The constructor is only ever called when a contract is deployed.

In solidity online compiler create a constructor method for both contracts:

`CoderForge.sol`

```javascript
pragma solidity ^0.4.2;

contract CoderForge{

  address public owner;

  function CoderForge(){
    owner = msg.sender;
  }
}
```

`Forge.sol`

```javascript
pragma solidity ^0.4.2;

contract Forge{

  address public owner;

  function Forge(){
    owner = msg.sender;
  }

}
```

Now click the `Create` button and your changes should be deployed. Notice that
we have created a public variable of the dataType address. Then in the
constructor `CoderForge` we set `msg.sender` as the owner.

`msg.sender` is the address used to deploy the contract, the address of the
root owner. Through out the contract we will check that `msg.sender==owner` to
make sure its only us that have control where we need it.

Like above, set a public address owner for the `Forge.sol` contract and have
its value set to the deployer, like we have just done with `CoderForge.sol`.
Remember to change the names `CoderForge` to `Forge`.

### Parent creates child

Now we are going to get `CoderForge` to deploy a `Forge` by calling a public
method. Add the following method to our `CoderForge` contract:

```javascript
function newForge(bytes32 name) returns (address){

  Forge forge = new Forge();
  return forge;
}
```

Oops. We got an error!

The online compiler will nicely error report. The error lets us know that it
can't find the Forge contract. So under `pragma solidity ^0.4.2;` use the
`import` keyword to import the Forge contract.

`CoderForge.sol`

```javascript
pragma solidity ^0.4.2;

import 'Forge.sol';

contract CoderForge{
...
}
```

Now click the `Create` button to deploy the new changes. This will result in a
completely new contract, remember we can't change the previous deployed contract,
only use its methods and delete/re-create it.

Once the new contract has been deployed you will see the new method show up in
the panel on the right: `newForge`, with a text input. Here we will add a string
"My Forge" (make sure you also wrap the text in double quotes), then click
the `newForge` button.

Viola. Our parent contract creates a child, the CoderForge parent has created a
Forge child contract.

Now make sure our code in solidity compiler is in the relevant files in `test/`
folder. Run the tests again:

```bash
truffle test
```

Still same result? (2 failing and 1 passing)

In our `CoderForge::newForge()` call we need to provide a string. Solidity uses
the dataType `bytes32` and javascript uses `bytes16` (i think). We can let the
tools do the transformations here, in this case `web3`.

In the unit test for `newForge` in the file `test/CoderForge.test.js`, enter
in a string as the forge name like so:

```javascript
  it('constructs new forge', ()=>{

    // create forge.
    return cf.newForge('My test forge');

    // test forge contract exists
  });
```

Yay! we now have 2 tests passing and 1 failing...

```bash
$ truffle test
Compiling CoderForge.sol...
Compiling Forge.sol...


  Contract: CoderForge
    ✓ constructs new forge (50ms)
    1) stores forge address
    > No events were emitted

  Contract: Forge
    ✓ deploys contract


  2 passing (496ms)
  1 failing

  1) Contract: CoderForge stores forge address:
     TypeError: Cannot read property 'index' of undefined
      at Context.it (test/CoderForge.test.js:26:24)
      at Context.done (test/CoderForge.test.js:12:5)
```

### Keeping a record of our forges

So parent contract can create a child, we can call it to create as many children
as we need. In the final app a registration form will trigger this, thus giving
the wallet, or contract, to every registered forge.

But we need to keep track. At the moment there is nothing to relate these. It
would be helpful to keep a record of these child contracts... so, in the
`CoderForge` contract we will add a new public property called `forges`, that
is an array of addresses. When a forge is created its address is pushed to the
array and its index, or where in the array its added, is returned as a number.

So make the changes in the solidity online compiler for `CoderForge.sol`, it
should now look like:

```javascript
pragma solidity ^0.4.2;

import 'Forge.sol';

contract CoderForge{

  address public owner;
  address[] public forges;

  function CoderForge(){
    owner = msg.sender;
  }

  function newForge(bytes32 name) returns (uint256){

    Forge forge = new Forge();

    uint256 index = forges.push(forge);   // returns new array length;
    index--;

    return index;
  }
}
```

Click the `Create` button, enter some text in `newForge` input (don't forge to
wrap your text in quotes... eg `"my cool forge"`). Click the `newForge` button.

You can now see in the result the result in the `Decoded` value:

```bash
Result: "0x0000000000000000000000000000000000000000000000000000000000000000"
Transaction cost: 158829 gas.
Execution cost: 136981 gas.
Decoded:
  1. uint256: 0
```

Here the value returned (Decoded) is `0` and is a `uint256` dataType. The first
element in our `forges[]` array is `0`. Use the same input and button to add
another forge, the result should be `1`, and another the result would be `2`,
etc etc.

Next update our test case for creating a new forge to store the returned index
in a global that we can use to check the forge is created...

`test/CoderForge.test.js`

```javascript
  it('constructs new forge', ()=>{

    // create forge.
    return cf.newForge('My test forge')
      .then(index => {

        forgeIndex = parseInt(index);
      });

    // test forge contract exists
  });
```

Run our tests again, and they fail! The reason is that web3 is returning the
transaction hash. Everytime a read or write is made to the blockchain it is
packed into a transaction, with each transaction having a unique hash. This is
not what we want, we want the same result as in our online compiler.

To circumvent this we will use `event`'s and add a `watcher`, aka a `listener`.
In our method `newForge` we will call an event that will log our index value.
Then we will tell `web3`, which is used by Truffle tests, to listen for these
events. Add the following to the top of our CoderForge contract in the online
browser...

`CoderForge.sol`

```javascript
pragma solidity ^0.4.2;

import 'Forge.sol';

contract CoderForge{

  address public owner;

  address[] public forges;

  event LogForge(
    uint256 index
  );
...
}
```

And in our `newForge` method we will call the event...

```javascript
function newForge(bytes32) returns (address){

  Forge forge = new Forge();

  uint256 index = forges.push(forge);   // returns new array length;
  index--;

  LogForge(index);

  return index;
}
```

Click `Create` and you will see in the right that the index is logged. Next to
get our tests to listen for this. Our test for CoderForge.sol should now look
like...

`CoderForge.test.js`

```javascript
it('constructs new forge', (done)=>{

  // create forge.
  return cf.newForge('My test forge')
    .then(transHash => {

      let logForge = cf.LogForge({transactionHash: transHash, fromBlock: 'latest'});

      // watch events for new forge.
      logForge.watch(function(err, res){
        if(err) throw err;

        logForge.stopWatching();
        forgeIndex = res.args.index.toString();
        done();
      });
    });
});
```

Run our tests again and they should now pass :)

```bash
$ truffle test
Compiling CoderForge.sol...
Compiling Forge.sol...


  Contract: CoderForge
    ✓ constructs new forge (68ms)
    ✓ stores forge address (46ms)

  Contract: Forge
    ✓ deploys contract


  3 passing (524ms)
```

Continue to |[Part 4](https://github.com/coder-forge/chain-forge/tree/part-4)|...
