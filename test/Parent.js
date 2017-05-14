var Parent = artifacts.require('./Parent.sol');

contract('Parent', function(accounts){

    const coinbase = accounts[0],
        organiser = accounts[1];

    it('will set the owner address', function(){

        return Parent.deployed().then(function(_parent){

            return _parent.setOwner.call(coinbase, "address here");
        })
        .then(function(result){
            assert.isTrue(result, 'error setting owner address');
        });
    });
});
