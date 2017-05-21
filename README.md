# Chain Forge

A blockchain tutorial from [Coder Forge](http://coderforge.io).

### Parts
|[Part 1](https://github.com/coder-forge/chain-forge/tree/part-1)|
|[Part 2](https://github.com/coder-forge/chain-forge/tree/part-2)|
|[Part 3](https://github.com/coder-forge/chain-forge/tree/part-3)|
|[Part 4]|
|[Part 5]|

# Part 4

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
