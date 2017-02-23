contract('Forge', function(accounts){

  let forge,
    expectedWallet = accounts[1];

  it('deploys contract', (done)=>{

    forge = Forge.at(Forge.deployed().address);
    assert.isTrue(true);
    done();
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

  it('releases funds to organiser', ()=>{

    forge.getBalance.call()
      .then(function(balance){
        console.log('balance: ', balance);
      })
  });
});
