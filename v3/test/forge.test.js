'use strict';

const Forge = artifacts.require('./Forge.sol');

contract('Forge', function(accounts){

  const donator = accounts[2],
    organiser = accounts[1],
    owner = accounts[0];

  it('is deployed', function(){

    return Forge.deployed().then(function(instance){

      console.log('deployed addresses: ');
      console.log('\tForge: ', instance.address);
      console.log('\tOrganiser: ', organiser);
      console.log('\tOwner: ', owner);
      console.log('\tDonator: ', donator);

      // console.log('\nstarting balances: ');
      // console.log('\torganisers balance: ', web3.eth.getBalance(organiser).valueOf());
      // console.log('\tforges balance: ', web3.eth.getBalance(instance.address).valueOf());
      // console.log('\tdoators balance: ', web3.eth.getBalance(donator).valueOf());

    });
  });


  it("should set organiser", function(){

    return Forge.deployed().then(function(instance) {
        return instance.setOrganiser(organiser)
          .then(function(tx){
            return instance._organiser.call(function(_organiser){
              assert.equal(_organiser, organiser, "organiser account not set");
            });
          });
      })
  });

  // @todo Watch for transfer event
  it.skip("should accept funds", function(){

    return Forge.deployed().then(function(instance){

      const _instance = instance,
        amount = web3.toWei(0.05, "ether");

      _instance.sendTransaction({from:donator, value: amount})
        .then(function(tx){
          return _instance.getBalance.call(owner)
            .then(function(balance){
              return assert.equal(balance.valueOf(), amount, "owner can't see balance");
            });
          })
          .then(function(){
            return _instance.getBalance.call(organiser)
            .then(function(balance){
              return assert.equal(balance.valueOf(), amount, "organiser can't see balance");
            });
          })
          .then(function(){
            return _instance.getBalance.call(accounts[3])
            .then(function(balance){
              return assert.equal(balance.valueOf(), amount, "public can't see balance");
            });
          });
      });
  });

  // @todo finish this test
  it.skip("should release funds to organiser", function(done){

    return Forge.deployed().then(function(instance){

      const _instance = instance;

      return _instance.payOrganizer.call({
          from: organiser,
          gas: 1000000,
        })
        .then(txHash => {

          const Transfer = _instance.Transfer({transactionHash: txHash, fromBlock: "latest"});
          Transfer.watch(function(err, res){


            // console.log('arguments: ', arguments);

            // console.log('\nending balances: ');
            // console.log('\torganisers balance: ', web3.eth.getBalance(organiser).valueOf());
            // console.log('\tforges     balance: ', web3.eth.getBalance(_instance.address).valueOf());
            // console.log('\tdoators    balance: ', web3.eth.getBalance(donator).valueOf());

            // console.log('tx: ', tx);
            assert.notEqual(tx, false, 'funds not released to organiser');
            // console.log('\nending balances: ');
            // console.log('\torganisers balance: ', web3.eth.getBalance(organiser).valueOf());
            // console.log('\tforges     balance: ', web3.eth.getBalance(_instance.address).valueOf());
            // console.log('\tdoators    balance: ', web3.eth.getBalance(donator).valueOf());
            done();
          })
        });
    });
  });
});
