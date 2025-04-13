require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Load environment variables from .env

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL, // Use an environment variable for security
      accounts: [process.env.PRIVATE_KEY], // Use a private key from .env file
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY, // Add Etherscan API key
    },
  },
};
