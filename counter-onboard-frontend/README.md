# Safe App using Web3 onboard

In this example we will guide you throught the important points to enable a Dapp to communicate with the Safe, assuming you are using [Web3-onboard](https://docs.blocknative.com/onboard) to handle Web3 wallets connections.

## How to start

### Adding Safe App information to the `manifest.json`

In [counter-onboard-frontend/public/manifest.json](counter-onboard-frontend/public/manifest.json) you need to add the following properties:
```
"name": "Counter App",
"description": "Update your counter!",
"iconPath": "logo512.png",
```

This information is required so the Safe is able to display the name, image and description for every Safe App, when showing it in the list or when sending a transaction.

### Running the app

From the project root use:
```
yarn start:counter-onboard
```

The page will automatically reload when you add changes to the code.

### Checking `walletContext` in detail

Search for [counter-onboard-frontend/src/store/walletContext](counter-onboard-frontend/src/store/walletContext.tsx)

You can search for `TODO [Wx.x]` to quick find specific points explanied below:

 - TODO [W1.1] - Import Safe web3-onboard module.
    - This module enables onboard.js to be configured with the Safe.
    - In this example is already installed in `package.json`. You should install it otherwise.
 - TODO [W1.2] - Enable `gnosisModule()` in web3-onboard configuration.
    - This will enable the previously imported package in onboard.js
 - TODO [W1.3] - Force Safe App connection when being inside of an iframe.
    - When accessing a Safe App there should be no other option than connecting to the Safe. We should ignore any previous connection whenever we detect this scenario and directly load the Safe connection.
 - TODO [W1.4] - Define `isSafeAppWallet` property
    - This property will be useful across our Dapp to detect whenever the connected wallet is a Safe to customize some behaviors.
    - An example for this would be to send `MultiSend` transactions to save users some gas when we need to execute more than one transaction sequentialy.