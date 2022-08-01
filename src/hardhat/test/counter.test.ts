import "@nomicfoundation/hardhat-chai-matchers";
import { ethers } from "hardhat";
import { expect } from "chai";

describe("Counter Contract", () => {
  it("creates new counter contract with 0 as initial value", async () => {
    const CounterContract = await ethers.getContractFactory("Counter");
    const counterContract = await CounterContract.deploy();

    expect((await counterContract.getCounter()).toNumber()).equal(0);
  });

  it("increments user counter", async () => {
    const CounterContract = await ethers.getContractFactory("Counter");
    const counterContract = await CounterContract.deploy();

    expect((await counterContract.getCounter()).toNumber()).equal(0);

    await counterContract.increment();

    expect((await counterContract.getCounter()).toNumber()).equal(1);
  });

  it("decrements user counter", async () => {
    const CounterContract = await ethers.getContractFactory("Counter");
    const counterContract = await CounterContract.deploy();

    expect((await counterContract.getCounter()).toNumber()).equal(0);

    // we decrement owner counter value
    await counterContract.decrement();

    expect((await counterContract.getCounter()).toNumber()).equal(-1);
  });

  it("resets user counter", async () => {
    const CounterContract = await ethers.getContractFactory("Counter");
    const counterContract = await CounterContract.deploy();

    expect((await counterContract.getCounter()).toNumber()).equal(0);

    // we increment owner counter value 3 times
    await counterContract.increment();
    await counterContract.increment();
    await counterContract.increment();

    expect((await counterContract.getCounter()).toNumber()).equal(3);
  });

  it("sets user counter", async () => {
    const CounterContract = await ethers.getContractFactory("Counter");
    const counterContract = await CounterContract.deploy();

    expect((await counterContract.getCounter()).toNumber()).equal(0);

    // we set the user counter to 5
    await counterContract.setCounter(5);

    expect((await counterContract.getCounter()).toNumber()).equal(5);
  });

  it("updates the correct user counter", async () => {
    const [, otherAddress] = await ethers.getSigners();

    const CounterContract = await ethers.getContractFactory("Counter");
    const counterContract = await CounterContract.deploy();

    expect((await counterContract.getCounter()).toNumber()).equal(0);

    expect(
      (await counterContract.connect(otherAddress).getCounter()).toNumber()
    ).equal(0);

    // we update the owner counter value
    await counterContract.setCounter(5);

    expect((await counterContract.getCounter()).toNumber()).equal(5);
    expect(
      (await counterContract.connect(otherAddress).getCounter()).toNumber()
    ).equal(0);

    // we update the other account counter
    await counterContract.connect(otherAddress).setCounter(-3);

    expect((await counterContract.getCounter()).toNumber()).equal(5);
    expect(
      (await counterContract.connect(otherAddress).getCounter()).toNumber()
    ).equal(-3);
  });

  describe("events", () => {
    it("fires increment event", async () => {
      const [userAddress] = await ethers.getSigners();

      const CounterContract = await ethers.getContractFactory("Counter");
      const counterContract = await CounterContract.deploy();

      await expect(counterContract.increment())
        .to.emit(counterContract, "CounterChanged")
        .withArgs("increment", 0, 1, userAddress.address);
    });

    it("fires decrement event", async () => {
      const [userAddress] = await ethers.getSigners();

      const CounterContract = await ethers.getContractFactory("Counter");
      const counterContract = await CounterContract.deploy();

      await expect(counterContract.decrement())
        .to.emit(counterContract, "CounterChanged")
        .withArgs("decrement", 0, -1, userAddress.address);
    });

    it("fires reset event", async () => {
      const [userAddress] = await ethers.getSigners();

      const CounterContract = await ethers.getContractFactory("Counter");
      const counterContract = await CounterContract.deploy();

      await expect(counterContract.reset())
        .to.emit(counterContract, "CounterChanged")
        .withArgs("reset", 0, 0, userAddress.address);
    });

    it("fires setCounter event", async () => {
      const [userAddress] = await ethers.getSigners();

      const CounterContract = await ethers.getContractFactory("Counter");
      const counterContract = await CounterContract.deploy();

      await expect(counterContract.setCounter(7))
        .to.emit(counterContract, "CounterChanged")
        .withArgs("setCounter", 0, 7, userAddress.address);
    });
  });
});
