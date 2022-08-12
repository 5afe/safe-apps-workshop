import { useEffect } from "react";

const DEFAULT_POLLING_TIME = 6000;

const usePolling = (
  asynCallback: () => Promise<any>,
  pollingTime: number = DEFAULT_POLLING_TIME
) => {
  useEffect(() => {
    asynCallback();

    const intervalId = setInterval(() => {
      asynCallback();
    }, pollingTime);

    return () => {
      clearInterval(intervalId);
    };
  }, [asynCallback, pollingTime]);
};

export default usePolling;
