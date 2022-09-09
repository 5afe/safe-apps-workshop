# Safe App using Web3 onboard

In this example we will guide you throught the important points to create a Safe App specifically for the Safe using the [Safe Apps SDK](https://github.com/safe-global/safe-apps-sdk)

## How to start

### Running the app

From the project root use:
```
yarn start:counter-safe-app
```

### Checking `walletContext` in detail

Search for [counter-safe-app-frontend/src/store/walletContext](counter-safe-app-frontend/src/store/walletContext.tsx)

Search for the following tags to quick navigate to the specific points

TODO [W2.1] - Import Safe Apps SDK module and Safe Apps provider
TODO [W2.2] - Create a new instance of Safe Apps SDK module to allow interaction with the Safe
TODO [W2.3] - Force Safe App connection when being inside of an iframe
TODO [W2.4] - isSafeApp wallet property
TODO [W2.5] - Enable wallet icon


### Adding Safe App information to the `manifest.json`

In [counter-safe-app-frontend/public/manifest.json](counter-safe-app-frontend/public/manifest.json) you need to add the following properties:
```
"name": "Counter App",
"description": "Update your counter!",
"iconPath": "logo512.png",
```

This information is required so the Safe is able to display the name, image and description for every Safe App, when showing it in the list or when sending a transaction.