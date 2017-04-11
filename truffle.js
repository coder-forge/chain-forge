module.exports = {
  networks: {
    "development": {
      host: 'localhost',
      port: 8545,
      network_id: '*' // Match any network id
    },
    "live": {
      network_id: 1, // Ethereum public network
      // optional config values
      // host - defaults to "localhost"
      // port - defaults to 8545
      // gas
      // gasPrice
      // from - default address to use for any transaction Truffle makes during migrations
    },
    "morden": {
      network_id: 2,        // Official Ethereum test network
      host: "localhost", // Random IP for example purposes (do not use)
      port: 8545
    },
    "ropsten": {
      network_id: 3,        // Official Ethereum test network
      host: "localhost", // Random IP for example purposes (do not use)
      port: 8545,
      from: ""
    },
    "staging": {
      network_id: 1337 // custom private network
      // use default rpc settings
    }
  }
}
