/**
var Foo = artifacts.require('./Foo.sol'),
  Bar = artifacts.require('./Bar.sol');

module.exports = function (deployer) {
  deployer.deploy(Foo);
  deployer.link(Foo, Bar);
  deployer.deploy(Bar);
};
*/

var CoderForge = artifacts.require('./CoderForge.sol');
var Forge = artifacts.require('./Forge.sol');

module.exports = function(deployer) {
  //deployer.deploy(CoderForge);
  //deployer.link(CoderForge, Forge);
  deployer.deploy(Forge);
};
