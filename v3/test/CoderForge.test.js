contract('CoderForge', function(accounts){

  let cf, forge, forge_index;

  beforeEach((done)=>{

    // test clean instance
    cf = CoderForge.at(CoderForge.deployed().address);
    assert.isTrue(true);
    done();
  });

  it('constructs new forge and watches events', (done)=>{

    // create forge.
    cf.newForge('my cool forge', accounts[1], {from: accounts[0], gas: 2000000})
      .then((transHash, var1)=>{

        let logForge = cf.LogForge({transactionHash: transHash, fromBlock: 'latest'});

        // watch events for new forge.
        logForge.watch(function(err, res){
          if(err) throw err;

          logForge.stopWatching();
          forge = Forge.at(res.args.forge);
          forge_index = res.args.index.toString();
          done();
        });
      })
      .catch(e => {
        throw e;
      });
  });

  it('forge address pushed to state', (done)=>{

    cf.getForge(forge_index).then(function(address){
      assert.equal(address, forge.address);
      done();
    });
  });

  it.skip('will not suicide contract if not owner', ()=>{

    return cf.kill({from: accounts[1]})
      .then(function(){
        cf.owner.call().then(function(){
          console.log(accounts);
          console.log(arguments);
        });
      });
  });

  it.skip('will suicide contract if owner', ()=>{

    return cf.kill({from: accounts[0]})
      .then(function(){
        cf.owner.call().then(function(){
          console.log(accounts);
          console.log(arguments);
        });
      });
  });
});
