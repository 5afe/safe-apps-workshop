import "@nomicfoundation/hardhat-chai-matchers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";
import { expect } from "chai";
import { parseEther } from "ethers/lib/utils";

const OWNABLE_ERROR = "Ownable: caller is not the owner";
const PAUSABLE_ERROR = "Pausable: paused";
const NO_FUNDS_ERROR = "No funds available";
const CLAIM_NOT_READY_ERROR = "Claim not ready";
const CLAIM_LIMIT_REACHED_ERROR = "Claim limit reached";

// We define a fixture to reuse the same setup in every test.
async function deployFaucetFixture() {
  const [owner, otherAccount, claimantAddress] = await ethers.getSigners();

  const FaucetContract = await ethers.getContractFactory("Faucet");
  const faucetContract = await FaucetContract.deploy();
  await faucetContract.deployed();

  return {
    faucetContract,
    owner,
    claimantAddress,
    otherAccount,
  };
}

describe("Faucet Contract", () => {
  it("deploys a new faucet contract with claims paused by default", async () => {
    const { faucetContract } = await loadFixture(deployFaucetFixture);

    // claims paused by default
    expect(await faucetContract.paused()).equal(true);
  });

  describe("pausable claims", () => {
    it("contract owner can resume claims (unpause claims)", async () => {
      const { faucetContract, owner } = await loadFixture(deployFaucetFixture);

      expect(await faucetContract.paused()).equal(true);

      await faucetContract.connect(owner).unpauseClaims();

      expect(await faucetContract.paused()).equal(false);
    });

    it("contract owner can stop claims (unpause claims)", async () => {
      const { faucetContract, owner } = await loadFixture(deployFaucetFixture);

      expect(await faucetContract.paused()).equal(true);

      await faucetContract.connect(owner).unpauseClaims();

      expect(await faucetContract.paused()).equal(false);

      await faucetContract.connect(owner).pauseClaims();

      expect(await faucetContract.paused()).equal(true);
    });

    it("unpause claims reverts if its performed by other user than the contract owner", async () => {
      const { faucetContract, otherAccount } = await loadFixture(
        deployFaucetFixture
      );

      expect(await faucetContract.paused()).equal(true);

      await expect(
        faucetContract.connect(otherAccount).unpauseClaims()
      ).to.be.revertedWith(OWNABLE_ERROR);

      expect(await faucetContract.paused()).equal(true);
    });

    it("pause claims reverts if its performed by other user than the contract owner", async () => {
      const { faucetContract, owner, otherAccount } = await loadFixture(
        deployFaucetFixture
      );

      expect(await faucetContract.paused()).equal(true);

      await faucetContract.connect(owner).unpauseClaims();

      expect(await faucetContract.paused()).equal(false);

      await expect(
        faucetContract.connect(otherAccount).pauseClaims()
      ).to.be.revertedWith(OWNABLE_ERROR);

      expect(await faucetContract.paused()).equal(false);
    });
  });

  describe("withdraw faucet funds", () => {
    it("contract owner can can withdraw all contract funds", async () => {
      const { faucetContract, owner } = await loadFixture(deployFaucetFixture);

      // unpause claims
      await faucetContract.unpauseClaims();

      // we send funds to the faucet contract
      const sendFundsTransaction = {
        to: faucetContract.address,
        value: parseEther("10.0"),
      };

      await owner.sendTransaction(sendFundsTransaction);

      expect(await ethers.provider.getBalance(faucetContract.address)).to.equal(
        parseEther("10.0")
      );

      await faucetContract.withdraw();

      expect(await ethers.provider.getBalance(faucetContract.address)).to.equal(
        parseEther("0")
      );
    });

    it("withdraw contract funds reverts if its performed by other user than the contract owner", async () => {
      const { faucetContract, owner, otherAccount } = await loadFixture(
        deployFaucetFixture
      );

      // unpause claims
      await faucetContract.unpauseClaims();

      // we send funds to the faucet contract
      const sendFundsTransaction = {
        to: faucetContract.address,
        value: parseEther("10.0"),
      };

      await owner.sendTransaction(sendFundsTransaction);

      expect(await ethers.provider.getBalance(faucetContract.address)).to.equal(
        parseEther("10.0")
      );

      await expect(
        faucetContract.connect(otherAccount).withdraw()
      ).to.be.revertedWith(OWNABLE_ERROR);

      expect(await ethers.provider.getBalance(faucetContract.address)).to.equal(
        parseEther("10.0")
      );
    });
  });

  describe("claim funds", () => {
    it("claim funds to users", async () => {
      const { faucetContract, owner, claimantAddress } = await loadFixture(
        deployFaucetFixture
      );

      // unpause claims
      await faucetContract.unpauseClaims();

      // we send funds to the faucet contract
      const sendFundsTransaction = {
        to: faucetContract.address,
        value: parseEther("10.0"),
      };
      await owner.sendTransaction(sendFundsTransaction);

      // claimantAddress with initial funds
      const initialAccountBalance = await ethers.provider.getBalance(
        claimantAddress.address
      );

      await faucetContract.claimFunds(claimantAddress.address);

      expect(await ethers.provider.getBalance(faucetContract.address)).to.equal(
        parseEther("9.98")
      );

      // claimantAddress with updated funds
      expect(
        await ethers.provider.getBalance(claimantAddress.address)
      ).to.equal(initialAccountBalance.add(parseEther("0.02")));
    });

    it("claim funds reverts if its performed by other user than the contract owner", async () => {
      const { faucetContract, owner, otherAccount, claimantAddress } =
        await loadFixture(deployFaucetFixture);

      // unpause claims
      await faucetContract.unpauseClaims();

      // we send funds to the faucet contract
      const sendFundsTransaction = {
        to: faucetContract.address,
        value: parseEther("10.0"),
      };
      await owner.sendTransaction(sendFundsTransaction);

      // claimantAddress with initial funds
      const initialAccountBalance = await ethers.provider.getBalance(
        claimantAddress.address
      );

      await expect(
        faucetContract.connect(otherAccount).claimFunds(claimantAddress.address)
      ).to.be.revertedWith(OWNABLE_ERROR);

      // claimantAddress with initial funds because the claim was reverted
      expect(
        await ethers.provider.getBalance(claimantAddress.address)
      ).to.equal(initialAccountBalance);
    });

    it("claim funds reverts if claims are paused", async () => {
      const { faucetContract, claimantAddress } = await loadFixture(
        deployFaucetFixture
      );

      const initialAccountBalance = await ethers.provider.getBalance(
        claimantAddress.address
      );

      await expect(
        faucetContract.claimFunds(claimantAddress.address)
      ).to.be.revertedWith(PAUSABLE_ERROR);

      // claimantAddress with initial funds because the claim was reverted
      expect(
        await ethers.provider.getBalance(claimantAddress.address)
      ).to.equal(initialAccountBalance);
    });

    it("claim funds reverts if faucet contract has no funds are present", async () => {
      const { faucetContract, claimantAddress } = await loadFixture(
        deployFaucetFixture
      );

      // unpause claims
      await faucetContract.unpauseClaims();

      await expect(
        faucetContract.claimFunds(claimantAddress.address)
      ).to.be.revertedWith(NO_FUNDS_ERROR);
    });

    it("claim funds reverts if claim cooldown is active", async () => {
      const { faucetContract, owner, claimantAddress } = await loadFixture(
        deployFaucetFixture
      );

      // unpause claims
      await faucetContract.unpauseClaims();

      // we send funds to the faucet contract
      const sendFundsTransaction = {
        to: faucetContract.address,
        value: parseEther("10.0"),
      };
      await owner.sendTransaction(sendFundsTransaction);

      await faucetContract.claimFunds(claimantAddress.address);

      await expect(
        faucetContract.claimFunds(claimantAddress.address)
      ).to.be.revertedWith(CLAIM_NOT_READY_ERROR);
    });

    it("claim funds reverts if claimant address reaches the claim limit", async () => {
      const { faucetContract, owner, claimantAddress } = await loadFixture(
        deployFaucetFixture
      );

      // unpause claims
      await faucetContract.unpauseClaims();

      // we send funds to the faucet contract
      const sendFundsTransaction = {
        to: faucetContract.address,
        value: parseEther("10.0"),
      };
      await owner.sendTransaction(sendFundsTransaction);

      // we need to wait 2 minutes between claims to prevent the claim cooldown error
      await waitTwoMinutes();
      await faucetContract.claimFunds(claimantAddress.address);

      await waitTwoMinutes();
      await faucetContract.claimFunds(claimantAddress.address);

      await waitTwoMinutes();
      await faucetContract.claimFunds(claimantAddress.address);

      await waitTwoMinutes();
      await faucetContract.claimFunds(claimantAddress.address);

      await waitTwoMinutes();
      await faucetContract.claimFunds(claimantAddress.address);

      await waitTwoMinutes();
      await expect(
        faucetContract.claimFunds(claimantAddress.address)
      ).to.be.revertedWith(CLAIM_LIMIT_REACHED_ERROR);
    });
  });

  describe("events", () => {
    it("fires FundsClaimed event", async () => {
      const { faucetContract, owner, claimantAddress } = await loadFixture(
        deployFaucetFixture
      );

      // unpause claims
      await faucetContract.unpauseClaims();

      // we send funds to the faucet contract
      const sendFundsTransaction = {
        to: faucetContract.address,
        value: parseEther("10.0"),
      };
      await owner.sendTransaction(sendFundsTransaction);

      const mockTimestamp = Date.now() + 10_000;
      await ethers.provider.send("evm_setNextBlockTimestamp", [mockTimestamp]);

      await expect(faucetContract.claimFunds(claimantAddress.address))
        .to.emit(faucetContract, "FundsClaimed")
        .withArgs(
          claimantAddress.address, // claimantAddress
          mockTimestamp, // claimTime
          parseEther("0.02") // claimedAmount
        );
    });
  });
});

const waitTwoMinutes = async () => {
  const TWO_MINUTES = 2 * 60;
  await ethers.provider.send("evm_increaseTime", [TWO_MINUTES]);
  await ethers.provider.send("evm_mine", []);
};
