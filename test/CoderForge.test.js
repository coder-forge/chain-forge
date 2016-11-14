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

        let f,
            logForge = cf.LogForge();

        // watch events for new forge.
        logForge.watch(function(err, res){
            if(err) throw err;

            forge = Forge.at(res.args.forge);
            logForge.stopWatching();
            done();
        });

        // create forge.
        cf.newForge('my cool forge', {gas: 200000})
            .catch(done);
    });

    // depends above test
    it('gets forge name', ()=>{

        // name set in previous test
        return forge._name.call()
            .then((actual)=>{

                assert(actual, 'my cool forge');
                return;
            })
            .then(forge.kill);
    });

    it.skip('will not suicide contract if not owner', ()=>{

        // suicide
        return cf.kill({from: accounts[1]});
    });

    it('will suicide contract if owner', (skip)=>{

        return cf.kill({from: accounts[0]});
    });
});
