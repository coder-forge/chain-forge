# Chain Forge

A blockchain tutorial from [Coder Forge](http://coderforge.io).

### Parts
|[Part 1](https://github.com/coder-forge/chain-forge/tree/part-1)|
|[Part 2](https://github.com/coder-forge/chain-forge/tree/part-2)|
|[Part 3](https://github.com/coder-forge/chain-forge/tree/part-3)|
|[Part 4]|

# Part 4

In this section we will:

 - Build the web form
 - Setting the organiser's address
 - Release funds to the organiser
 - Destruct our contracts

### Building the web form

A reminder, the front end part of this tutorial depends on Truffle version 2.1.1
The current version at the time of writing is 3.0.0.

Truffle's webserver is located in the `/app` folder. And the default folder
structure is self explainatory.

```bash
app/
├── index.html
├── javascripts
│   └── app.js
└── stylesheets
    └── app.css
```

We are going to use `Bootstrap` to make our form look pretty and use `Bower` to
manage front end dependencies. By default bower will install everything in the
root of our project, which is not what we want. We want bower to install into
the `/app` folder, we will use a `.bowerrc` file for this. Create the file in
the root of our project...

`.bowerrc`

```javascript
{
    "directory": "app/bower_components"
}
```

Now we can setup bower with the following command...

```bash
$ bower init
```

Hit enter for all questions, accepting the defaults. Then we can add our
dependencies...

```bash
bower install --save jquery
bower install --save Bootstrap
bower install --save qrcode.js
```

Next we will add our html file...

`/app/index.html`

```html
  <!DOCTYPE html>
  <html>
      <head>
          <title>CoderForge</title>
          <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,700' rel='stylesheet' type='text/css'>
          <link href="./app.css" rel='stylesheet' type='text/css'>
          <link href="./bower_components/bootstrap/dist/css/bootstrap.css" rel="stylesheet" type="text/css">
          <script src="./bower_components/jquery/dist/jquery.js"></script>
          <script src="./bower_components/bootstrap/dist/js/bootstrap.js"></script>
          <script src="./bower_components/qrcode.js/qrcode.js"></script>
          <script src="./CoderForgeACL.js"></script>
          <script src="./app.js"></script>
      </head>
      <body>

          <div class="container">

              <nav class="navbar navbar-default">
                  <div class="container-fluid">
                      <div class="navbar-header">
                          <h1 class="title"><a class="navbar-brand" href="/">Coder Forge</a></h1>
                      </div>
                  </div>
              </nav>

              <div class="jumbotron">
                  <p>A place to learn how to forge out code, to smyth out patterns and designs. Complete beginners welcome, bring your own laptop.</p>
              </div>

              <div class="jumbotron">

                  <form class="form-horizontal" id="registerForm">
                      <div class="form-group required">
                          <label for="forgeName" class="col-sm-2 control-label">name</label>
                          <div class="col-sm-10">
                              <input type="text" name="name" id="forgeName" class="form-control" placeholder="enter the name of your forge" required="true">
                          </div>
                      </div>
                      <div class="form-group required">
                          <label for="url" class="col-sm-2 control-label">url</label>
                          <div class="col-sm-10">
                              <input type="text" name="url" id="url" class="form-control" placeholder="link to forge dates. (usually meetup/eventbrite links)" required="true">
                          </div>
                      </div>
                      <div class="form-group required">
                          <label for="orgName" class="col-sm-2 control-label">organiser</label>
                          <div class="col-sm-10">
                              <input type="text" name="organiser" id="orgName" class="form-control" placeholder="person/organisation organising the event" required="true">
                          </div>
                      </div>
                      <div class="form-group">
                          <label for="orgWallet" class="col-sm-2 control-label">organiser wallet</label>
                          <div class="col-sm-10">
                              <input type="text" name="orgWallet" id="orgWallet" class="form-control" placeholder="person/organisation ethereum address">
                          </div>
                      </div>
                      <div class="form-group">
                          <label for="Address" class="col-sm-2 control-label">address</label>
                          <div class="col-sm-10">
                              <input type="text" name="address" id="Address" class="form-control" placeholder="the main address for the forge events">
                          </div>
                      </div>
                      <div class="form-group">
                          <label for="hostName" class="col-sm-2 control-label">host</label>
                          <div class="col-sm-10">
                              <input type="text" name="hostName" id="hostName" class="form-control" placeholder="person/organisation hosting the event">
                          </div>
                      </div>
                      <div class="form-group">
                          <div class="col-sm-offset-2 col-sm-10">
                              <button type="submit" class="btn btn-default">launch new forge</button>
                          </div>
                      </div>
                  </form>

                  <div id="registerSuccess" style="display:none">
                      <div class="alert alert-success">
                          Forge Created!
                          <dl>
                              <dt>Name</dt>
                              <dd class="name"></dd>
                              <dt>Address</dt>
                              <dd class="address"></dd>
                              <dt>QR Code</dt>
                              <dd id="qrcode"></dt>
                          </dl>
                      </div>
                  </div>
                  <div id="registerError" style="display:none">
                      <div class="alert alert-danger">
                          <p>
                              Error! <span class="msg"></span>
                          </p>
                      </div>
                  </div>
              </div>
          </div>
      </body>
  </html>
```

and our css... (overwrite everything thats there)

`/app/stylesheets/app.css`

```css
.form-group.required .control-label:after {
   content:"*";
   margin-right: -10px;
   padding-left: 10px;
   color:red;
}
```

Our setup is now different from the default that shipped with truffle 2.1.1 so
we must update the `truffle.js` file. This is the config file that lets truffle
know where our front end code is, and what ports and host our testrpc is running
on. Update the config file in our root, replacing everything with the following.
..

`/truffle.js`

```javascript
module.exports = {
  build: {
    "index.html": "index.html",
    "app.js": [
      "javascripts/app.js"
    ],
    "CoderForgeACL.js": [
      "javascripts/CoderForgeACL.js"
    ],
    "bower_components/": [
        "bower_components/"
    ],
    "app.css": [
      "stylesheets/app.css"
    ],
    "images/": "images/"
  },
  rpc: {
    host: "localhost",
    port: 8545,
    gas: 4712388,
    gasPrice: 50000000000
  }
};
```

Now we can run the web server with...

```bash
$ truffle serve
```

Navigate to `http://localhost:8080` in your browser and the form should show up.
Note you will get an error in the brower console due to the default code in
`/app/javascripts/app.js`, we will be replacing this later.

### Setting the organiser's address

You will notice there's 6 fields in the form. We will only be using 2 of them
for this tutorial. The other 4 are for the finished dapp that CF will be using
and left here for demonstration purposes only.

When somebody puts Ether into a forges wallet, we want the organiser to be able
to access them. Now to write a test for that...

`/test/Forge.test.js`

```javascript
  it('sets & gets organiser address', ()=>{

    return forge.setOrganiser(expectedWallet, {from: accounts[0], gas: 200000})
      .then(()=>{
        return forge._organiser.call({from: accounts[0]});
      })
      .then((address)=>{
        let actual = address;
        assert.equal(actual, expectedWallet);
      });
  });
```

Whats this... `expectedWallet, {from: accounts[0], gas: 200000}`? Here we have
that transaction object mentioned earlier. Remember when writing to the blockchain
it costs, reading is free. In our transaction we will state what account is to
pay, and how much. But how much to charge. Each operation that writes, updates,
creates, is different. Back to our online compiler... when we are creating a
new forge the `CoderForge` contract needs to accept the organisers wallet, then
pass it to the child contract. We are now going to use the `bytes32 name`
parameter and also add one for the organisers wallet...

`CoderForge.sol`

```javascript
  function newForge(bytes32 name, address orgWallet) returns (address){

    Forge forge = new Forge();
    forge.setName(name);
    forge.setOrganiser(orgWallet);

    uint256 index = forges.push(forge);   // returns new array length;
    index--;

    LogForge(owner, forge, index);

    return forge;
  }
```

Thank you online compiler, yes both `setName` and `setOrganiser` are not yet
in the `Forge.sol` contract. A vital tool ;) Due to the nature of this dapp,
everything is to be publically read - otherwise complexity would have to be
added for countering things like money laundering, managing taxes,
accountability - all things we are trying to remove.

We should now see that two new methods are needed in our `Forge.sol` contract:

 - `setName`
 - `setOrganiser`

and each of these will have public properties:

 - `name`
 - `organiser`

So in solidity compiler our forge contract should look like:

`Forge.sol`

```javascript
pragma solidity ^0.4.2;

contract Forge{

    address owner;
    bytes32 public _name;
    address public _organiser;

    function Forge(){
        owner = msg.sender;
    }

    // set forge name
    function setName(bytes32 name) returns(bool){

        if(msg.sender==owner){
            _name = name;
            return true;
        }

        return false;
    }

    // set forge organiser
    function setOrganiser(address organiser) returns(bool){

        if(msg.sender==owner){
            _organiser = organiser;
            return true;
        }

        return false;
    }
}
```

Is the `owner` parameter now making sense. Only the contract that deployed the
Forge contract can set the name and organiser. This means that any child
contracts that are created are dependant on the CoderForge, which is dependant
on the person that deploys it. Also, importantly for this use case, all data
can be read by anyone.

### Release funds to the organiser

### Destruct our contracts
