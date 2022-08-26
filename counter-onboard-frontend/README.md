# Safe App using Web3 onboard

In this example we will guide you throught the important points to enable a Dapp to communicate with the Safe, assuming you are using [Web3-onboard](https://docs.blocknative.com/onboard to handle Web3 wallets connections.

## How to start

### Running the app

From the project root use:
```
yarn start:counter-onboard
```

You will see some errors in the console and the app won't be loading. This is meant to be like this. Let's continue the guide.

### Checking `walletContext` in detail

Search for [counter-onboard-frontend/src/store/walletContext](counter-onboard-frontend/src/store/walletContext.tsx)


### Adding Safe App information to the `manifest.json`

In [counter-onboard-frontend/public/manifest.json](counter-onboard-frontend/public/manifest.json) you need to add the following properties:
```
"name": "Counter App",
"description": "Update your counter!",
"iconPath": "logo512.png",
```

This information is required so the Safe is able to display the name, image and description for every Safe App, when showing it in the list or when sending a transaction.