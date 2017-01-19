pragma solidity ^0.4.0;
contract Storj {
	
    mapping (address => address) public registry;

    modifier isRegistered()
    {
        if (registry[msg.sender] != 0x0) throw;
        _;
    }
    
    modifier isOwner()
    {
        if (msg.sender != registry[msg.sender]) throw;
        _;
    }
  
    function register ()
        isRegistered()
        returns(bool)
    {
        registry[msg.sender] = msg.sender;
        return true;
    }
    
    function login ()
        isOwner()
        returns(bool)
    {
        return true;
    }
}
