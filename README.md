## Chain Forge

A blockchain tutorial from [Coder Forge](http://coderforge.io)

# Part 3 - Unit tests

#### Install testrpc

`testrpc` is NOT a blockchain node. It mocks (mimics) a blockchain network and
truffle is built to take advantage of some of `testrpc`'s abilities. This makes
it much much quicker than running our unit tests against a real node like
`parity`.

#### Parent::setOwner test

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
accounts we have setup in `Parity`. On the next few line we define our accounts.

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

Truffle will create some contracts on our development net and use them to run
the tests against. Irritatingly this means that you must click the `confirmation`
for each one in the `Parity UI`.

Once done, and buttons clicked, then it should report something like...
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

Although the previous tests involved small operations, reading and writing to
the `owner` property, when creating a new contract it can take time to be mined.
Therefore we must `watch` for the result. In solidity we use the `event` to help
us do this.

In our parent contract we will add the following:


```javascript
it('will create a child contract', function(){

    const expectedName = "My Cool Event";

    return Parent.deployed().then(function(_parent){

        _parent.newChild(expectedName, organiser, {from: coinbase})
            .then(function(index){
                console.log('inner index: ', index);
            });
    });
});
```

Notice what is returned when we create a child contract. When we log the

### Child releases funds to organiser

All of the blockchain world has an attack surface. There are numerous ways that
an attacker can syphon your funds into their account. It almost always
involves contracts that have methods working with funds and a loop. The method
below may be the best way of doing this, at time of writing, but as the
language and technology evolve, new solutions and complexity will mean that new
threats will be discoverd.

Our child contract must receive funds, as a security precaution only methods
that have the `payable` `modifier` can work with incoming funds. So we will
create a `catchall` method that will store the quantity of funds in a
`property`, we will then have a method to release whatever value is in this
`property` to the `orgWallet` address that the child contract was created with.

`Child`

```javascript
    mapping(address => uint) funds;
```

Here we are creating an array of `address`'s with values that are `uint` called
`funds`. There will only every be one item in the array, with the `orgWallet`
as its index, but its good practice, where ever funds are linked to one account,
to use this pattern. It means if you want to add / manage another address at a
later date you have no refactoring to do. Blockchain Dapp's are microservices
architecture, the contracts are small and many, each reading from another.

`Child`

```javascript
    // catch all
    function() payable{
        funds[_organiser] += msg.value;
    }
```

Here is the `magic method` `catchall`. Like ronseal, it litteraly does what it
says on the tin. Use the `function` keyword without a name and add the
`payable` modifier, now all funds sent to this contract, without calling one
of the existing methods, will be caught by this method. We take the value that
is being sent and store it as a `uint` in the `funds[address]` array, under
the index `_organiser`.

`Child`

As `child` creation is protected by only allowing an owner address, we want to
the public to be able to script calls to their `child` contract. We can't
check that the call comes from the `owner` or `orgWallet` address's, so here
we have a massive attack surface in the world of ethereum.

A method that deals with fund transfere that is fully public.

```javascript
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
