// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
// import metacoin_artifacts from '../../build/contracts/MetaCoin.json';
import coderforge_artifacts from '../../build/contracts/CoderForge.json';
import forge_artifacts from '../../build/contracts/Forge.json';

// MetaCoin is our usable abstraction, which we'll use through the code below.
// var MetaCoin = contract(metacoin_artifacts);

var CoderForge = contract(coderforge_artifacts),
  Forge = contract(forge_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    CoderForge.setProvider(web3.currentProvider);
    Forge.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

    });

    // form actions
    $('#registerForm').submit(function CBRegisterForm(e) {
      e.preventDefault();

      var form = e.target,
        data = {
          name: $('input[name=name]', form).val(),
          url: $('input[name=url]', form).val(),
          orgAddress: $('input[name=organiser]', form).val(),
        }

      self.submitForge(data);

      return false;
    });

    $('#releaseFunds').submit(function CBReleaseFundsForm(e){
      e.preventDefault();

      var form = e.target,
        address = $('input[name=address]', form).val();

      self.releaseFunds(address);
      return false;
    });
  },

  reset: function(){
    $('#qrcode').html('')
      .hide();
    $('#registerForm').show();
    $('#registerForm').closest('form').find("input[type=text], textarea").val("");
  },

  submitForge: function(data){

    var cf = new CoderForge('0x7a5812ba512df41432ed408ed0a1b266aa8a27dc');

    cf.newForge.estimateGas()
      .then(function(est){
        console.log('estimateGas: ', est);
        return cf.newForge(data.name, data.url, data.orgAddress, {from: account, gas: 457372})
      })
      .then(trans => {
        console.log('trans: ', trans);

        var logForge = cf.LogForge({transactionHash: trans, fromBlock: 'latest'});
        logForge.watch(function(err, res){

          console.log('Result: ', res.args);
          var from = res.args._from,
            forgeAddress = res.args.forge,
            index = res.args.index;

          // get & test forge
          var forge = new Forge(forgeAddress);
          forge._name()
            .then(function(name){
              console.log('Forge "'+web3.toUtf8(name)+'" created!');
              console.log('\taddress: '+forge.address);

              //show qr code
              new QRCode(document.getElementById("qrcode"), forge.address);
              $('#registerForm').hide();
              $('#qrcode').show();
            });
        });

      }); // gas measured using estimateGas

  },

  releaseFunds: function(address){

    const forge = new Forge(address);
    console.log('forge: ', forge);
  },

  displayQR: function(){
    var self = this;

  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});
