const IxoERC20Token = artifacts.require('../../node_modules/ixo-solidity/contracts/token/IxoERC20Token.sol')
const IERC20 =  artifacts.require('../../node_modules/openzeppelin-solidity/contracts/token/ERC20/IERC20.sol')
const TimeLockedWallet =  artifacts.require('../../node_modules/openzeppelin-solidity/contracts/token/ERC20/TokenTimelock.sol')




contract('TimeLockedWallets', ([_, owner, minter, benificiary1, benificiary2, benificiary3]) => {

    let ixoToken;
    
    before(async function () {

        ixoToken = await IxoERC20Token.new();
        await ixoToken.setMinter(minter);
        await ixoToken.mint(owner, 800, {from: minter});
        console.log(`Balance for owner ${owner} = ${await ixoToken.balanceOf(owner)}`)
    });

    it("Owner can create timelock for benificiaries", async () => {
        //set unlock date in unix epoch to now
        // ixoToken = await IxoERC20Token.deployed();
        let now = Math.floor((new Date).getTime() / 1000) + 1;
        //create the timelock contracts

        let timeLockedWallet1 = await TimeLockedWallet.new(ixoToken.address, benificiary1, now);
        let timeLockedWallet2 = await TimeLockedWallet.new(ixoToken.address, benificiary2, now);
        await sleep(2000)
        //transfer the tokens to the timelocks
        console.log('1')
        await ixoToken.transfer(timeLockedWallet1.address, 200, {from: owner});
        await ixoToken.transfer(timeLockedWallet2.address, 200, {from: owner});
        console.log('2')

        assert(200 == await ixoToken.balanceOf(timeLockedWallet1.address));
        assert(200 == await ixoToken.balanceOf(timeLockedWallet2.address));
        console.log('3')

        await timeLockedWallet1.release({from: owner});
        console.log('3')

        await timeLockedWallet2.release({from: owner});
        console.log('4')

        const balance1 = await ixoToken.balanceOf(benificiary1);
        const balance2 = await ixoToken.balanceOf(benificiary2);
        assert(200 == balance1.toNumber());
        assert(200 == balance2.toNumber());

        await ixoToken.transfer(owner, 200, {from: benificiary1});
        await ixoToken.transfer(owner, 200, {from: benificiary2});

    });


    it("Nobody can withdraw the funds before the unlock date", async () => {
        // ixoToken = await IxoERC20Token.deployed();
        //set unlock date in unix epoch to some future date
        let futureTime = Math.floor((new Date).getTime() / 1000) + 50000;

        //create the contract
        let timeLockedWallet = await TimeLockedWallet.new(ixoToken.address, benificiary3, futureTime);
        let ownerBalance = await ixoToken.balanceOf(owner);
        console.log(ownerBalance.toNumber())

        await ixoToken.transfer(timeLockedWallet.address, 200, {from: owner});
        assert(200 == await ixoToken.balanceOf(timeLockedWallet.address));

        try {
            await timeLockedWallet.release();
            assert(false, "Expected error not received");
        } catch (error) {} //expected

        const balance3 = await ixoToken.balanceOf(benificiary3);
        const balanceTimelock = await ixoToken.balanceOf(timeLockedWallet.address);

        assert(0 == balance3.toNumber());
        assert(200 == balanceTimelock.toNumber());

    });

});

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}