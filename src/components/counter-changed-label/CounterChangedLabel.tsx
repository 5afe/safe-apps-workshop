import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowRightAltRoundedIcon from "@mui/icons-material/ArrowRightAltRounded";
import { styled } from "@mui/material/styles";
import { LIGHT_THEME } from "src/theme/theme";

type props = {
  prevCounter: string;
  newCounter: string;
};

const CounterChangedLabel = ({ prevCounter, newCounter }: props) => {
  return (
    <Stack direction="row" alignItems="center" justifyContent="center">
      <ValueLabel>{prevCounter}</ValueLabel>
      <ArrowRightAltRoundedIcon />
      <ValueLabel>{newCounter}</ValueLabel>
    </Stack>
  );
};

export default CounterChangedLabel;

const ValueLabel = styled(Typography)(
  ({ theme }) => `
    display: inline-block;
    padding: 2px 4px;
    margin: 4px;
    background-color: ${
      theme.palette.mode === LIGHT_THEME
        ? theme.palette.grey["100"]
        : theme.palette.grey["800"]
    };
    borderRadius: 4px;
    border: 1px solid;
    border-color:  ${theme.palette.divider};
`
);
