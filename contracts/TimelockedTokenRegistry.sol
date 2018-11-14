pragma solidity ^0.4.24;
import "zos-lib/contracts/Initializable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/TokenTimelock.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

    /**
    * @title TimelockedTokenRegistry
    */

contract TimelockedTokenRegistry is Initializable {
    using SafeMath for uint256;

    IERC20 private ixoToken;
    //Only A spcific address can set these tokens - prevent other token from being timelocked
    mapping (address => address) private benificiaryTimelocks;
    event TimelockedRegistryCreated(address indexed ixoToken);
    event TimeLockCreated(address indexed token, address indexed timelockAddress);         
    event TokensReleased(address indexed token, address indexed to, uint256 value);

    function initialize(address _ixoToken) public {
        ixoToken = IERC20(_ixoToken);
        emit TimelockedRegistryCreated(address(ixoToken));
    }

    function releaseForBenificiary(address _beneficiary) public {
        // solium-disable-next-line security/no-block-members
        require(benificiaryTimelocks[_beneficiary] > 0, "No Address found");         
        TokenTimelock timelock = TokenTimelock(benificiaryTimelocks[_beneficiary]);
        timelock.release();
        benificiaryTimelocks[_beneficiary] = 0;
        delete timelock;
        emit TokensReleased(address(ixoToken), _beneficiary, ixoToken.balanceOf(_beneficiary));
    }

    function addNewTimelock(address _beneficiary, uint256 _releaseTime) public returns (address){
        require(_beneficiary != address(0), "Beneficiary cannot be zero");
        require(benificiaryTimelocks[_beneficiary] == 0, "Address added already");   
        TokenTimelock timelock = new TokenTimelock(ixoToken, _beneficiary, _releaseTime);
        benificiaryTimelocks[_beneficiary] = timelock;   
        benificiaryTimelocks[_beneficiary] = address(timelock);
        emit TimeLockCreated(address(ixoToken), address(timelock));
    }

    function addTimelock(address _beneficiary, address timelock) public{
        require(_beneficiary != address(0), "Beneficiary cannot be zero");   
        require(timelock != address(0), "Timelock cannot be zero");   
        require(benificiaryTimelocks[_beneficiary] == 0, "Address added already");   
        benificiaryTimelocks[_beneficiary] = address(timelock);
        emit TimeLockCreated(address(ixoToken), address(timelock));
    }

     /**
    * @return the nr of tokens locked for the beneficiary.
    */
    function lockedBalance(address _beneficiary) public view returns(uint256) {
        require(benificiaryTimelocks[_beneficiary] > 0, "No Address found");       
        address timelockAddress = benificiaryTimelocks[_beneficiary];
        return TokenTimelock(timelockAddress).token().balanceOf(timelockAddress);
    }

}