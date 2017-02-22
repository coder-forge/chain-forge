'use strict';

contract('CoderForge', function(accounts){

  //globals
  let cf, forgeIndex;

  beforeEach((done)=>{

    // test on a clean instance
    cf = CoderForge.at(CoderForge.deployed().address);
    done();
  });


  it('constructs new forge', (done)=>{

    // create forge.
    return cf.newForge('My test forge')
      .then(transHash => {

        let logForge = cf.LogForge({transactionHash: transHash, fromBlock: 'latest'});

        // watch events for new forge.
        logForge.watch(function(err, res){
          if(err) throw err;

          logForge.stopWatching();
          forgeIndex = res.args.index.toString();
          done();
        });
      });
  });

  it('stores forge address', ()=>{

    return cf.forges(forgeIndex);
  });
});
