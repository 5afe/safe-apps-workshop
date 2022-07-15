require("dotenv").config();
require("hardhat-deploy");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

// tasks
require("./src/hardhat/tasks/deploy_contracts");

const { ETHERSCAN_API_KEY, INFURA_KEY, PRIVATE_KEY } = process.env;

const hardhatConfig = {
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        runs: 1,
        enabled: true,
      },
    },
  },

  networks: {
    hardhat: {},
    localhost: {},
    rinkeby: {
      accounts: [`0x${PRIVATE_KEY}`],
      url: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
    },
    xdai: {
      accounts: [`0x${PRIVATE_KEY}`],
      url: "https://rpc.gnosischain.com",
    },
  },

  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },

  paths: {
    sources: "./contracts",
    tests: "./src/test",
    cache: "./src/cache",
    artifacts: "./src/artifacts",
    deploy: "./src/hardhat/deploy",
  },

  namedAccounts: {
    deployer: 0,
  },

  defaultNetwork: "rinkeby",
};

module.exports = hardhatConfig;
