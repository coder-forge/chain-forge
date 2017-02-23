pragma solidity ^0.4.2;

contract Forge{

    address owner;
    bytes32 public _name;
    address public _organiser;

    function Forge(){
        owner = msg.sender;
    }

    function getBalance() returns(uint){
        return this.balance;
    }

    function payOrganiser() returns(bool){
        return _organiser.call.gas(20000).value(this.balance)();
    }

    // set forge name
    function setName(bytes32 name) returns(bool){

        if(msg.sender==owner){
            _name = name;
            return true;
        }

        return false;
    }

    // set forge organiser
    function setOrganiser(address organiser) returns(bool){

        if(msg.sender==owner){
            _organiser = organiser;
            return true;
        }

        return false;
    }
}
