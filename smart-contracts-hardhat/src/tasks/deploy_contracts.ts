import { HardhatRuntimeEnvironment } from "hardhat/types";
import "hardhat-deploy";

import { task } from "hardhat/config";

task("deploy-contracts", "Deploy & verify contracts").setAction(
  async (_, hre: HardhatRuntimeEnvironment) => {
    await hre.run("deploy");
    await hre.run("sourcify");
    await hre.run("etherscan-verify", {
      forceLicense: true,
      license: "LGPL-3.0",
    });
  }
);
