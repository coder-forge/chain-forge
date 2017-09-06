const Parent = artifacts.require('./Parent.sol'),
    Child = artifacts.require('./Child.sol');

contract('Parent', function(accounts){

    const coinbase = accounts[0],
        organiser = accounts[1];

    it('setOwner will set the owner address', function(){

        // set new owner
        return Parent.deployed().then(function parentDeployed(_parent){

            return _parent.setOwner.call(organiser)
                .then(function parentDeployed(result){
                    assert.isTrue(result, 'setting owner returned false');
                });
        });
    });

    it('setOwner only allow owner address', function(){

        // test owner not updated
        return Parent.deployed().then(function(_parent){

            return _parent.getOwner.call()
                .then(function(result){
                    return _parent.setOwner.call(organiser, {from: organiser});
                })
                .then(function(result){
                    assert.isFalse(result, 'non owner can set owner');
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
