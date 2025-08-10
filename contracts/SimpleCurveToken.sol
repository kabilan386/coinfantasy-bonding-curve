// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract SimpleCurveToken is ERC20 {
    uint256 public immutable basePrice; // in wei per token
    uint256 public immutable slope;     // in wei per token per token
    uint256 private constant WAD = 1e18; // 18 decimal scaling

    event Bought(address indexed buyer, uint256 ethIn, uint256 tokensOut);
    event Sold(address indexed seller, uint256 tokensIn, uint256 ethOut);

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply,   // e.g. 1000e18
        uint256 basePriceWei,    // e.g. 1e15 = 0.001 ETH
        uint256 slopeWeiPerToken // e.g. 1e12 = 0.000001 ETH per token supply
    ) ERC20(name_, symbol_) {
        require(basePriceWei > 0, "basePrice=0");
        require(slopeWeiPerToken > 0, "slope=0");

        basePrice = basePriceWei;
        slope = slopeWeiPerToken;

        _mint(msg.sender, initialSupply); // Give deployer the initial supply
    }

    /// @notice Current token price in wei
    function currentPrice() public view returns (uint256) {
        return basePrice + (slope * totalSupply()) / WAD;
    }

    /// @notice Estimate tokens received for given ETH
    function estimateTokensForEth(uint256 ethIn) external view returns (uint256) {
        uint256 p = currentPrice();
        return (ethIn * WAD) / p;
    }

    /// @notice Estimate ETH received for given tokens
    function estimateEthForTokens(uint256 tokensIn) external view returns (uint256) {
        uint256 p = currentPrice();
        return (tokensIn * p) / WAD;
    }

    /// @notice Buy tokens with ETH
    function buy() external payable returns (uint256 tokensOut) {
        require(msg.value > 0, "send ETH");
        uint256 p = currentPrice();
        tokensOut = (msg.value * WAD) / p;
        require(tokensOut > 0, "too little ETH");
        _mint(msg.sender, tokensOut);
        emit Bought(msg.sender, msg.value, tokensOut);
    }

    /// @notice Sell tokens for ETH
    function sell(uint256 amount) external returns (uint256 ethOut) {
        require(amount > 0, "amount=0");
        require(balanceOf(msg.sender) >= amount, "insufficient tokens");

        uint256 p = currentPrice();
        ethOut = (amount * p) / WAD;
        require(address(this).balance >= ethOut, "contract lacks ETH");

        _burn(msg.sender, amount);
        (bool ok, ) = msg.sender.call{value: ethOut}("");
        require(ok, "ETH transfer failed");

        emit Sold(msg.sender, amount, ethOut);
    }

    receive() external payable {}
}
