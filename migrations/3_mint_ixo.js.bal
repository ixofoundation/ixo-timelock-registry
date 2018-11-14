
var IxoERC20Token = artifacts.require("../node_modules/ixo-solidity/contracts/token/IxoERC20Token.sol");

module.exports = function (deployer, network, accounts) {
  switch (network) {
  case 'ganache':
    mintIxoToken(accounts);
    break;
  default:
    throw new Error('No minting function defined for this network');
  }
};
async function mintIxoToken (accounts) {
  const ixoERC20Token = await IxoERC20Token.deployed();
  ixoERC20Token.setMinter(accounts[0]);
  ixoERC20Token.mint(accounts[0], 100000000000);
  ixoERC20Token.transfer(accounts[2], 100000000000);
  console.log(`Minted ${100000000000/100000000} ixo tokens from contract ${IxoERC20Token.address} to Ganache account ${accounts[2]}`);
}