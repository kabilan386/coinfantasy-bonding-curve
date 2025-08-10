const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleCurveToken", function () {
  let Token, token, owner, buyer;

  beforeEach(async function () {
    [owner, buyer] = await ethers.getSigners();

    Token = await ethers.getContractFactory("SimpleCurveToken");
    token = await Token.deploy(
      "SimpleCurveToken",
      "SCT",
      ethers.parseEther("1000"),    // initial supply
      ethers.parseEther("0.001"),   // base price
      ethers.parseEther("0.000001") // slope
    );
    await token.waitForDeployment();
  });

  it("Should deploy with correct initial supply", async function () {
    const bal = await token.balanceOf(owner.address);
    expect(bal).to.equal(ethers.parseEther("1000"));
  });

  it("Should buy tokens", async function () {
    await token.connect(buyer).buy({ value: ethers.parseEther("0.01") });
    const bal = await token.balanceOf(buyer.address);
    console.log(await ethers.provider.getBalance(token.getAddress()));
    expect(bal).to.be.gt(0);
  });

  it("Should sell tokens", async function () {
    // First buy
    await token.connect(buyer).buy({ value: ethers.parseEther("0.01") });
    const balBefore = await ethers.provider.getBalance(buyer.address);
    console.log("balance", await ethers.provider.getBalance(token.getAddress()));
    
    // Then sell all
    const tokenBal = await token.balanceOf(buyer.address);
    await token.connect(buyer).sell(toSell);

    const balAfter = await ethers.provider.getBalance(buyer.address);
    expect(balAfter).to.be.gt(balBefore);
  });
});
