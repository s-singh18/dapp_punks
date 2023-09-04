// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "./ERC721Enumerable.sol";
import "./Ownable.sol";

contract NFT is ERC721Enumerable, Ownable {
    using Strings for uint256;

    string public baseURI;
    string public baseExtension = ".json";
    uint256 public cost;
    uint256 public maxSupply;
    uint256 public allowMintingOn;
    uint256 public maxBalance;
    bool public mintingOn = true;

    mapping(address => bool) public whitelist;

    event Mint(uint256 amount, address minter);
    event Withdraw(uint256 amount, address owner);

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _cost,
        uint256 _maxSupply,
        uint256 _allowMintingOn,
        string memory _baseURI
    ) ERC721(_name, _symbol) {
        cost = _cost;
        maxSupply = _maxSupply;
        allowMintingOn = _allowMintingOn;
        baseURI = _baseURI;
        maxBalance = maxSupply;
    }

    modifier onlyWhitelistedUser() {
        require(whitelist[msg.sender] == true);
        _;
    }

    function addUser(address _userAddress) public onlyOwner {
        whitelist[_userAddress] = true;
    }

    function removeUser(address _userAddress) public onlyOwner {
        whitelist[_userAddress] = false;
    }

    function turnMintingOn() public onlyOwner {
        mintingOn = true;
    }

    function turnMintingOff() public onlyOwner {
        mintingOn = false;
    }

    function toggleMinting() public onlyOwner {
        if (mintingOn == true) {
            turnMintingOff();
        } else if (mintingOn == false) {
            turnMintingOn();
        }
    }

    function setMaxBalance(uint256 _balance) public onlyOwner {
        require(_balance < maxSupply);
        maxBalance = _balance;
    }

    function mint(uint256 _mintAmount) public payable onlyWhitelistedUser {
        // Create a token
        require(
            balanceOf(msg.sender) + _mintAmount <= maxBalance,
            "User token balance exceeds max allowed balance"
        );

        require(mintingOn == true, "Minting must be turned on");

        require(
            block.timestamp >= allowMintingOn,
            "Mint in the alotted time period"
        );

        require(_mintAmount > 0);

        require(msg.value >= cost * _mintAmount);

        uint256 supply = totalSupply();

        require(supply + _mintAmount <= maxSupply);

        for (uint256 i = 1; i <= _mintAmount; i++) {
            _safeMint(msg.sender, supply + i);
        }

        emit Mint(_mintAmount, msg.sender);
    }

    function tokenURI(
        uint256 _tokenId
    ) public view virtual override returns (string memory) {
        require(_exists(_tokenId), "token does not exist");
        return (
            string(
                abi.encodePacked(baseURI, _tokenId.toString(), baseExtension)
            )
        );
    }

    function walletOfOwner(
        address _owner
    ) public view returns (uint256[] memory) {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        for (uint256 i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;

        (bool success, ) = payable(msg.sender).call{value: balance}("");
        require(success);

        emit Withdraw(balance, msg.sender);
    }
}
