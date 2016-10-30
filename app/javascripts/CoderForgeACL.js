"use strict";

class CoderForgeACL{

    get contract(){
        return CoderForge.deployed();
    }

    register(name){

        const self = this,
            owner = self.contract.address;

        const contract = CoderForge.at("0x69accc79a327af944635758a6b947119e069ebd5");

        /**
        var events = contract.allEvents();
        events.watch(function(error, event){
            if (error) {
                console.log("Error: " + error);
            } else {
                console.log(event.event + ": " + JSON.stringify(event.args));
            }
        });
        */

        var event = contract.LogForge();
        event.watch(function(error, result){
            console.log(error);
            console.log(result);
        });

        contract.newForge("daithi", {from: accounts[0]})
            .then(function(index){

                console.log('args...');
                console.log(arguments);
            })
            .catch((e)=>{
                console.log('ERROR:');
                console.error(e);
            });
    }
}
