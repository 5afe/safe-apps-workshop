# Safe Apps Workshop

Safe Apps workshop monorepo.

| Project                        | Description                                                                                                                            |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| counter-onboard-frontend       | Simple Counter Dapp implemented with [React](https://reactjs.org/) & [Web3-onboard](https://docs.blocknative.com/onboard)              |
| counter-safe-app-only-frontend | Simple Counter Safe App implemented with [React](https://reactjs.org/) & [Safe Apps SDK](https://github.com/safe-global/safe-apps-sdk) |
| faucet-backend                 | Simple Faucet backend                                                                                                                  |
| smart-contracts-hardhat        | Hardhat Project with the Counter & Faucet contracts                                                                                    |

## Available Scripts

In the project root directory, you can run:

### `start:counter-onboard`

Runs the Counter Dapp using [Web3-onboard](https://docs.blocknative.com/onboard). In the first part of the workshop we will use the [Web3-onboard Safe Module](https://docs.blocknative.com/onboard/gnosis) to use this Dapp as a Safe App \

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
