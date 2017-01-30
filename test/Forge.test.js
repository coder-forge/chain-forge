contract('Forge', function(accounts){

  let forge;

  it('deploys contract', (done)=>{

    forge = Forge.at(Forge.deployed().address);
    assert.isTrue(true);
    done();
  });
});
