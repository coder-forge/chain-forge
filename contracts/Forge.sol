pragma solidity ^0.4.2;

contract Forge{

    struct Fields{
        string name;
    }
    Fields fields;

    function Forge(string name){
        fields = Fields(name);
    }

    function getField() constant returns (string name){
        return "this is definitely a string";
    }
}
