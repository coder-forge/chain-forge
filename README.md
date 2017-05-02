# Chain Forge

A blockchain tutorial from [Coder Forge](http://coderforge.io).

### Parts
|Part 1|
|[Part 2](https://github.com/coder-forge/chain-forge/tree/part-2)|
|[Part 3](https://github.com/coder-forge/chain-forge/tree/part-3)|
|[Part 4](https://github.com/coder-forge/chain-forge/tree/part-4)|

# Part 1

In this part we will be coding using the `Solidity` language and only an
internet browser. The [Remix Solidity Browser](https://ethereum.github.io/browser-solidity/)
is the perfect tool for quickly prototyping social contracts and dapps.

When you go the above url you will be shown a default contract `Ballot`. On the
left is the `Code Editor` and on the right is a panel for interacting with your
contracts. Create a new file by clicking the `new file` icon to the right of the
tab for the initial contract. For now name this file `Parent` by clicking the
tab name.

### Most basic of contracts

The solidity language is fairly straight forward and if you have a handle of
Javascript or any other language you should be able to navigate it easily
enough. There are some notable differences from Javascript, namely that solidity
is `strongly typed`, which means you must declare wether a variable is a
`string`, `int` etc. Also a `class` is called a `contract` in the world of
solidity. Thankfully inheritence is also advanced although we will have no need
for its use in this tutorial.

Enter the following in to your new file:

`Parent`

```javascript
contract Parent{

}
```

You will notice the right panel go bonkers as you type, a handy feature with
`Remix IDE` is that it validates your code in realtime. To show this entering
the above should show an error about the `compiler version` being unkown. This
is expected, Solidity is an evolving language with many features in the pipeline
including `fixed point values`, we therefore have to say which version of the
compiler we are developing. At the time of writing the vesion is `0.4.10`.
Prepend `pragma ^0.4.10;` to your file, (the `^` means comapable with). Your
`Parent` file should now look like:

`Parent`

```javascript
pragma ^0.4.10;

contract Parent{

}
```

We now have a basic, pointless, contract that does nothing except exist and yes
it can accept funds but nobody can retreive them, or transfere them. It is
basically a `dev/null` contract.

### The Constructor

All methods (defined with the `function` keyword) are public by default, we will
get to visibility later on. A special function is known as the `constructor` -
and it is only ever called once, when the contract is deployed. Remember that
all contracts are `singletons`, which means that there is only every 1 of them.
Its impossible to make a change to a deployed contract, you can only update
values or redeploy a new one and `selfDestruct` the old.

In our contract we want to be able to store who `owns` it. This is an address
that we will give `admin` rights to and it is usually the address that deploys
the contract. For us it is an address owned by `Coder Forge` and is set by
using this address to deploy the `Parent` contract.

`Parent`

```javascript
pragma ^0.4.10;

contract Parent{

    // constructor
    function Parent(){

    }
}
```

### Giving admin rights to an 'owner' address

There will be numerous situations where we would like to be the only one with
control over methods and calls. We can do this by storing the address that
deploys our contract as the param `owner`. One such example of this is when we
want to `selfDestruct` our contract - we definitely don't want anybody going
this.

There is a global variable in Solidiy called `msg` and it has two very important
members:

 - sender
    This is the address of that has sent the request to the contract.
 - value
    This is the Ether (measured in wei), if any, that is sent to a contract.

We own the address that deploys our contract, the constructor gets called only
once when the contract is deployed, so we will store our address here. First we
create the parameter `owner` which is of type `address`. Then in our
constructor we store the address used to deploy as `owner`...

`Parent`

```javascript
pragma ^0.4.10;

contract Parent{

    // address with 'admin' rights
    address owner;

    // constructor
    function Parent(){
        owner = msg.sender;
    }
}
```

### Method signatures

From this point on I'm not going to display all the code as we go along, so do
note that contract parameters go below the line `address owner;` and new
methods go below the the construct `function Parent()` definition.

Methods are declared with the `function` keyword. They are given a name,
parameters and a return type. If the method doesn't return anything then the
return type can be left out. It is always advisable to be able to update the
`owner` address, for example say you want to reorganise your accounts, without
being able to update the `owner` address you would have to redeploy your
`Parent` contract, and every single contract that depends on it.

So we will create a method `setOwner` that takes an new address, updates the
owner variable. It will return true if updated successfully and false if not.

```javascript

    // set address with admin rights
    function setOwner(address newOwner) returns (bool){

        // only if current owner
        if(owner == msg.sender){
            owner = newOwner;
            return true;
        }

        return false;
    }
```

### Killing a contract

As mentioned before, if we do want to update core operations in our contract we
then have to deploy a new one and destroy the old one. For this we will create
another method `destroy`, and of course only the `owner` address can do this.

`Parent`

```javascript

    // destroy the contract
    function destroy(){
        if(owner == msg.sender){
            self.destroy();
            return true;
        }
        return false;
    }
```

### The child contract

Before we create the method in our Parent contract that creates the child
contract, which in our case is the `Forge` wallet, contract, that organisers
get when they register, we will create the child contract. Everything in this
should be self explainable...

`Child`

```javascript
pragma ^0.4.10;

contract Child{

    address owner;
    address organiser;
    bytes32 name;

    // constructor
    // as the parent will deploy this, then the parent address will always be
    // owner.
    function Child(address orgAddr, bytes32 orgName){
        owner = msg.sender;
        organiser = orgAddr;
        name = orgName;
    }

    // set the organisers address
    function setOrgAddress(address newAddress) returns (bool){
        if(owner == msg.sender || orgAddr == msg.sender){
            organiser = newAddress;
            return true;
        }

        return false;
    }

    // set the organisers name
    function setOrgName(bytes32 newName) returns (bool){
        if(owner == msg.sender || orgAddr == msg.sender){
            name = newName;
            return true;
        }

        return false;
    }

    // set address with admin rights
    function setOwner(address newOwner) returns (bool){

        // only if current owner
        if(owner == msg.sender){
            owner = newOwner;
            return true;
        }

        return false;
    }

    // destroy the contract
    function destroy(){
        if(owner == msg.sender){
            self.destroy();
            return true;
        }
        return false;
    }
}
```
