# Safe Apps Workshop

Welcome to the Safe Apps Workshop monorepo. In this repository you will find some resources to showcase step by step how to integrate a Dapp with the Safe. Even if you are creating a new application or adapting an existing one you will be able to check here some examples explaining the key points.

| Project                   | Description                                                                                                                            |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| counter-onboard-frontend  | Simple Counter Dapp implemented with [React](https://reactjs.org/) & [Web3-onboard](https://docs.blocknative.com/onboard)              |
| counter-safe-app-frontend | Simple Counter Safe App implemented with [React](https://reactjs.org/) & [Safe Apps SDK](https://github.com/safe-global/safe-apps-sdk) |
| faucet-backend            | Simple Faucet backend                                                                                                                  |
| smart-contracts-hardhat   | Hardhat Project with the Counter & Faucet contracts                                                                                    |

## Setting up the environment

To use this repository we are assuming that you have `git`, `node` and [yarn](https://yarnpkg.com) already installed.
Install project dependencies using:
```
yarn install
```

## Tutorial guide

It is expected that `counter-onboard-frontend` and `counter-safe-app-frontend` are not working out of the box. To make them work you should follow instructions from [counter-onboard-frontend](counter-onboard-frontend/README.md) or [counter-safe-app-frontend](counter-safe-app-frontend/README.md).
We recommend you getting a quick look to the [available scripts](#available-scripts) before starting with any of the guides.

## Available Scripts

To run the different projects you can use the following commands in the root directory:

### `start:counter-onboard`

Runs the Counter Dapp using [Web3-onboard](https://docs.blocknative.com/onboard). In the first part of the workshop we will use the [Web3-onboard Safe Module](https://docs.blocknative.com/onboard/gnosis) to use this Dapp as a Safe App \

After run the start script, open [http://localhost:3000](http://localhost:3000) to view it in the browser.
The page will reload if you make edits.\
You will also see any lint errors in the console.

### `start:counter-safe-app`

Runs the Counter Safe App using [Safe Apps SDK](https://github.com/safe-global/safe-apps-sdk).

After run the start script, open [http://localhost:3000](http://localhost:3000) to view it in the browser.
The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner.

### `yarn test:coverage`

Generates the test coverage report.

### `yarn contract:deploy <network>`

You can deploy your own Counter and Faucet contracts

### `start:faucet`

Runs the Faucet backend in development mode

### `start:faucet:prod`

Runs the Faucet backend in production mode
