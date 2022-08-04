// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

jest.mock("@web3-onboard/core", () => {
  return () => ({
    state: {
      select: () => {
        console.log("TODO: mock onboard");
      },
    },
  });
});

jest.mock("@web3-onboard/injected-wallets", () => {
  return () => {
    console.log("TODO: mock  injected-wallets");
  };
});

jest.mock("@web3-onboard/walletconnect", () => {
  return () => {
    console.log("TODO: mock walletconnect");
  };
});

jest.mock("@web3-onboard/gnosis", () => {
  return () => {
    console.log("TODO: mock @web3-onboard/gnosis");
  };
});
