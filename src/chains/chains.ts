import Chain from "src/models/chain";

const { REACT_APP_INFURA_TOKEN } = process.env;

export const rinkebyChain: Chain = {
  id: "0x4",
  token: "rETH",
  label: "Rinkeby",
  rpcUrl: `https://rinkeby.infura.io/v3/${REACT_APP_INFURA_TOKEN}`,
  blockExplorerUrl: "https://rinkeby.etherscan.io",
  color: "#e8673c",
};

export const gnosisChain: Chain = {
  id: "0x64",
  token: "xDai",
  label: "Gnosis Chain",
  rpcUrl: "https://rpc.gnosischain.com",
  blockExplorerUrl: "https://blockscout.com/xdai/mainnet",
  color: "#3e6957",
};

// TODO: add support to other chains ?

// TODO: add Goerli testnet

const chains: Chain[] = [rinkebyChain, gnosisChain];

export const initialChain = rinkebyChain;

export default chains;
