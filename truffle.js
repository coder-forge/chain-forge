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
      from: "0x002d0d226Ec5d5926Cd0ddA186A055f6975b84b6"
    },
    "infura": {
      network_id: 2,
      host: "https://ropsten.infura.io/RozQs0Bj08iLTyFhwjVu",
    },
    "staging": {
      network_id: 1337 // custom private network
      // use default rpc settings
    }
  }
}
