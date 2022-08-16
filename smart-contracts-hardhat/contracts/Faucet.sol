// SPDX-License-Identifier: LGPL-3.0-only

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

uint64 constant CLAIMABLE_AMOUNT = 0.02 ether;
uint64 constant CLAIMABLE_AMOUNT_LIMIT = 0.1 ether;
uint64 constant CLAIM_COOLDOWN = 1 minutes;

/// @title Faucet Contract - A simple faucet contract for the safe apps workshop
/// @author Daniel Somoza - <daniel.somoza@safe.global>
contract Faucet is Ownable, Pausable {
    event FundsClaimed(
        address indexed claimantAddress,
        uint64 claimTime,
        uint64 claimedAmount
    );

    struct Claim {
        uint64 amount; // total amount claimed
        uint64 lastClaimTime; // last time claimed
    }

    mapping(address => Claim) private claims;

    modifier hasFunds() {
        require(
            address(this).balance >= CLAIMABLE_AMOUNT,
            "No funds available"
        );
        _;
    }

    modifier claimLimitNotReached(address claimantAddress) {
        require(
            claims[claimantAddress].amount < CLAIMABLE_AMOUNT_LIMIT,
            "Claim limit reached"
        );
        _;
    }

    modifier isReadyToClaim(address claimantAddress) {
        require(
            claims[claimantAddress].lastClaimTime + CLAIM_COOLDOWN <
                block.timestamp,
            "Claim not ready"
        );
        _;
    }

    constructor() {
        _pause();
    }

    function claimFunds(address claimantAddress)
        external
        onlyOwner
        whenNotPaused
        hasFunds
        claimLimitNotReached(claimantAddress)
        isReadyToClaim(claimantAddress)
    {
        uint64 _lastClaimTime = uint64(block.timestamp);

        // see https://github.com/ConsenSys/smart-contract-best-practices/blob/master/docs/attacks/reentrancy.md
        claims[claimantAddress].amount += CLAIMABLE_AMOUNT;
        claims[claimantAddress].lastClaimTime = _lastClaimTime;

        // to transfer funds we use call() because transfer() and send() should be avoided
        // see more details here: https://github.com/ConsenSys/smart-contract-best-practices/blob/master/docs/development-recommendations/general/external-calls.md#dont-use-transfer-or-send
        (bool success, ) = claimantAddress.call{value: CLAIMABLE_AMOUNT}("");

        require(success, "Transfer funds failed");

        emit FundsClaimed(claimantAddress, _lastClaimTime, CLAIMABLE_AMOUNT);
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
