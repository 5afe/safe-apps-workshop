import Stack, { StackProps } from "@mui/material/Stack";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { styled } from "@mui/material/styles";

const InvalidChainLabel = () => {
  return (
    <Container
      direction="row"
      alignItems="center"
      spacing={0.5}
      component="span"
    >
      <WarningAmberRoundedIcon color="warning" />
      <span>Invalid Chain</span>
    </Container>
  );
};

export default InvalidChainLabel;

type ContainerPros = {
  component: string;
} & StackProps;

const Container = styled((props: ContainerPros) => <Stack {...props} />)(
  ({ theme }) => `
    
    margin-right: 8px;
    border-radius: 4px;
    padding: 6px 16px;
  
    background-color: ${theme.palette.error.dark};
  
    color: ${theme.palette.getContrastText(theme.palette.error.dark)};
    `
);
