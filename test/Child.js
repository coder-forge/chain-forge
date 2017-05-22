
const Child = artifacts.require('./Child.sol');

contract('Child', function(accounts){

    const coinbase = accounts[0],
        donator = accounts[1],
        organiser = accounts[2];

    // provision Child contract
    before(function(done){

        web3.eth.getBalance(coinbase, function(err, bl){
            console.log('coinbase balance: ', bl.toNumber());

            web3.eth.getBalance(organiser, function(err, bl){
                console.log('organiser balance: ', bl.toNumber());

                web3.eth.getBalance(donator, function(err, bl){
                    console.log('donator balance: ', bl.toNumber());
                    Child.deployed().then(function(_child){
                        _child.setOrgAddress(organiser, {from: coinbase})
                            .then(function(){done();});
                    });
                });
            });
        });
    });

    it('will accept funds', function(done){

        Child.deployed().then(function(_child){

            web3.eth.sendTransaction({from: donator, to: _child.address, value: 10}, function(err, tx){
                if(err) return done(err);

                web3.eth.getBalance(_child.address, function(err, tx){
                    if(err) return done(err);

                    assert.equal(tx.toNumber(), 10);
                    done();
                });
            });
        });

    });

    it('will release funds, using any address', function(done){

        Child.deployed().then(function(_child){

            web3.eth.getBalance(organiser)
            _child.payOrganizer({from: donator})            // any address should work
                .then(function(tx){

                    web3.eth.getBalance(organiser, function(err, tx){
                        if(err) return done(err);

                        assert.equal(tx.toNumber(), 10);
                        done();
                    });
                })
                .catch(done);
        });
    });

})
