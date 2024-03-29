import { config } from "dotenv";
import { HardhatUserConfig } from "hardhat/types";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";

// tasks
import "./src/tasks/deploy_contracts";

config();
const { ETHERSCAN_API_KEY, INFURA_TOKEN, PRIVATE_KEY } = process.env;

const hardhatConfig: HardhatUserConfig = {
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
      url: `https://rinkeby.infura.io/v3/${INFURA_TOKEN}`,
    },
    xdai: {
      accounts: [`0x${PRIVATE_KEY}`],
      url: "https://rpc.gnosischain.com",
    },
    goerli: {
      accounts: [`0x${PRIVATE_KEY}`],
      url: `https://goerli.infura.io/v3/${INFURA_TOKEN}`,
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
    deploy: "./src/deploy",
  },

  namedAccounts: {
    deployer: 0,
  },

  defaultNetwork: "hardhat",
};

export default hardhatConfig;
