"use strict";
/* global it: true */
/* global contract: true */
/* global assert: true */

contract('CoderForge', function(accounts){

    let cf, forge;

    beforeEach((done)=>{

        cf = CoderForge.at(CoderForge.deployed().address);
        assert.isTrue(true);
        done();
    });

    it('constructs new forge and watches events', (done)=>{

        // create forge.
        cf.newForge('my cool forge', accounts[1], {from: accounts[0], gas: 2000000})
          .then((transHash)=>{

            let logForge = cf.LogForge({transactionHash: transHash, fromBlock: 'latest'});

            // watch events for new forge.
            logForge.watch(function(err, res){
              if(err) throw err;

              forge = Forge.at(res.args.forge);
              logForge.stopWatching();
              done();
              return forge;
            });
          })
          .catch(e => {
            throw e;
          });
    });

    it.skip('will not suicide contract if not owner', ()=>{

        // suicide
        return cf.kill({from: accounts[1]});
    });

    it('will suicide contract if owner', ()=>{

        return cf.kill({from: accounts[0]});
    });
});
