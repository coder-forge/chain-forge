contract('CoderForge', function(accounts){

  let cf;

  it('deploys contract', (done)=>{

    cf = CoderForge.at(CoderForge.deployed().address);
    assert.isTrue(true);
    done();
  });
});
