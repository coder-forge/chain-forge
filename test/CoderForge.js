"use strict";

contract('CoderForge', function(accounts){

    let cf, f;

    it('is deployed', (done)=>{

        cf = CoderForge.at(CoderForge.deployed().address);
        assert.isTrue(true);
        done();
    });

    it('constructs new forge and watches events', (done)=>{

        CoderForge.new({from: accounts[0]})

            // watch events
            .then((cf)=>{
                cf.allEvents(function(err, res){
                    if(err) throw err;

                    if(!f){                                                     // TODO better pattern needed to prevent done() multiple times.
                        f = Forge.at(res.args.forge);
                        done();
                    }
                });
                return cf;
            })

            // create forge
            .then((cf)=>{
                cf.newForge('this name')
                    .catch(done);
            })

            .catch(done);
    });

    it('gets forge name', (done)=>{

        f.getField('name')
            .then(field => {
                console.log('field: ', field);
                done();
            })
            .catch(done);
    });
});
