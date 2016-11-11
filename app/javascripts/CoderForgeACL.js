"use strict";

class CoderForgeACL{

    get contract(){
        return CoderForge.deployed();
    }

    register(name){

        const self = this,
            owner = self.contract.address,
            watcher = self.contract.LogForge(null, {fromBlock: 0, toBlock: 'latest'});

        console.log('owner: ', owner);
        console.log('watcher: ', watcher);

        self.contract.newForge(name, {from: web3.eth.accounts[0]})
            .then(function(tx){

                console.log('tx: ', tx);
                console.log(arguments);
                watcher.get()
                    .then((logs)=>{
                        console.log('logs: ', logs);
                    });
            })
            .then(function(events){

                console.log(events);
                return events;
            })
            .catch((e)=>{
                console.log('ERROR:');
                console.error(e);
            });
    }
}
