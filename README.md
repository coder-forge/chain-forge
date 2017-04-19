## Chain Forge

A blockchain tutorial from [Coder Forge](http://coderforge.io)

# Part 2

### Tools

 - truffle
 - testrpc

##### Truffle

Truffle serve's two purposes:

 1. A deploy tool.
 2. A webserver provitioned for `Dapp`'s.

As a deployment tool we will use truffle for deploying our contracts to the
ethereurm testnet and also locally. Once our contracts are good, and working as
expected, then we will use truffle to provition a webserver, ready to connect
to our nodes API's!

##### Testrpc

With a node on the testnet, or the live ethereum network, it has to be in sync.
This can be irritating if your node has been down for a day or two. Testrpc is
a mock node that runs localy. You don't have to be synced with it and its API's
are near perfect match - although there can be issues when new contracts need to
be mined.
