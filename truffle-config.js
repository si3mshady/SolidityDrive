const HDWalletProvider = require('truffle-hdwallet-provider')

require('dotenv').config();

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*" // Match any network id
    },
   
    rinkeby: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC,
        "https://rinkeby.infura.io/v3/" + process.env.INFURA_API_KEY),
        network_id: 5
    },
    ropsten: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC,
        "https://ropsten.infura.io/v3/" + process.env.INFURA_API_KEY_ROPSTEN),
        network_id: 3
    }

  }
};
