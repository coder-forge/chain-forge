"use strict";

class CoderForgeACL{

    get contract(){
        return CoderForge.deployed();
    }

    register(){

        const self = this,
            owner = self.contract.address;

        self.contract.newForge("daithi","my-site","dfc","dfc-site","meetup-link", {from: owner})
            .then((address)=>{
                console.log('new forge: ', address);
            })
            .catch((e)=>{
                console.log('ERROR:');
                console.error(e);
            });
    }
}
