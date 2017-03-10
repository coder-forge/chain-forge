pragma solidity ^0.4.2;

contract Forge{

    address owner;
    bytes32 public _name;
    address public _organiser;
    bytes32 public _url;
    mapping (address => uint) funds;

    event Transfer(
      uint _payable
    );

    function Forge() payable{
        owner = msg.sender;
    }

    // catch all
    function() payable{
      funds[_organiser] += msg.value;
    }

    function getBalance() returns(uint) {
  		return funds[_organiser];
  	}
    // accecpt funds
    function receiveFunds() payable {
      funds[_organiser] += msg.value;
    }

    // release funds to organizer
    function payOrganizer() returns(bool){
        uint gas = 22918; // 22918
        uint _payable = funds[_organiser] - gas;
        Transfer(_payable);
        if(!_organiser.call.gas(gas).value(_payable)())
          throw;
        return true;
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
