require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

module.exports = {
  solidity: "0.8.0",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/LaT4enFDSl8A6KN8bLISlPeSPE2S65T_`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    // Add other networks if needed
  },
  etherscan: {
    apiKey: 'FS53Q9WS82ZHT3GXH2MQXM7TYX8EKQAMMP',
  },
};
