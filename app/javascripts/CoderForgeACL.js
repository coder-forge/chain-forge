"use strict";

class CoderForgeACL{

    construct(){
        this.coinbase;
    }

    /**
     * Get ACL contract.
     * @return {CoderForge} The main ACL controller contract.
     */
    get contract(){
        return CoderForge.at(CoderForge.deployed().address);
    }

    /**
     * Register a new forge.
     * @param {String} name The forge name.
     * @return {Promise} resolves to created Forge contract.
     */
    newForge(name){

        const self = this,
            logForge = self.contract.LogForge();

        return new Promise((resolve, reject)=>{

            console.log('ACL newForge()');

            // create forge.
            return self.contract.newForge(''+name, {from: self.coinbase, gas: 2000000})
                .then(function(contract){
                    console.log('newForge.then:arguments: ', arguments);

                    // watch events for new forge.
                    let meta = self.contract;
                    let logForge = meta.LogForge({transactionHash: contract, fromBlock: 'latest'});
                    logForge.watch(function(err, res){
                        logForge.stopWatching();
                        console.log('logForge.watch.args: ', [err, res]);
                        if(err) return reject(err);

                        let forge = Forge.at(res.args.forge);

                        forge._name.call()
                            .then( bytes32 =>{

                                const actual = web3.toUtf8(bytes32);
                                console.log('actual name: ', actual);

                                if(name===actual)
                                    return resolve(forge);
                                return reject(new Error('Unkown Error'));
                            })
                            .catch(err => {
                                return reject(err);
                            });
                    });

                    return arguments[0];
                })
                .catch(err => {
                    return reject(err);
                });
        });
    }
}
