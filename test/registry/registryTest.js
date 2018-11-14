const TimelockedTokenRegistry = artifacts.require("../../contracts/TimelockedTokenRegistry.sol");
const TimeLockedWallet =  artifacts.require('../../node_modules/openzeppelin-solidity/contracts/token/ERC20/TokenTimelock.sol')
const IxoERC20Token = artifacts.require('../../node_modules/ixo-solidity/contracts/token/IxoERC20Token.sol')


contract('TimeLockRegistry', ([creator, owner, minter, benificiary1, benificiary2, benificiary3]) => {

    let ixoToken;


    before(async function () {

        ixoToken = await IxoERC20Token.new();

        await ixoToken.setMinter(minter);
        await ixoToken.mint(owner, 600, {from: minter});
        console.log(`Balance for owner ${owner} = ${await ixoToken.balanceOf(owner)}`)
    });

    it("Owner can create and add timelocks for benificiaries", async () => {
       // ixoToken = await IxoERC20Token.deployed().contract;
        console.log(`deployed: ${ixoToken}`)
        //set unlock date in unix epoch to now
        let now = Math.floor((new Date).getTime() / 1000) + 2;
        let timeLockRegistry = await TimelockedTokenRegistry.new();
        console.log('0')

        timeLockRegistry.initialize(ixoToken.address)
        console.log('0')

        //create the timelock contracts


        let timeLockedWallet1 = await TimeLockedWallet.new(ixoToken.address, benificiary1, now);
        let timeLockedWallet2 = await TimeLockedWallet.new(ixoToken.address, benificiary2, now);
        await sleep(2000)

        await timeLockRegistry.addTimelock(benificiary1, timeLockedWallet1.address);
        await timeLockRegistry.addTimelock(benificiary2, timeLockedWallet2.address);

        await ixoToken.transfer(timeLockedWallet1.address, 200, {from: owner});

        await ixoToken.transfer(timeLockedWallet2.address, 200, {from: owner});

        const balance1Before = await timeLockRegistry.lockedBalance(benificiary1)
        const balance2Before = await timeLockRegistry.lockedBalance(benificiary2)

        assert(200 == balance1Before.toNumber());
        assert(200 == balance2Before.toNumber());

        await timeLockRegistry.releaseForBenificiary(benificiary1);
        await timeLockRegistry.releaseForBenificiary(benificiary2);

        const balance1After = await ixoToken.balanceOf(benificiary1);
        const balance2After = await ixoToken.balanceOf(benificiary2);
        assert(200 == balance1After.toNumber());
        assert(200 == balance2After.toNumber());

        await ixoToken.transfer(owner, 200, {from: benificiary1});
        await ixoToken.transfer(owner, 200, {from: benificiary2});

    });

    it("Owner can create new timelocks for benificiaries in Registry", async () => {
        // ixoToken = await IxoERC20Token.deployed().contract;
         //set unlock date in unix epoch to now
         let now = Math.floor((new Date).getTime() / 1000) + 2;
         let timeLockRegistry = await TimelockedTokenRegistry.new();
         console.log('0')
 
         timeLockRegistry.initialize(ixoToken.address)
         console.log('0')
 
         //create the timelock contracts 
         let timeLockedWallet1Address = await timeLockRegistry.addNewTimelock(benificiary1, now);
         let timeLockedWallet2Address = await timeLockRegistry.addNewTimelock(benificiary2, now);
 
         await ixoToken.transfer(timeLockedWallet1Address, 200, {from: owner});
         await ixoToken.transfer(timeLockedWallet2Address, 200, {from: owner});
 
         const balance1Before = await timeLockRegistry.lockedBalance(benificiary1)
         const balance2Before = await timeLockRegistry.lockedBalance(benificiary2)
 
         assert(200 == balance1Before.toNumber());
         assert(200 == balance2Before.toNumber());
         await sleep(2000)
 
         await timeLockRegistry.releaseForBenificiary(benificiary1);
         await timeLockRegistry.releaseForBenificiary(benificiary2);
 
         const balance1After = await ixoToken.balanceOf(benificiary1);
         const balance2After = await ixoToken.balanceOf(benificiary2);
         assert(200 == balance1After.toNumber());
         assert(200 == balance2After.toNumber());
 
         await ixoToken.transfer(owner, 200, {from: benificiary1});
         await ixoToken.transfer(owner, 200, {from: benificiary2});
 
     });

});

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}