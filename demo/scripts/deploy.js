const { ethers } = require("hardhat");

async function main() {
    const HealthcareSystem = await ethers.getContractFactory("HealthcareSystem");
    console.log("Deploying HealthcareSystem...");

    const healthcare = await HealthcareSystem.deploy(); // Deploy contract
    await healthcare.waitForDeployment(); // Wait for deployment

    const contractAddress = await healthcare.getAddress(); // Get deployed address

    console.log("HealthcareSystem deployed to:", contractAddress);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
