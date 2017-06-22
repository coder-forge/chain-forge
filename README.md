# Chain Forge

A blockchain tutorial from [Coder Forge](http://coderforge.io).

### Parts
|[Part 1](https://github.com/coder-forge/chain-forge/tree/part-1)|
|[Part 2](https://github.com/coder-forge/chain-forge/tree/part-2)|
|[Part 3](https://github.com/coder-forge/chain-forge/tree/part-3)|
|Part 4|
|[Part 5](https://github.com/coder-forge/chain-forge/tree/part-5)|

# Part 4

### Child releases funds to organiser

All of the blockchain world has an attack surface. There are numerous ways that
an attacker can syphon your funds into their account. It almost always
involves contracts that have methods working with funds and a loop. The method
below may be the best way of doing this, at time of writing, but as the
language and technology evolve, new solutions and complexity will mean that new
threats will be discoverd.

Somebody could script calls to our `newChild` method of the `Parent` contract,
so to counter act this we will put that behind a login system. We want to give
the organiser full control over their `Child` contract. If they want to script
it for whatever reason then fine. Also we want the child contract to only be
able to release funds to the organiser and no-one else.

Our child contract must receive funds, as a security precaution only methods
that have the `payable` `modifier` can work with incoming funds. So we will
create a `catchall` method that will store the quantity of funds in a
`property`, we will then have a method to release whatever value is in this
`property` to the `organiser` address that the child contract was created with.

`Child`

```javascript
    uint funds;
```

Here we are creating an property of `uint` type called `funds`. This will hold
the current value of the Ether in the contract. We can use this to temporarily
set the funds to 0 whilst a transaction is being carried out, as we will see
later.

`Child`

```javascript
    // catch all
    function() payable{
        funds += msg.value;
    }
```

Here is the `magic method` `catchall`. Like ronseal, it litteraly does what it
says on the tin. Use the `function` keyword without a name and add the
`payable` modifier, now all funds sent to this contract, without calling one
of the existing methods, will be caught by this method. We take the value that
is being sent and store it as a `uint` in the `funds` property.

`Child`

```javascript

    event TransferStatus(
        bytes32 message
    );

    // release funds to organizer
    function payOrganizer() payable returns(bool){

        uint fund = funds;
        funds = 0;

        if(!organiser.send(fund)){
            TransferStatus('it failed');
            funds = fund;
        }
        else{
            TransferStatus('success');
        }
        return true;
    }
```

Within the `payOrganizer` method we setup a `memory` variable, of type `uint`,
called `fund` and set it with the current amount of ether in the property
`funds`. We then set the `funds` property to zero. The reason we do this is to
prevent any loops from being scripted that could siphon ether from our contract.
If a transaction is in progress then the `funds` property will be 0. If the
transaction fails, for whatever reason, then the `funds` property is reset to
its original value.

We are also using `events`. These will log messages that we can listen for with
our JavaScript API. If release of funds worked, then it will log the event
`success`, if not then will log `it failed`.
