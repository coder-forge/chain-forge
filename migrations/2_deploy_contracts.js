var ConvertLib = artifacts.require("./ConvertLib.sol");
var MetaCoin = artifacts.require("./MetaCoin.sol");
var Parent = artifacts.require("./Parent.sol");
var Child = artifacts.require("./Child.sol");

module.exports = function(deployer) {
  deployer.deploy(Parent);
  deployer.link(Parent, Child);
  deployer.deploy(Child);
};
