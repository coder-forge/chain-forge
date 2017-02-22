pragma solidity ^0.4.2;

import 'Forge.sol';

contract CoderForge{

  address public owner;
  address[] public forges;

  event LogForge(
    address _from,
    address forge,
    uint256 index
  );


  function CoderForge(){
    owner = msg.sender;
  }

  function newForge(bytes32 name) returns (uint256){

    Forge forge = new Forge();

    uint256 index = forges.push(forge);   // returns new array length;
    index--;

    LogForge(owner, forge, index);

    return index;
  }
}
