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
     * @param {Object} forge Forge object {name, organiser, url, orgWallet,
     * address, hostName}.
     * @return {Promise} resolves to created Forge contract.
     */
    newForge(forgeData){

        const self = this,
            logForge = self.contract.LogForge();

        return new Promise((resolve, reject)=>{

            console.log('ACL newForge()');

            // create forge.
            return self.contract.newForge(
                ''+forgeData.name,
                ''+forgeData.orgWallet,
                {from: self.coinbase, gas: 2000000})
                .then(function(transHash){
                    console.log('newForge.then:arguments: ', arguments);

                    // watch events for new forge.
                    let meta = self.contract;
                    let logForge = meta.LogForge({transactionHash: transHash, fromBlock: 'latest'});
                    logForge.watch(function(err, res){
                        logForge.stopWatching();
                        console.log('logForge.watch.args: ', [err, res]);
                        if(err) return reject(err);

                        let forge = Forge.at(res.args.forge);

                        forge._name.call()
                            .then( bytes32 =>{

                                const actual = web3.toHex(web3.toAscii(bytes32)),             // 32 bytes => 32 byte Ascii (?) => Hex
                                  expected = self._padRight(web3.toHex(forgeData.name), 66);  // 16 bit Ascii => Hex

                                // bitwise 32 bytes against 16 bit strings, so test both casted to hex.
                                if(actual===expected)
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

    /**
     * Padd zero's to the right side of a string.
     * @param {String} str The string to padd.
     * @param {Number} len The required total string length.
     * @return {String} Returns from holidays wrecked.
     */
    _padRight(str, len){
      while(str.length<len)
        str += "0";
      return str;
    }
}
