import axios from "axios";

const FAUCET_BASE_URL = "https://faucet-backend-deploy.onrender.com";

const FAUCET_URL = `${FAUCET_BASE_URL}/api/faucet`;

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
