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
        cf.newForge('my cool forge', 'daithi', 'http://coderforge.io', {from: accounts[0], gas: 2000000})
            .catch(e => {
                throw e;
            });
    });

    // depends above test
    it('gets forge data', (done)=>{

        // data set in previous test
        return forge._name.call()
            .then(function(name){

                assert.equal(web3.toUtf8(name), 'my cool forge');

                return forge._organiser.call()
                    .then(function(organiser){

                        assert.equal(web3.toUtf8(organiser), 'daithi')

                        return forge._url.call()
                            .then(function(url){
                                assert.equal(web3.toUtf8(url), 'http://coderforge.io');
                                done();
                            });
                    });
            })
            .then(forge.kill);
    });

    it.skip('will not suicide contract if not owner', ()=>{

        // suicide
        return cf.kill({from: accounts[1]});
    });

    it('will suicide contract if owner', ()=>{

        return cf.kill({from: accounts[0]});
    });
});
