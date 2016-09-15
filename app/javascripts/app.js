"use strict";

let accounts,
    account;
const coderForge = new CoderForgeACL();


window.onload = function() {
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

    $('#register').click((e)=>{
        coderForge.register();
    });
  });
}
