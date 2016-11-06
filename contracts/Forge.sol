pragma solidity ^0.4.2;

contract Forge{

    struct Fields{
        string name;
    }
    Fields fields;

    function Forge(string name){
        fields = Fields(name);
    }

    function getField(string name) returns (string _name){
        return "this is a string";
    }
}
