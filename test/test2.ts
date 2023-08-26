const { expect } = require("chai");
const hre = require("hardhat");
const {
  loadFixture,
  time,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");



describe("let me die", function (){
    it("Should fail if the unlockTime is not in the future", async function () {
        // We don't use the fixture here because we want a different deployment
        const latestTime = await time.latest();
        const Lock = await hre.ethers.getContractFactory("Lock");
        const lock = await Lock.deploy(latestTime+100000,{value:1})
        const {owner,otherAccount}= hre.ethers.getSigners;
      

        await expect(lock.connect(otherAccount).withdraw).to.be.revertedWith(
            "You aren't the yes baby"
          );
      });

    }
)


describe("Lock", function () {
  async function deployOneYearLockFixture() {
    const lockedAmount = 1_000_000_000;
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

    const lock = await hre.ethers.deployContract("Lock", [unlockTime], {
      value: lockedAmount,
    });

    return { lock, unlockTime, lockedAmount };
  }

  it("Should set the right unlockTime", async function () {
    const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);

    // assert that the value is correct
    expect(await lock.unlockTime()).to.equal(unlockTime);
  });

  it("Should revert with the right error if called too soon", async function () {
    const { lock } = await loadFixture(deployOneYearLockFixture);

    await expect(lock.withdraw()).to.be.revertedWith("You can't withdraw yet");
  });

  it("Should transfer the funds to the owner", async function () {
    const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);

    await time.increaseTo(unlockTime);

    // this will throw if the transaction reverts
    await lock.withdraw();
  });

  it("Should revert with the right error if called from another account", async function () {
    const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);

    const [owner, otherAccount] = await hre.ethers.getSigners();

    // we increase the time of the chain to pass the first check
    await time.increaseTo(unlockTime);

    // We use lock.connect() to send a transaction from another account
    await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
      "You aren't the owner"
    );
  });
});