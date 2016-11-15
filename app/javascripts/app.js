"use strict";

const coderForge = new CoderForgeACL();
let accounts,
    account;

window.onload = function() {
    web3.eth.getAccounts(function(err, accounts) {

        if(err !== null)
            return console.error("There was an error fetching your accounts.");
        if(accounts.length === 0)
            return console.error("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");

	    account = accounts[0];
        coderForge.coinbase = account;

        $('#register').click(function(){

            const name = $('input[name=name]','#registerForm').val();

            coderForge.newForge(name)
                .then(forge => {

                    const div = $('#registerSuccess');

                    $('dd.name', div).html(name);
                    $('dd.address', div).html(forge.address);

                    $('#registerForm').hide();
                    div.show();
                })
                .catch(err => {

                    const div = $('#registerError');
                    $('.msg', div).html(err);

                    $('#registerForm').hide();
                    div.show();
                });
        });
    });
};
