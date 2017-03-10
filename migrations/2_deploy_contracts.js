var CoderForge = artifacts.require('./CoderForge.sol');
var Forge = artifacts.require('./Forge.sol');

module.exports = function(deployer) {
  deployer.deploy(CoderForge);
  deployer.link(CoderForge, Forge);
  deployer.deploy(Forge);
};
