import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { LIGHT_THEME } from "src/theme/theme";

type CounterLabelProps = {
  counter: string;
};

const CounterLabel = ({ counter }: CounterLabelProps) => {
  return (
    <Container>
      <Typography variant="h2" component="span">
        {counter}
      </Typography>
    </Container>
  );
};

export default CounterLabel;

const Container = styled("div")(
  ({ theme }) => `
    
    display: inline-block;
    padding: 8px 16px;
    margin: 16px;
    border-radius: 4px;
    border: 1px solid;
    border-color: ${theme.palette.divider};
  
  
    background-color: ${
      theme.palette.mode === LIGHT_THEME
        ? theme.palette.grey["100"]
        : theme.palette.grey["800"]
    };
  
    color: ${theme.palette.getContrastText(theme.palette.background.paper)};
    
    `
);
