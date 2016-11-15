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

            // watch events for new forge.
            logForge.watch((err, res)=>{
                if(err) return reject(err);

                let forge = Forge.at(res.args.forge);

                forge._name.call()
                    .then( bytes32 =>{

                        const actual = web3.toUtf8(bytes32);

                        if(name===actual)
                            return resolve(forge);
                        return reject(new Error('Unkown Error'));
                    })
                    .catch(err => {
                        return reject(err);
                    });
                logForge.stopWatching();
            });

            // create forge.
            self.contract.newForge(''+name, {from: self.coinbase, gas: 200000})
                .catch(err => {
                    return reject(err);
                });
        });
    }
}
