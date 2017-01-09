# Chain Forge

A blockchain tutorial from [Coder Forge](http://coderforge.io).

### Parts
|Part 1|
|[Part 2](https://github.com/coder-forge/chain-forge/tree/part-2)|

# Part 1

First we will get all our tools setup:

 - node version
 - truffle
 - testrpc
 - bower
 - circleci

### Node Version

We will be working from version `6.9.1`. NVM is the best tool for managing
different versions of Nodejs.

### Truffle

Once node is installed you can install `truffle` globally using the command:
```bash
npm install -g truffle
```

Once installed we will initiate our project with truffle. Create a project
folder and change directory into it. Then run the command:
```bash
truffle init
```

### TestRPC

This will run a blockchain locally to your machine. It will automatically create
10 accounts when you launch it and makes developing, especially from a TDD point
of view, extremely easy. Although at the time of writing I'm finding it a big
buggy at times.

Install with the command:
```bash
npm install -g ethereumjs-testrpc
```

### Bower

This is a package manager that will handle any front end 3rd party code we will
be using, such as bootstrap.

Install with the command:
```bash
npm install -g bower
```

### CircleCI

If you know what this is then have a look at the `circle.yml` file to use as an
example, if you don't know what this is then don't worry its not needed for this
tutorial.
