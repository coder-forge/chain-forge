import 'Forge.sol';

contract CoderForge{

    address owner;

    address[] forges;

    event LogForge(address _from, address forge);

    function CoderForge(){
        owner = msg.sender;
    }

    function newForge(string name) returns (address){
        address forge = new Forge(name);
        LogForge(forge, owner);
        uint newLength = forges.push(forge);
        return forge;
    }

    function foobar() constant returns (string){
        return "foobar";
    }
}
