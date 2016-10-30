"use strict";

class CoderForgeACL{

    get contract(){
        return CoderForge.deployed();
    }

    register(name){

        const self = this,
            owner = self.contract.address;

        var event = self.contract.LogForge();
        event.watch(function(error, result){
            console.log(error);
            console.log(result);
        });

        console.log('owner: ', owner);
        self.contract.newForge(name, {from: owner})
            .then(function(index){

                console.log('index: ', index);
                console.log(arguments);
            })
            .catch((e)=>{
                console.log('ERROR:');
                console.error(e);
            });
    }
}
