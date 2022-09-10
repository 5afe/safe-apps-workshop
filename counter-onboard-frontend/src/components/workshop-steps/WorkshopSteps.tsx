import { useEffect, useState } from "react";
import axios from "axios";
import List from "@mui/material/List";
import CircularProgress from "@mui/material/CircularProgress";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

import { useWallet, wallets } from "src/store/walletContext";

const WorkshopSteps = () => {
  return (
    <List>
      <ManifestWorkshopStep />
      <AddAsCustomSafeAppStep />
      <InjectOnboardSafeModuleStep />
      <DisableAutoWalletSelectionStep />
    </List>
  );
};

export default WorkshopSteps;

type BaseWorkshopStepType = {
  isLoading: boolean;
  isCompleted: boolean;
  stepText: string;
  stepLink: string;
};

const BaseWorkshopStep = ({
  isLoading,
  isCompleted,
  stepText,
  stepLink,
}: BaseWorkshopStepType) => {
  return (
    <ListItem disablePadding>
      <ListItemButton component={"a"} href={stepLink} target="_blank">
        <ListItemIcon>
          {isLoading ? (
            <CircularProgress size={20} />
          ) : isCompleted ? (
            <CheckCircleOutlineOutlinedIcon color="success" />
          ) : (
            <PendingOutlinedIcon />
          )}
        </ListItemIcon>
        <ListItemText primary={stepText} />
      </ListItemButton>
    </ListItem>
  );
};

const ManifestWorkshopStep = () => {
  const [manifest, setManifest] = useState<any>();

  useEffect(() => {
    axios.get("http://localhost:3000/manifest.json").then((req) => {
      setManifest(req.data);
    });
  }, []);

  const isLoading = !manifest;

  const isManifestUpdated =
    manifest?.name && manifest?.description && manifest?.iconPath;

  return (
    <BaseWorkshopStep
      isLoading={isLoading}
      isCompleted={isManifestUpdated}
      stepText="Update Manifest"
      stepLink="https://github.com/5afe/safe-apps-workshop/tree/master/counter-onboard-frontend#checking-walletcontext-in-detail"
    />
  );
};

const AddAsCustomSafeAppStep = () => {
  const isCustomSafeApp = window.self !== window.top;

  return (
    <BaseWorkshopStep
      isLoading={false}
      isCompleted={isCustomSafeApp}
      stepText="Add Custom Safe App"
      stepLink="https://github.com/5afe/safe-apps-workshop/tree/master/counter-onboard-frontend#checking-walletcontext-in-detail"
    />
  );
};

const InjectOnboardSafeModuleStep = () => {
  const isCompleted = wallets.length === 3;

  return (
    <BaseWorkshopStep
      isLoading={false}
      isCompleted={isCompleted}
      stepText="Import Safe Module"
      stepLink="https://github.com/5afe/safe-apps-workshop/tree/master/counter-onboard-frontend#checking-walletcontext-in-detail"
    />
  );
};

const DisableAutoWalletSelectionStep = () => {
  const { wallet } = useWallet();

  const isSafeAppWallet = wallet?.label === "Gnosis Safe";

  return (
    <BaseWorkshopStep
      isLoading={false}
      isCompleted={isSafeAppWallet}
      stepText="Auto connect Safe Wallet"
      stepLink="https://github.com/5afe/safe-apps-workshop/tree/master/counter-onboard-frontend#checking-walletcontext-in-detail"
    />
  );
};
