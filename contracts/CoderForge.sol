pragma solidity ^0.4.2;

import 'Forge.sol';

contract CoderForge{

  address public owner;
  address[] public forges;

  function CoderForge(){
    owner = msg.sender;
  }

  function newForge(bytes32 name) constant returns (uint256){

    if(owner!=msg.sender) return;

    Forge forge = new Forge();

    uint256 index = forges.push(forge);   // returns new array length;
    index--;

    return index;
  }
}
