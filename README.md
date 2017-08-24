## Chain Forge

A blockchain tutorial from [Coder Forge](http://coderforge.io)

### Parts
|[Part 1](https://github.com/coder-forge/chain-forge/tree/part-1)|
|[Part 2](https://github.com/coder-forge/chain-forge/tree/part-2)|
|Part 3|
|[Part 4](https://github.com/coder-forge/chain-forge/tree/part-4)|
|[Part 5](https://github.com/coder-forge/chain-forge/tree/part-5)|

# Part 3 - Unit tests

#### Install testrpc

`testrpc` is NOT a blockchain node. It mocks (mimics) a blockchain network and
truffle is built to take advantage of some of `testrpc`'s abilities. This makes
it much much quicker than running our unit tests against a real node like
`parity` or `geth`.

#### About unit tests & test driven development (TDD)

Test driven development is a methodology of writing your `unit tests` first. A
unit test is something that tests a unit of code. In the case of `solidity` it
tests a function.

TDD gets too much of a bad rap, unfortunately, and also by some solid
enginneers. The world of monkey patching and jumping into a project that
permeates software engineering today means there are plenty of false cliche's as
to why you shouldn't use TDD.

These are the reasons `Coder Forge` promotes TDD:
 - Cleaner code
 - Better code quality
 - Better software architecture

As in all trades you are not the only person that will deal with your work ;)

#### Parent::setOwner test

For the purpose of this tutorial we haven't used TDD, as we needed to
demonstrate remix IDE for prototyping ideas. So, lets catch back up with the
code base and write our unit tests now.

Note: All our tests are located in the `test/` folder.

We will start with the `Parent::setOwner` method. In `truffle` our unit tests
are wrapped in a callback to the `contract` function. With each unit test
wrapped as a callback to the `it` function.


`test/Parent.js`

```javascript
var Parent = artifacts.require('./Parent.sol');

contract('Parent', function(accounts){

    const coinbase = accounts[0],
        organiser = accounts[1];

    it('setOwner will set the owner address', function(){

        // set new owner
        return Parent.deployed().then(function(_parent){

            return _parent.setOwner(organiser, {from: coinbase})
                .then(function(result){
                    return _parent.getOwner.call(accounts[0]);
                })
                .then(function(newOwner){
                    assert.equal(newOwner, organiser, 'new owner address not set');
                });
        });
    });

});
```

```javascript
var Parent = artifacts.require('./Parent.sol');
```

Here we are importing a javascript object that represents our contract. It will
define the methods and properties of our contract using whats called an `ABI`.
Basically `Parent` variable above is a javascript representation of our
solidity contract.

```javascript
contract('Parent', function(accounts){

    const coinbase = accounts[0],
        organiser = accounts[1];
    ...
});
```

We pass our test suite as a callback to the 'contract' function. In the `Mocha`
world this would be `describe`. Our callback gets passed an array of the
accounts that are automatically setup in `testrpc`. On the next few lines we
define our accounts.

```javascript
it('setOwner will set the owner address', function()
```

The `it` call takes a descriptive string that will be logged, with a callback
for the unit test to be run.

```javascript
return Parent.deployed().then(function(_parent){

    return _parent.setOwner(organiser);
})
```

With in our unit test's callback we get the deployed instance of our `Parent`
contract as `_parent`.

```javascript
.then(function(){
    return _parent.getOwner.call(accounts[0]);
})
```

Once the call to `setOwner` is done we then get the value of `owner` by calling
the `getOwner` method.

```javascript
.then(function(newOwner){
    assert.equal(newOwner, organiser, 'new owner address not set');
});
```

Run your tests with:

```
truffle test
```

Truffle will create some contracts in `testrpc` and use them to run the tests
against. You will be able to see the transactions in the output of `testrpc`.

Once done then it should report something like...
```
$ truffle test test/Parent.js
Using network 'development'.

Compiling ./contracts/Child.sol...
Compiling ./contracts/Parent.sol...


  Contract: Parent
    ✓ will set the owner address


  1 passing (23ms)
```

This next test case should make sense...

```javascript
it('setOwner only allow owner address', function(){

    // test owner not updated
    return Parent.deployed().then(function(_parent){

        return _parent.setOwner(organiser, {from: coinbase})
            .then(function(result){
                return _parent.getOwner.call(accounts[0]);
            })
            .then(function(owner){
                assert.equal(owner, organiser, 'non owner udpate success');
            });
    });
});
```

### Testing child contract creation

In our `test/Parent.js` file we will add the following:

```javascript
it('will create a child contract', function(){

    const expectedName = "My Cool Event";
    let childAddress, index;

    return Parent.deployed().then(function(_parent){

        _parent.newChild(expectedName, organiser, {from: coinbase})
            .then(function(tx){

                childAddress = tx.logs[0].args.child;
                index = tx.logs[0].args.index.toNumber();

                return Child.at(childAddress).organiser.call({from : coinbase});
            })
            .then(function(_organiser){
                assert.equal(_organiser, organiser, 'wrong address for organiser');
                return Child.at(childAddress).name.call({from: coinbase});
            })
            .then(function(_name){
                assert.equal(web3.toUtf8(_name), expectedName, 'wrong name set');
            });
    });
});
```

Bit more here but nothing new.

First we call the `newChild` method:

```javascript
_parent.newChild(expectedName, organiser, {from: coinbase})
```

The we get the `organiser` property of the child contract:

```javascript
return Child.at(childAddress).organiser.call({from : coinbase});
```

And finally we test the `name` property of the child contract:

```javascript
return Child.at(childAddress).name.call({from: coinbase});
```

In the next part will create the method in `Child` that will release funds to
the organiser's address...

|[Part 4](https://github.com/coder-forge/chain-forge/tree/part-4)|
