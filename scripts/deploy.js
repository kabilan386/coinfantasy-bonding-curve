const hre = require("hardhat");

async function main() {
    const Token = await hre.ethers.getContractFactory("SimpleCurveToken");

    name = "SimpleCurveToken",
    symbol = "SCT",
    initialSupply = ethers.parseEther("1000"),    // initial supply
    basePrice = ethers.parseEther("0.001"),   // base price
    slope = ethers.parseEther("0.000001")

    const token = await Token.deploy(name, symbol, initialSupply, basePrice, slope);
    await token.waitForDeployment();
    const addr = await token.getAddress();
    console.log("Deployed at:", addr);

    // Wait a few blocks so Etherscan has the bytecode
    //   await hre.run("verify:verify", {
    //     address: addr,
    //     constructorArguments: [name, symbol, initialSupply, basePrice, slope],
    //   });
}

main().catch((e) => { console.error(e); process.exit(1); });
