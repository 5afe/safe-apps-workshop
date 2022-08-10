import dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

const {
  FAUCET_CONTRACT_ADDRESS_RINKEBY,
  FAUCET_CONTRACT_ADDRESS_GNOSIS_CHAIN,
  INFURA_TOKEN,
  PRIVATE_KEY,
} = process.env;

async function claimFunds(
  address: string,
  chainId: number
): Promise<{ transaction: string }> {
  const faucetContract = getFaucetContract(chainId);

  try {
    const transaction = await faucetContract.claimFunds(address, {
      // gasLimit: 70000,
      // TODO: check nonce ????
      // nonce: nonce || undefined,
    });

    return {
      transaction: transaction.hash,
    };
  } catch (error: any) {
    throw new Error(parseError(error, chainId));
  }
}

const faucetRepository = { claimFunds };

export default faucetRepository;

/**
 * Parses a Faucet contract error to string.
 *
 * @param {any} error the error.
 * @param {number} chainId the chainId.
 * @return {string} The parsed error to string.
 */
function parseError(error: any, chainId: number): string {
  if (chainId === rinkebyChainId) {
    const [, errorLabel] = error.error.reason.split("execution reverted:");
    return errorLabel;
  }

  if (chainId === gnosisChainId) {
    const gnosisError = JSON.parse(error.error.body);

    const [, hexError] = gnosisError.error.message.split("0x");

    return hexToString(hexError);
  }

  return "unknown error";
}

/**
 * Parse a hexadecimal string value to UTF-8.
 *
 * @param {string} message The message in hexadecimal format.
 * @return {string} The parsed UTF-8 string.
 */
const hexToString = (message: string): string => {
  return Buffer.from(message, "hex").toString("utf8");
};

// cache with all chain Contract instances
const contracts: Record<number, ethers.Contract> = {};

/**
 * Returns the Faucet contract instance in the given chain
 *
 * @param {number} chainId The faucet contract chainId.
 * @return {ethers.Contract} The Faucet contract.
 */
const getFaucetContract = (chainId: number): ethers.Contract => {
  contracts[chainId] = contracts[chainId] || initializeFaucetContract(chainId);

  return contracts[chainId];
};

/**
 * Initialize the Faucet contract instance in the given chain
 *
 * @param {number} chainId The faucet contract chainId.
 * @return {ethers.Contract} The Faucet contract initialized.
 */
const initializeFaucetContract = (chainId: number): ethers.Contract => {
  const chain = chains.find((chain) => Number(chain.id) === chainId);

  const provider = new ethers.providers.JsonRpcProvider(chain?.rpcUrl);

  const wallet = new ethers.Wallet(PRIVATE_KEY as string, provider);

  const faucetAddress = faucetAddresses[chainId] as string;

  const faucetContract = new ethers.Contract(faucetAddress, faucetAbi, wallet);

  return faucetContract;
};

const faucetAbi = ["function claimFunds(address userAddress)"];

const rinkebyChainId = 4;
const gnosisChainId = 100;

const faucetAddresses: Record<number, string | undefined> = {
  [rinkebyChainId]: FAUCET_CONTRACT_ADDRESS_RINKEBY,
  [gnosisChainId]: FAUCET_CONTRACT_ADDRESS_GNOSIS_CHAIN,
};

const rinkebyChain: Chain = {
  id: rinkebyChainId,
  rpcUrl: `https://rinkeby.infura.io/v3/${INFURA_TOKEN}`,
};

const gnosisChain: Chain = {
  id: gnosisChainId,
  rpcUrl: "https://rpc.gnosischain.com",
};

const chains = [rinkebyChain, gnosisChain];

type Chain = {
  id: number;
  rpcUrl: string;
};
