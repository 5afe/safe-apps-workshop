# Safe App using Safe Apps SDK

In this example we will guide you throught the important points to create a Safe App specifically for the Safe using the [Safe Apps SDK](https://github.com/safe-global/safe-apps-sdk)

## How to start

### Adding Safe App information to the `manifest.json`

In [counter-safe-app-frontend/public/manifest.json](counter-safe-app-frontend/public/manifest.json) you need to add the following properties:
```
"name": "Counter App",
"description": "Update your counter!",
"iconPath": "logo512.png",
```

This information is required so the Safe is able to display the name, image and description for every Safe App, when showing it in the list or when sending a transaction.

### Running the app

From the project root use:
```
yarn start:counter-safe-app
```

The page will automatically reload when you add changes to the code.

### Checking `walletContext` in detail

Search for [counter-safe-app-frontend/src/store/walletContext](counter-safe-app-frontend/src/store/walletContext.tsx)

You can search for `TODO [Wx.x]` to quick find specific points explanied below:

 - TODO [W2.1] - Import Safe Apps SDK module, Safe Apps provider and init Safe Apps SDK.
    - Import everything that is needed from our SDK tools.
 - TODO [W2.2] - Fetch Safe information using the SDK
 - TODO [W2.3] - Fetch chain information using the SDK
 - TODO [W2.4] - Fetch Safe balance information using the SDK
 - TODO [W2.5] - Init the web3 provider
