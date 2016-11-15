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
