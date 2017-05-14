pragma solidity ^0.4.8;

import './Child.sol';

contract Parent{

    // address with 'admin' rights
    address owner;
    address[] public children;

    // constructor
    function Parent(){
        owner = msg.sender;
    }

    // set address with admin rights
    function setOwner(address newOwner) returns (bool){

        // only if call came from address in owner property
        if(owner == msg.sender){
            owner = newOwner;
            return true;
        }

        return false;
    }

    // create a child contract
    function newChild(bytes32 name, address orgWallet) public returns (uint256){

        if(owner != msg.sender){
            throw;
        }

        Child child = new Child(orgWallet, name);

        uint256 index = children.push(child);   // returns new array length;
        index--;

        // LogForge(owner, forge, index);

        return index;
    }

    // destroy the contract
    function destroy() returns (bool){
        if(owner == msg.sender){
            selfdestruct(owner);
            return true;
        }
        return false;
    }
}
