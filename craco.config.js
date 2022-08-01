const { ProvidePlugin } = require("webpack");

module.exports = {
  webpack: {
    alias: {
      assert: "assert",
      buffer: "buffer",
      crypto: "crypto-browserify",
      http: "stream-http",
      https: "https-browserify",
      os: "os-browserify/browser",
      process: "process/browser",
      stream: "stream-browserify",
      util: "util",
    },
    plugins: {
      add: [
        new ProvidePlugin({
          process: "process/browser",
          Buffer: ["buffer", "Buffer"],
        }),
      ],
    },
  },
};
