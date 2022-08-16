import "@nomicfoundation/hardhat-chai-matchers";
import { ethers } from "hardhat";
import { expect } from "chai";
import { parseEther } from "ethers/lib/utils";

describe("Faucet Contract", () => {
  it("creates new faucet contract paused by default", async () => {
    const FaucetContract = await ethers.getContractFactory("Faucet");
    const faucetContract = await FaucetContract.deploy();

    expect(await faucetContract.paused()).equal(true);
  });

  describe("pausable Faucet contract", () => {
    it("only faucet owner can unpause claims", async () => {
      const [owner, otherAccount] = await ethers.getSigners();
      const FaucetContract = await ethers.getContractFactory("Faucet");
      const faucetContract = await FaucetContract.deploy();

      expect(await faucetContract.paused()).equal(true);

      // only owner account can unpause claims
      await expect(
        faucetContract.connect(otherAccount).unpauseClaims()
      ).to.be.revertedWith("Ownable: caller is not the owner");

      await faucetContract.connect(owner).unpauseClaims();
      expect(await faucetContract.paused()).equal(false);
    });

    it("only faucet owner can pause claims", async () => {
      const [owner, otherAccount] = await ethers.getSigners();
      const FaucetContract = await ethers.getContractFactory("Faucet");
      const faucetContract = await FaucetContract.deploy();

      expect(await faucetContract.paused()).equal(true);

      await faucetContract.connect(owner).unpauseClaims();
      expect(await faucetContract.paused()).equal(false);

      // only owner account can pause claims
      await expect(
        faucetContract.connect(otherAccount).pauseClaims()
      ).to.be.revertedWith("Ownable: caller is not the owner");

      await faucetContract.connect(owner).pauseClaims();
      expect(await faucetContract.paused()).equal(true);
    });

    describe("withdraw all contract funds", () => {
      it("only faucet owner can withdraw contract funds", async () => {
        // TODO
        const [owner, otherAccount] = await ethers.getSigners();
        const FaucetContract = await ethers.getContractFactory("Faucet");
        const faucetContract = await FaucetContract.deploy();

        // unpause contract
        await faucetContract.unpauseClaims();

        // we send funds to the faucet contract
        const sendFundsTransaction = {
          to: faucetContract.address,
          value: parseEther("10.0"),
        };
        await owner.sendTransaction(sendFundsTransaction);

        expect(
          await ethers.provider.getBalance(faucetContract.address)
        ).to.equal(parseEther("10.0"));

        // only owner account can withdraw contract funds
        await expect(
          faucetContract.connect(otherAccount).withdraw()
        ).to.be.revertedWith("Ownable: caller is not the owner");

        await faucetContract.withdraw();

        expect(
          await ethers.provider.getBalance(faucetContract.address)
        ).to.equal(parseEther("0"));
      });
    });
  });

  describe("events", () => {
    it("fires transfer event", async () => {
      // TODO: fires transfer event
      //
      //   const [userAddress] = await ethers.getSigners();
      //   const CounterContract = await ethers.getContractFactory("Counter");
      //   const counterContract = await CounterContract.deploy();
      //   await expect(counterContract.increment())
      //     .to.emit(counterContract, "CounterChanged")
      //     .withArgs("increment", 0, 1, userAddress.address);
    });
  });
});
