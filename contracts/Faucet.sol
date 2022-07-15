// SPDX-License-Identifier: LGPL-3.0-only

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

uint256 constant claimableAmount = 0.02 ether;

/// @title Faucet Contract - A simple faucet contract for the safe apps workshop
/// @author Daniel Somoza - <daniel.somoza@safe.global>
contract Faucet is Ownable {
    event FoundsClaimed(address userAddress);

    mapping(address => bool) private claimants;

    modifier onlyCallOnce() {
        require(!claimants[msg.sender], "You can only claim once");
        _;
    }

    modifier hasFounds() {
        require(address(this).balance >= claimableAmount, "No founds prenset");
        _;
    }

    function claimFounds() external onlyCallOnce hasFounds {
        claimants[msg.sender] = true;
        payable(msg.sender).transfer(claimableAmount);
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    fallback() external payable {}

    receive() external payable {}
}
