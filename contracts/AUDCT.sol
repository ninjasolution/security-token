//SPDX-License-Identifier: Unlicense
//Declare the version of solidity to compile this contract. 
//This must match the version of solidity in your hardhat.config.js file
pragma solidity ^0.8.0;
 
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';

contract AUDCT is ERC20, Ownable, Pausable  {
 
    using SafeMath for uint256;

    uint8 private _decimals = 2;
    uint8 public divisor = 10000;
    uint8 public buyFee = 150;
    uint8 public sellFee = 500;
    uint8 public maxSellFee = 1000;
    uint8 public maxBuyFee = 200;

    address public vault;

    address public immutable uniswapV2Pair;

    constructor(address _router, address _vault) ERC20("Dean Real Estate Security Token", "AUDCT") {
 
        _mint(msg.sender, 100000000 * 10 ** _decimals);
        IUniswapV2Router02 _uniswapV2Router = IUniswapV2Router02(_router);
        vault = _vault;

        uniswapV2Pair = IUniswapV2Factory(_uniswapV2Router.factory())
            .createPair(address(this), _uniswapV2Router.WETH());

    }

    function _transfer(address from, address to, uint256 amount) internal virtual override {
        uint256 feeAmount = 0;
        
        if(from == address(uniswapV2Pair)) {
            feeAmount = amount.mul(buyFee).div(divisor);
        }else if (to == address(uniswapV2Pair)) {
            feeAmount = amount.mul(sellFee).div(divisor);
        }

        super._transfer(from, vault, feeAmount);
        super._transfer(from, to, amount.sub(feeAmount));
    }

    function setSellFee(uint8 fee) external {
        require(fee <= maxSellFee, "AUDCT: Exceeded max sell fee");
        sellFee = fee;
    }

    function setBuyFee(uint8 fee) external {
        require(fee <= maxBuyFee, "AUDCT: Exceeded max buy fee");
        maxBuyFee = fee;
    }

    receive() external payable {    }
}