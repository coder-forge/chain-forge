contract('Forge', function(accounts){

    let forge;

    it('is deployed', (done)=>{

        forge = Forge.at(Forge.deployed().address);
        assert.isTrue(true);
        done();
    });

    it('sets & gets name', (done)=>{

        let expected = 'my forge';

        forge.setName(expected, {from: accounts[0], gas: 200000})
            .then(()=>{
                return forge._name.call({from: accounts[0]});
            })
            .then(function(_name){
                let actual = web3.toUtf8(_name);
                assert.equal(actual, expected);
                done();
            })
            .catch(done);
    });
});
