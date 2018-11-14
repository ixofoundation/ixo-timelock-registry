var TimelockRegistry = artifacts.require("TimelockedTokenRegistry");
var SafeMath = artifacts.require("openzeppelin-solidity/contracts/math/SafeMath");
var IxoERC20Token = artifacts.require("ixo-solidity/contracts/token/IxoERC20Token");


module.exports = function(deployer) {
  //deployer.deploy(TimelockRegistry);
  deployer.deploy(SafeMath);
  deployer.link(SafeMath, TimelockRegistry);
  deployer.link(SafeMath, IxoERC20Token);

  // set the deployed instance of IxoERC20Token in constructor of the ProjectWalletRegistry
  deployer.deploy(IxoERC20Token).then( () => {
    return deployer.deploy(TimelockRegistry).then(async () => {
        try{
            const timelockRegistry = await TimelockRegistry.deployed();
            const ixoERC20Token = await IxoERC20Token.deployed();
             return timelockRegistry.initialize(ixoERC20Token.address).then(() => {
                console.log('Initialized');
                return;
             }).catch(console.error); 
        }catch (err){
            console.err(err);
        }
    }).catch(console.error); 
  }).catch(console.error);

};