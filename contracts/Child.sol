pragma solidity ^0.4.8;

contract Child{

    address owner;
    address organiser;
    bytes32 name;

    // constructor
    // as the parent will deploy this, then the parent address will always be
    // owner.
    function Child(address orgAddr, bytes32 orgName){
        owner = msg.sender;
        organiser = orgAddr;
        name = orgName;
    }

    // set the organisers address
    function setOrgAddress(address newAddress) returns (bool){
        if(owner == msg.sender || organiser == msg.sender){
            organiser = newAddress;
            return true;
        }

        return false;
    }

    // set the organisers name
    function setOrgName(bytes32 newName) returns (bool){
        if(owner == msg.sender || organiser == msg.sender){
            name = newName;
            return true;
        }

        return false;
    }

    // set address with admin rights
    function setOwner(address newOwner) returns (bool){

        // only if current owner
        if(owner == msg.sender){
            owner = newOwner;
            return true;
        }

        return false;
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
