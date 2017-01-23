contract('Forge', function(accounts){

    let forge,
        expectedName, expectedWallet;

    beforeEach((done)=>{

        // covers testing "is deployed?"
        forge = Forge.at(Forge.deployed().address);
        assert.isTrue(true);

        expectedName = 'my forge';
        expectedWallet = accounts[1];

        done();
    })

    it('sets & gets name', ()=>{

        return forge.setName(expectedName, {from: accounts[0], gas: 200000})
            .then(()=>{

                return forge._name.call({from: accounts[0]});
            })
            .then((_name)=>{

                let actual = web3.toUtf8(_name);
                assert.equal(actual, expectedName);
            });
    });

    it('sets & gets organiser address', ()=>{

      return forge.setOrganiser(expectedWallet, {from: accounts[0], gas: 200000})
        .then(()=>{
          return forge._organiser.call({from: accounts[0]});
        })
        .then((address)=>{
          let actual = address;
          assert.equal(actual, expectedWallet);
        });
    });

    it.skip('will release funds to organiser', ()=>{

        // send ether: http://ethereum.stackexchange.com/a/2971/4304
        targetAddress.call.gas(200000).value(this.balance)();
    });

    it('will not suicide contract if not owner', ()=>{

        // suicide
        return forge.kill({from: accounts[1]})
            .then(()=>{

                // test
                return forge._name.call({from: accounts[0]})
                    .then((name)=>{

                        let actual = web3.toUtf8(name);
                        assert.equal(actual, expectedName);
                    });
            });
    });

    it('will suicide contract if owner', ()=>{

        return forge.kill({from: accounts[0]})
            .then(()=>{

                return forge._name.call({from: accounts[0]})
                    .then((name)=>{

                        let actual = web3.toUtf8(name);
                        assert.notEqual(actual, expectedName);
                    })
            })
    });
});
