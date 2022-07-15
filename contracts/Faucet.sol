// SPDX-License-Identifier: LGPL-3.0-only

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

uint64 constant claimableAmount = 0.02 ether;
uint64 constant claimableAmountLimit = 0.1 ether;
uint64 constant claimCooldown = 1 minutes;

/// @title Faucet Contract - A simple faucet contract for the safe apps workshop
/// @author Daniel Somoza - <daniel.somoza@safe.global>
contract Faucet is Ownable, Pausable {
    event FundsClaimed(address userAddress);

    struct Claim {
        uint64 amount; // total amount claimed
        uint64 lastClaimTime; // last time claimed
    }

    mapping(address => Claim) private claims;

    modifier hasFunds() {
        require(address(this).balance >= claimableAmount, "No funds available");
        _;
    }

    modifier claimLimitNotReached() {
        require(
            claims[msg.sender].amount < claimableAmountLimit,
            "Claim limit reached"
        );
        _;
    }

    modifier isReadyToClaim() {
        require(
            claims[msg.sender].lastClaimTime + claimCooldown < block.timestamp,
            "Claim not ready"
        );
        _;
    }

    constructor() {
        _pause();
    }

    function claim()
        external
        whenNotPaused
        hasFunds
        claimLimitNotReached
        isReadyToClaim
    {
        claims[msg.sender].amount += claimableAmount;
        claims[msg.sender].lastClaimTime = uint64(block.timestamp);
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
