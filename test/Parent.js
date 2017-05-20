const Parent = artifacts.require('./Parent.sol'),
    Child = artifacts.require('./Child.sol');

contract('Parent', function(accounts){

    const coinbase = accounts[0],
        organiser = accounts[1];

    it('setOwner will set the owner address', function(){

        // set new owner
        return Parent.deployed().then(function(_parent){

            return _parent.setOwner(organiser, {from: coinbase})
                .then(function(){
                    return _parent.getOwner.call(accounts[0]);
                })
                .then(function(newOwner){
                    assert.equal(newOwner, organiser, 'new owner address not set');
                });
        });
    });

    it('setOwner only allow owner address', function(){

        // test owner not updated
        return Parent.deployed().then(function(_parent){

            return _parent.setOwner(organiser, {from: coinbase})
                .then(function(){
                    return _parent.getOwner.call(accounts[0]);
                })
                .then(function(owner){
                    assert.equal(owner, organiser, 'non owner udpate success');
                    return _parent.setOwner(coinbase, {from: organiser});       // reset coinbase as owner
                });
        });
    });

    it('will create a child contract', function(){

        const expectedName = "My Cool Event";
        let childAddress, index;

        return Parent.deployed().then(function(_parent){

            _parent.newChild(expectedName, organiser, {from: coinbase})
                .then(function(tx){

                    childAddress = tx.logs[0].args.child;
                    index = tx.logs[0].args.index.toNumber();

                    return Child.at(childAddress).organiser.call({from : coinbase});
                })
                .then(function(_organiser){
                    assert.equal(_organiser, organiser, 'wrong address for organiser');
                    return Child.at(childAddress).name.call({from: coinbase});
                })
                .then(function(_name){
                    assert.equal(web3.toUtf8(_name), expectedName, 'wrong name set');
                });
        });
    });
});
