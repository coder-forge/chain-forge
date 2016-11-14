pragma solidity ^0.4.2;

contract Forge{

    address owner;
    bytes32 public _name;

    function Forge(){
        owner = msg.sender;
    }

    // set forge name
    function setName(bytes32 name) returns(bool){

        if(msg.sender==owner){
            _name = name;
            return true;
        }

        return false;
    }

    function kill() returns(bool){
        if(msg.sender==owner){
            selfdestruct(msg.sender);
            return true;
        }
        return false;
    }
}
