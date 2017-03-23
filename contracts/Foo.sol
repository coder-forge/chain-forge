pragma solidity ^0.4.2;

import './Bar.sol';

contract Foo{

    address public organiser = 0xA1756306Ae0D8863956B4500E9beAD5034deccbf;

    function payOrganizer() payable returns(bool){
        if(!organiser.call.gas(200000).value(this.balance)())
          throw;
        return true;
    }

    function createBar(){

      Bar bar = new Bar();
    }
}
