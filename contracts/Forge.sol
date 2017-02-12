pragma solidity ^0.4.2;

contract Forge{

    address public owner;

    function Forge(){
        owner = msg.sender;
    }

}
