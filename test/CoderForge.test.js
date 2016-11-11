"use strict";
/* global it: true */
/* global contract: true */
/* global assert: true */

contract('CoderForge', function(accounts){

    let cf, f;

    it('is deployed', (done)=>{

        cf = CoderForge.at(CoderForge.deployed().address);
        assert.isTrue(true);
        done();
    });

    it('constructs new forge and watches events', (done)=>{

        CoderForge.new({from: accounts[0]})

            // listen events handler for forge creation.
            .then((cf)=>{

                let logForge = cf.LogForge();

                logForge.watch(function(err, res){
                    if(err) throw err;

                    if(!f){                                                     // TODO better pattern needed to prevent done() multiple times.
                        f = Forge.at(res.args.forge);
                        logForge.stopWatching();
                        done();
                    }
                });

                return cf;
            })

            // create forge
            .then((cf)=>{

                cf.newForge('my cool forge', {gas: 200000})
                    .catch(done);
            })

            .catch(done);
    });

    it('gets forge name', (done)=>{

        // name set in previous test
        f._name.call()
            .then(function(actual){

                assert(actual, 'my cool forge');
                done();
            })
            .catch(done);
    });
});
