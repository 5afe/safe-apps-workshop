import axios from "axios";

const { REACT_APP_FAUCET_BACKEND_URL } = process.env;

const FAUCET_URL = `${REACT_APP_FAUCET_BACKEND_URL}/api/faucet`;

const requestFunds = async (body: any) => {
  try {
    return await axios.post(FAUCET_URL, body);
  } catch (error: any) {
    return Promise.reject(error.response.data.error || "request founds request failed");
  }
};

export default requestFunds;
