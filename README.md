# Chain Forge

A blockchain tutorial from [Coder Forge](http://coderforge.io).

*Currently this project is a work in progress.*
*Project is conceptual only, not ready for production servers.*
*You have been warned... 3 times*

Using `truffle` and `testrpc` we hope to show the simplicity of using
blockchain technology to decomplex business models. This tutorial will be split
into parts, each part as a branch with its relevant `README.md` providing the
relevant instructions.

The code presented here is in no way ready for real world application, yet. But
should serve as a good example of the capabilities of blockchain technology.

> CAUTION!

> Truffle has recently updated to version 3 and removed the easy web dev build
> Please make sure you are running truffle version 2.1.1

> DISCLAIMER

> This dapp, ie this code, is for demonstration purposes only. It will be used
> by the Coder Forge Foundation some day but hasn't been stress tested or gone
> under any code review - DO NOT USE IN PRODUCTION ENVIRONMENT.

... you have been warned ;)

### Tools you will need

The following will need to be set up on your machine:

 - NodeJS (v6.9.1)
 - Truffle (v2.1.1)
 - Testrpc (latest)


### Tutorial Branches

Also see the `About` section below for an explaination of the `Chain Forge` app.

|[Part 1](https://github.com/coder-forge/chain-forge/tree/part-1)|
Installation of tools and setup of workspace

|[Part 2](https://github.com/coder-forge/chain-forge/tree/part-2)|
Setting up initial contracts & tests

|[Part 3](https://github.com/coder-forge/chain-forge/tree/part-3)|
T.B.A.

|[Part 4]|


### Installation

Install the dependencies for `Chain Forge`.

```bash
npm install -g truffle@2.1.1 ethereumjs-testrpc bower
```

Install `Chain Forge`.

```bash
npm install
bower install
```

### Running Locally

For testing and experimentation it is best to run Chain Forge locally. This involves running a local private blockchain using `testrpc` (installed above as ethereumjs-testrpc) and then running a front end webserver to deploy and interact with the contracs using `truffle`.

Private local blockchain

```
$ testrpc
```

Webserver to deploy and interact with contracts
```bash
truffle serve
```


### Testing

To test make sure that `testrpc` is running, then do
```bash
truffle test test/*.test.js
```


### About

The end goal will be to show a sample application on the blockchain, that is
easy to build and implement and importantly shows the simplicity behind the
disruptive products that are about to change our world. The tutorial will be
organised as a 4 hour demonstration that will be given in mid February 2017.

The `chain forge` application solves complexity in both legal and financial
operations within a large organisation. Take for example an international
franchise. Data, ie records, would be gathered and stored based on regional
operations. This data is then aggregated by the parent franchise. Nothing runs
simple, human error, manipulation of data and even in worse case scenario's
corruption or fiddling of the books. These problems create complexity because
the only solution is to add regulating systems on both the regional operations
and the parent franchise's operations.

In the case of the `Coder Forge Foundation` the `Chain Forge` application allows
us to provide a `wallet` for each registered class. When a new class registers,
a parent contract on the blockchain will create a child contract that represents
the new class. If successfull, then person registering the new class will be
shown a `qr` code that releates to their contract.

This contract is also known as a wallet and funds can be added to it using just
the `qr` code. Another way of looking at it is when a class registers they are
given a futuristic personal bank account. This futuristic bank account can do
only 2 things:

 - accept funds being deposited from anyone
 - release all funds to one person

Layman definition of blockchain:
```
A "virtual" personal bank account that lives as a small program in virtual
space. You can decide what it does, how it does it and what other bank accounts
it talks to. This "virtual" personal bank account is also known as a `wallet` or
`smart contract`.

This personal bank account can be used to just store information, like land
deeds, or it can store monetary value like Bitcoin. It could contain logic like
managing a network of machinery, or it could manage logic that transferes funds
only if certain conditions are met. It could also do nothing and be pointless,
the choice is yours. Build one yourself or use a premade one.

These are what are known as `wallet`'s or `smart contract`'s and importantly...
its values and state can't be faked or manipulated.
```


### Troubleshooting

`invalid byte index`
This can be caused because you are not converting the `bytes32` value returned
from the blockchain to `Ascii`. Try using `web3.toAscii($bytes32)` where
`$bytes32` is the value being returned.


`eth_getFilterChanges` loop
If `testrpc` starts printing the above in a loop then try the following:
 1. Stop `testrpc` & `truffle`
 2. Restart `testrpc` and run `truffle migrate`
 3. With `testrpc` still running, when point 2 above is finished, rerun `truffle
 serve`.


### Roadmap

This tutorial / demonstration application is still a work in progress. For
example most of the wording will definitely change and the code is not
completed yet. Here's whats to come (release date early Feb 2017).

- Release funds if org has wallet
- Use struct dataType for storing `Forge Data`
- Split tutorial into parts (use branches to link parts)
- Measure required gas for transactions
