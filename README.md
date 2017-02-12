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
the `Compile` button on the right. Wait a second, then you should see some data
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
contract CoderForge{

  address public owner;

  function CoderForge(){
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
