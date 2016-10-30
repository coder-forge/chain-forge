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

    const contract = CoderForge.deployed();

    var event = contract.LogForge();
    event.watch(function(error, result){
        console.log(error);
        console.log(result);
    });

    contract.newForge("daithi", {from: accounts[0]})
        .then(function(index){
            console.log('args...');
            console.log(arguments);
        })
        .catch((e)=>{
            console.log('ERROR:');
            console.error(e);
        });


    $('#register').click((e)=>{

        const name = $('input[name=name]','#registerForm').val();

        coderForge.register(name);
    });
  });
}
