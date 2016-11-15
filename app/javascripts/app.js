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

    const contract = CoderForge.at(CoderForge.deployed().address);

    $('#register').click(function(){

        const name = $('input[name=name]','#registerForm').val();

        // start event watching
        let logForge = contract.LogForge();

        // watch events for new forge.
        logForge.watch((err, res)=>{
            if(err) throw err;

            logForge.stopWatching();
            return Forge.at(res.args.forge)._name.call()
                .then((bytes32)=>{

                    const actual = web3.toUtf8(bytes32);

                    (name===actual) ?
                        console.log('contract created\n\nForge '+name+'\nAddress: '+res.args.forge) :
                        console.log('oops, something went wrong');
                })
                .catch(err => {
                    throw err;
                });
        });

        // create forge.
        console.log('creating forge...');
        contract.newForge(''+name, {from: accounts[0], gas: 200000})
            .catch(err => {
                console.error(err);
                throw err;
            });
    });
  });
};
