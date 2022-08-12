import axios from "axios";

const { REACT_APP_FAUCET_BACKEND_URL } = process.env;

const FAUCET_URL = `${REACT_APP_FAUCET_BACKEND_URL}/api/faucet`;

type requestPayload = {
  address: string;
  chainId: string;
};

const requestFunds = async (body: requestPayload) => {
  try {
    const response = await axios.post(FAUCET_URL, body);

    return response.data;
  } catch (error: any) {
    return Promise.reject(
      error.response.data.error || "claim funds request failed"
    );
  }
};

export default requestFunds;
