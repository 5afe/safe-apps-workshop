import { useCallback, useState } from "react";

const useMultiOnClickPrevention = () => {
  const [disabled, setDisabled] = useState(false);

  const preventMultiOnClick = useCallback(
    (asynCallback: () => Promise<any>) => {
      return async () => {
        setDisabled(true);
        if (!disabled) {
          try {
            await asynCallback();
          } finally {
            setDisabled(false);
          }
        }
      };
    },
    [disabled]
  );

  return {
    disabled,
    preventMultiOnClick,
  };
};

export default useMultiOnClickPrevention;
