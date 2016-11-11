"use strict";

const coderForge = new CoderForgeACL();
let accounts,
    account;


window.onload = function() {
  web3.eth.getAccounts(function(err, accs) {
    if (err !== null) {
      alert("There was an error fetching your accounts.");
      return;
    }

    if (accs.length === 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    }

    accounts = accs;
    account = accounts[0];

    const contract = CoderForge.deployed();

    $('#register').click((e)=>{

        const name = $('input[name=name]','#registerForm').val();
        console.log(e);
        coderForge.register(name);
    });
  });
};
