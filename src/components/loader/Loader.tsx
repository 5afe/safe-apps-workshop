import { ReactNode } from "react";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";
import { useState } from "react";
import { useEffect } from "react";

const DEFAULT_TIMEOUT = 1000;

type LoaderProps = {
  isLoading?: boolean;
  children?: ReactNode;
  loadingText?: ReactNode;
  minHeight?: number;
  timeout?: number;
};

const Loader = ({
  isLoading,
  loadingText,
  minHeight,
  children,
  timeout,
}: LoaderProps) => {
  const [showContent, setShowContent] = useState(!isLoading);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        setShowContent(true);
      }, timeout || DEFAULT_TIMEOUT);
    }
  }, [isLoading, timeout]);

  return (
    <>
      <Fade in={isLoading} unmountOnExit timeout={timeout || DEFAULT_TIMEOUT}>
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          spacing={2}
          component="div"
          minHeight={minHeight}
        >
          <CircularProgress />
          <div>{loadingText}</div>
        </Stack>
      </Fade>

      {showContent && children}
    </>
  );
};

export default Loader;
