// SPDX-License-Identifier: LGPL-3.0-only

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

uint256 constant claimableAmount = 0.02 ether;

/// @title Faucet Contract - A simple faucet contract for the safe apps workshop
/// @author Daniel Somoza - <daniel.somoza@safe.global>
contract Faucet is Ownable, Pausable {
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

    constructor() {
        _pause();
    }

    function claimFounds() external whenNotPaused onlyCallOnce hasFounds {
        claimants[msg.sender] = true;
        payable(msg.sender).transfer(claimableAmount);
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function pauseClaims() external onlyOwner {
        _pause();
    }

    function unpauseClaims() external onlyOwner {
        _unpause();
    }

    fallback() external payable {}

    receive() external payable {}
}
