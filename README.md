# Chain Forge

A blockchain tutorial from [Coder Forge](http://coderforge.io).

### About

Currently this project is a work in progress. The end goal will be to show a
sample application on the blockchain, that is easy to build and implement and
importantly shows the simplicity behind the disruptive products that are about
to change our world. The tutorial will be organised as a 4 hour demonstration
that will be given in mid February 2017.

The `chain forge` application solves complexity in both legal and financial
operations within a large organisation. Take for example an international
franchise. Data, ie records, would be gathered and stored based on regional
operations. This data is then aggregated by the parent franchise. Nothing runs
simple, human error, manipulation of data and even in worse case scenario's
corruption or fiddling of the books. These problems create complexity because
the only solution is to add regulating systems on both the regional operations
and the parent franchise's operations.

In fact, that complexity of ensuring data is honest can be found in nearly every
company, large or small, from logistics to finance and even down to our
democratic society with data such as voting data. Blockchain is a technology
that provides a distributed database that self regulates its data.
The important words here are:

 1. distributed database
 2. (honest data) self regulates the data


### Blockchain under the hood

We won't be going too deep under the hood for this tutorial. Our end goal here
is to give us a good thematic understanding of blockchain and how its going to
fit in todays world.

Thought experiments are probably the best way to explain the purpose and
abilities of any new tech. Imagine you have an excel sheet. This sits on your
computer, you control the data on it. It can be submitted to other departments,
where the receiving party can then edit their copy, manipulate the data and send
it on as part of their own excel sheet.

With blockchain, your excel sheet is distributed across multiple machines (in
some cases 10K or more). If somebody in another department needs access to your
data for their own reports, as an example, they just read from this distributed
excel sheet, from a distributed database. As the data goes through the pipeline
of the organisation it is just read and updated from this distributed database
instead of user owned excel sheets being passed around and thus regulated. If
anyone changes any piece of data then it will change for everybody.

In order to change the data maliciously an attacker, or bad employee, would have
to hack all 10,000 copies at the same instance, which would probably fail as we
will see next.

So data is distributed across 10K or more machines, like a `bit torrent` or `tor`
 network. Wouldn't this massive distributed database be crunching between nodes,
cross checking that the data hasn't been manipulated and all nodes are in sync?
Yep it does. This requirement for processing power is what provides the
necessity for `Mining`. This is where heavy cryptography is used to check the
consistency of the data. The self regulating processing power needed to
ensure this distributed data is in sync is done by `Mining`. The measurement of
this power is the `Bitcoin` or the `Ether` which we will be using here.

You don't have to `Mine` to store data on the blockchain, but you will have to
pay in whatever term is used for the cost of processing power your data is
using. With the Bitcoin network it is bitcoin and with the ethereum network it
is ether. For those that are interested, the only reason that these measurements
of processing power for a distributed database, aka crypto currencies, have any
monetary value in the physical world is purely because people have decided to
make them related. That piece of political philosophy is also beyond this
tutorial but a very interesting rabbit hole to read up on.

Some points that must be looked into after this tutorial:
 - proof of work
 - double spend issue
 - DAO (Distributed Autonomous Organisation)
 - Trustfull & Trustless systems
 - Bitcoin app dev, Hyperledger, Ethereum


### Roadmap

This tutorial / demonstration application is still a work in progress. For
example most of the wording will definitely change and the code is not
completed yet. Here's whats to come (release date early Feb 2017).

 - Release funds if org has wallet
 - Use struct dataType for storing `Forge Data`
 - Split tutorial into parts (use branches to link parts)
 - Measure required gas for transactions

### Installation

Install dependencies

```bash
npm install -g truffle testrpc bower
```

Install Chain Forge

```bash
npm install
bower install
```

### Running Locally

For testing and experimentation it is best to run Chain Forge locally. This involves running a local private blockchain using `testrpc` and then running a front end webserver to deploy and interact with the contracs using `truffle`.

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
