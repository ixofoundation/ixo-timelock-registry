'use strict';
var infura_apikey = "109382c3b8ed4f2cbab2f0d5cceb629a";
var HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  networks: {
    local: {
      host: 'localhost',
      port: 9545,
      gas: 5000000,
      gasPrice: 5e9,
      network_id: '*'
    },
    private: {
        host: 'localhost',
        port: 9545,
        gas: 7000000,   // <--- Twice as much
        gasPrice: 10000000000,
        network_id: '*'
    },
    ropsten: {
        provider: function() {
            return new HDWalletProvider("5E983B14D48F5DB5927018A269D515FA13777B8DC120262FE315498F2CC643D1", "https://ropsten.infura.io/"+infura_apikey)
        },

        network_id: 3,
        gas: 7000000,   // <--- Twice as much
        gasPrice: 10000000000,
    },
    mainnet: {
        provider: function() {
            return new HDWalletProvider("5E983B14D48F5DB5927018A269D515FA13777B8DC120262FE315498F2CC643D1", "https://mainnet.infura.io/"+infura_apikey)
        },

        network_id: 3,
        gas: 7000000,   // <--- Twice as much
        gasPrice: 10000000000,
    }
  },
  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions : {
      currency: 'CHF',
      gasPrice: 21
    }
  }
};