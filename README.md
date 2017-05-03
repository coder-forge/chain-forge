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

![alt text](https://raw.githubusercontent.com/coder-forge/chain-forge/part-1/browser-solidity.png "Solidity Browser")

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

You will notice a caution sign next to the first line. These are warnings from
the solidity compiler that it doesn't know what version of solidity we are
using. This is expected, Solidity is an evolving language with many features in
the pipeline including `fixed point values`, we therefore have to say which
version of the compiler we are developing. At the time of writing the vesion is
`0.4.10`. Prepend `pragma solidity ^0.4.10;` to your file, (the `^` means
comapable with). Your `Parent` file should now look like:

`Parent`

```javascript
pragma solidity ^0.4.10;

contract Parent{

}
```

We now have a basic, pointless, contract that does nothing except exist and yes
it can accept funds but nobody can retreive them, or transfere them. It is
basically a `dev/null` contract.

### The Constructor

All methods (defined with the `function` keyword) are public by default, we will
get to visibility later on. There exists a special function - known as the
`constructor` - and it is only ever called once, when the contract is deployed.
Remember that all contracts are `singletons`, which means that there is only
ever 1 of them. Its impossible to make a change to a deployed contract, you can
only update values or redeploy a new one and `selfDestruct` the old.

In solidity the constructor is defined using the same name as the contract
itself. In our case that is `Parent`, adding a constructor function our contract
should now look like:

`Parent`

```javascript
pragma solidity ^0.4.10;

contract Parent{

    // constructor - only called once when contract is deployed.
    function Parent(){

    }
}
```

### Giving admin rights to an 'owner' address

There will be numerous situations where we would like to be the only one with
control over methods and calls. We can do this by storing the address that
deploys our contract as the property `owner`. One such example of this is when
we want to `selfDestruct` our contract - we definitely don't want anybody else
doing this.

There is a global variable in Solidiy called `msg` and it has two very important
members:

 - `sender`
    This is the address of that has sent the request to the contract.
 - `value`
    This is the Ether (measured in wei), if any, that is sent to a contract.

As we own the address that deploys our contract, and the constructor gets called
only once when the contract is deployed, so we will store our address here.
First we create the property `owner` which is of type `address`. Then in our
constructor we store the address used to deploy as `owner`...

`Parent`

```javascript
pragma solidity ^0.4.10;

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
note that contract properties go below the line `address owner;` and new
methods go below the constructor definition `function Parent()`.

Methods are declared with the `function` keyword. They are given a name,
parameters and a return type. If the method doesn't return anything then the
return type can be left out. It is always advisable to be able to update the
`owner` address, for example say you want to reorganise your accounts, without
being able to update the `owner` address you would have to redeploy your
`Parent` contract, and every single contract that depends on it if they had made
the same mistake.

So we will create a method `setOwner` that takes an new address thats updates
the owner property. It will return true if updated successfully and false if
not.

```javascript

    // set address with admin rights
    function setOwner(address newOwner) returns (bool){

        // only if call came from address in owner property
        if(owner == msg.sender){
            owner = newOwner;
            return true;
        }

        return false;
    }
```

### Running a contract in Solidity Browser

Now we have some code that does something, with no caution signs, error's or
warnings, lets test it. In the right panel make sure you on the `Contract` tab.
The UI is a little off putting at first, but you should see a button `Create`.
Click it. A contract is now deployed to a mock ethereum blockchain running in
the browser.

Under the button you can find a form to interact with your contract. Opening it
will show only the `setOwner` method. That is because properties are private by
default and methods are public by default. Solidity supports `public`,
`private`, `internal` [and more](http://solidity.readthedocs.io/en/develop/contracts.html#visibility-and-getters)

Click the `Create` button a few times and the list of "deployed" contracts grow
(emphasis on the quotes as this is in a vm running the browser only). The title
of each deployed contract will contain its address, something like:
"0xbbf289d846208c16edc8474705c748aff07732db". Copy one and enter into the
input for `setOwner` of another and click `setOwner`, you should see something
like the following:

```
Result: "0x0000000000000000000000000000000000000000000000000000000000000001"
Transaction cost: 28161 gas.
Execution cost: 5481 gas.
Decoded:
bool: true
```
The `bool: true` is the return value. Our `owner` property has been updated
successfully

### Killing a contract

As mentioned before, if we do want to update core operations in our contract we
then have to deploy a new one and destroy the old one. For this we will create
another method `destroy`, and of course only the `owner` address can do this.

`Parent`

```javascript
    // destroy the contract
    function destroy() returns (bool){
        if(owner == msg.sender){
            selfdestruct(owner);    // send remaining funds to owner address
            return true;
        }
        return false;
    }
```

When we destroy a contract with `selfdestruct` we can pass it an address to
the send remaining funds to.

### The child contract

Before we create the method in our Parent contract that creates the child
contract, which in the case of `Chain Forge` is the `Forge` contract, but for
this tutorial we will call it `Child`. Everything in this should be self
explainable by now...

`Child`

```javascript
pragma solidity ^0.4.10;

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
