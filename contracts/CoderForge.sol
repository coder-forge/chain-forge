contract CoderForge{

    address owner;

    function CoderForge(){
        owner = msg.sender;
    }

    function newForge(string name, string nameUrl, string host, string hostUrl, string meetup) returns (address){
        address forge = address(new Forge(name, nameUrl, host, hostUrl, meetup));
        return forge;
    }
}

contract Forge{

    mapping(string=>string) fields;

    function Forge(string name, string nameUrl, string host, string hostUrl, string meetup){

        fields['name']      = name;
        fields['nameUrl']   = nameUrl;
        fields['host']      = host;
        fields['hostUrl']   = hostUrl;
        fields['meetup']    = meetup;
    }


    function getField(string name) constant returns (string value){
        return fields[name];
    }

    function getFields() constant returns (string name, string nameUrl, string host, string hostUrl, string meetup){
        return (fields['name'], fields['nameUrl'], fields['host'], fields['hostUrl'], fields['meetup']);
    }
}
