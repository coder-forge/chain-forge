pragma solidity ^0.4.2;

contract Forge{

    address owner;
    bytes32 public _name;

    function Forge(){
        owner = msg.sender;
    }

    function payOrganiser() returns(bool){
        // http://ethereum.stackexchange.com/a/2971/4304
        return true; // targetAddress.call.gas(200000).value(this.balance)();
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
