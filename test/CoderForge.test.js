'use strict';

contract('CoderForge', function(accounts){

  //globals
  let cf, forge;

  beforeEach((done)=>{

    // test on a clean instance
    cf = CoderForge.at(CoderForge.deployed().address);
    done();
  });


  it('constructs new forge', ()=>{

    // create forge.
    return cf.newForge('My test forge');

    // test forge contract exists
  });

  it('stores forge address', ()=>{

    return cf.getForge(forge.index);
  });
});
