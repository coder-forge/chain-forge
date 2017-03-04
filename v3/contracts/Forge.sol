pragma solidity ^0.4.2;

contract Forge{

    address owner;
    bytes32 public _name;
    address public _organiser;
    bytes32 public _url;
    uint public funds;

    function Forge() payable{
        owner = msg.sender;
    }

    // accecpt funds
    function receiveFunds() payable {
      funds += msg.value;
    }

    // release funds to organizer
    function payOrganiser() returns(bool){
          if(!_organiser.call.gas(20000).value(this.balance)())
            throw;
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

    // set forge url (meetup, eventbrite, website etc)
    function setUrl(bytes32 url) returns(bool){

        if(msg.sender==owner){
            _url = url;
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
