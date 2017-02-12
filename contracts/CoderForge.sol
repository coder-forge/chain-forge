pragma solidity ^0.4.2;

import 'Forge.sol';

contract CoderForge{

  address public owner;

  function CoderForge(){
    owner = msg.sender;
  }

  function newForge(bytes32 name) returns (address){

    Forge forge = new Forge();
    return forge;
  }
}
