import { ReactNode } from "react";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Variant } from "@mui/material/styles/createTypography";

type CounterEventLabelProps = {
  eventType: string;
};

const CounterEventLabel = ({ eventType }: CounterEventLabelProps) => {
  return (
    <EventLabel component="span" variant={"body2"} eventType={eventType}>
      {eventType}
    </EventLabel>
  );
};

export default CounterEventLabel;

const labelColors: Record<string, string> = {
  increment: "#268226",
  reset: "#be2a2a",
  decrement: "#cc8400",
  setCounter: "#2a75f1",
};

type EventLabelProps = {
  eventType: string;
  component: string;
  variant: Variant;
  children: ReactNode;
};

const EventLabel = styled(
  ({ eventType, children, ...props }: EventLabelProps) => (
    <Typography {...props}>{children}</Typography>
  )
)(
  ({ theme, eventType }) => `
    padding: 4px 8px;
    border-radius: 4px;

    text-transform: capitalize;

    background-color: ${labelColors[eventType]};

    color: ${theme.palette.getContrastText(labelColors[eventType])}
    `
);
