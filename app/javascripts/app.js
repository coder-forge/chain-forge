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

        $('#registerForm').submit(function(e){
            e.preventDefault();

            const forge = {};
            let errs = [];

            ['name', 'url', 'organiser', 'orgWallet', 'address', 'hostName'].forEach(function(field){

                let val = $('input[name='+field+']','#registerForm').val();

                if(!val && $('input[name='+field+']','#registerForm').attr('required')) errs.push(field+' is required');
                forge[field] = $('input[name='+field+']','#registerForm').val();
            })

            if(errs.length) return alert(errs.join('\n'));
            console.log('submitting new forge: ', forge);

            coderForge.newForge(forge)
                .then(forge => {

                    const div = $('#registerSuccess');

                    $('dd.name', div).html(name);
                    $('dd.address', div).html(forge.address);

                    var qrcode = new QRCode(document.getElementById("qrcode"), {
                        text: forge.address,
                        width: 128,
                        height: 128,
                        colorDark : "#000000",
                        colorLight : "#ffffff",
                        correctLevel : QRCode.CorrectLevel.H
                    });

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
