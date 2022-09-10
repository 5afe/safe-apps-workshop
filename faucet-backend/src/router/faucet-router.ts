import express from "express";

import faucetController from "../controllers/faucet-controller";

const FAUCET_PATHNAME = "/api/faucet";

const faucetRouter = express.Router();

faucetRouter.post(FAUCET_PATHNAME, faucetController);

export default faucetRouter;
