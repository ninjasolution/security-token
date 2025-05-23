require("@nomicfoundation/hardhat-toolbox");
require("@onmychain/hardhat-uniswap-v2-deploy-plugin");
// Any file that has require('dotenv').config() statement 
// will automatically load any variables in the root's .env file.
require('dotenv').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY
const etherscanKey = process.env.ETHERSCAN_KEY
const infraKey = process.env.INFRA_KEY

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    mainnet: {
      url: `https://bsc-dataseed1.ninicoin.io`,
      accounts: [PRIVATE_KEY],
      //gasPrice: 120 * 1000000000,
      chainId: 1,
    },
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: [PRIVATE_KEY]
    },
    hardhat: {
      
    },
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: [PRIVATE_KEY]
    },
    testbnb: {
      url: `https://data-seed-prebsc-1-s1.binance.org:8545/`,
      accounts: [PRIVATE_KEY]
    },
    testmatic: {
      url: `https://rpc-mumbai.maticvigil.com`,
      accounts: [PRIVATE_KEY]
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/-hba0sbFIuYmoTG2WmZDby52IY90I5pb`,
      accounts: [PRIVATE_KEY],
      chainId: 11155111
    },
    localhost: {
      live: false,
      saveDeployments: true,
      tags: ["local"],
    },
  },
  solidity: {
    // version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    },
    compilers: [
      {
        version: "0.8.9",
      },
      {
        version: "0.8.0",
      },]
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 4000000000
  },
  etherscan: {
    apiKey: etherscanKey,
  },
}