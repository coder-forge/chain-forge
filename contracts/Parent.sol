pragma solidity ^0.4.8;

import './Child.sol';

contract Parent{

    // address with 'admin' rights
    address owner;
    address[] public children;

    event Log(
        address child,
        uint256 index
    );

    // constructor
    function Parent(){
        owner = msg.sender;
    }

    function getOwner() constant returns (address){
        return owner;
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

        require(owner == msg.sender);

        Child child = new Child(name, orgWallet);

        uint256 index = children.push(child);   // returns new array length;
        index--;

        Log(child, index);

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
