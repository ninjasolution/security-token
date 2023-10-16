const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { constants } = require("ethers");
const { UniswapV2Deployer, ethers } = require("hardhat");

function eth(amount) {
  return ethers.utils.parseEther(amount.toString())
}

function _token(amount) {
  return (amount * 100).toString()
}

describe("DREToken", function () {


  let token, pair;
  let deployer, target, fund;
  let _weth9;
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploy() {
    const [ _deployer, _fund, _target] = await ethers.getSigners();

    // deploy the uniswap v2 protocol
    const { factory, router, weth9 } = await UniswapV2Deployer.deploy(deployer);

    // deploy our token
    const Token = await ethers.getContractFactory("AUDCT")
    token = await Token.deploy(router.address, _fund.address)
    await token.deployed()

    // get our pair
    pair = new ethers.Contract(await token.uniswapV2Pair(), UniswapV2Deployer.Interface.IUniswapV2Pair.abi)

    // approve the spending
    await weth9.approve(router.address, eth(1000))
    await token.approve(router.address, _token(1000))

    // add liquidity
    await router.addLiquidityETH(
      token.address,
      _token(500),
      _token(500),
      eth(10),
      deployer.address,
      constants.MaxUint256,
      { value: eth(10) }
    )

    deployer = _deployer;
    fund = _fund;
    target = _target;
    _weth9 = weth9;
  }

  before(async () => {
    await deploy();
  })

 
  describe("Transfer", function () {

    it("shouldn't tax on transfer", async function () {

      await expect(token.transfer(target.address, _token(100))).to.changeTokenBalances(
        token,
        [deployer, fund, target],
        [_token(100) * -1, 0, _token(100)]
      )

    })

  })

  describe("Swap", function () {

    it("should tax on buy", async function () {

      await expect(router.swapETHForExactTokens(
        _token(100),
        [_weth9.address, token.address],
        deployer.address,
        constants.MaxUint256,
        { value: eth(100) }
      )).to.changeTokenBalances(token, [deployer, fund, pair], [_token(98.5), _token(1.5), _token(100) * -1])
    })

    it("should tax on sell", async function () {
      const { router, weth9, token, deployer, fund, pair } = await loadFixture(deploy)
      // since we have a fee, we must call SupportingFeeOnTransferTokens
      await expect(router.swapExactTokensForETHSupportingFeeOnTransferTokens(
        _token(100),
        1,
        [token.address, weth9.address],
        deployer.address,
        constants.MaxUint256,
      )).to.changeTokenBalances(token, [deployer, fund, pair], [_token(100) * -1, _token(5), _token(95)])
    })

  })

});
