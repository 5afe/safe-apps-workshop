import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CircularProgress from "@mui/material/CircularProgress";
import { CounterEventsStatus } from "src/store/counterContext";

type StatusLabelProps = {
  status: CounterEventsStatus;
};

const StatusLabel = ({ status }: StatusLabelProps) => {
  return status === "completed" ? (
    <CheckCircleRoundedIcon color="success" />
  ) : (
    <CircularProgress size={24} />
  );
};

export default StatusLabel;
