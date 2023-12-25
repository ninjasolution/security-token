// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { UniswapV2Deployer, ethers } = require("hardhat");

async function main() {

  // let router = "0xf1c4162ec8Bd73Ee16113479a5D54D1A8A2817d1";//avax
  let router = "0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008";//sepolia
  let vault = "0x7B7887059860a1A21f3C62542B6CE5c0a23c76d5";

  const Token = await hre.ethers.getContractFactory("AUDCT");
  const token = await Token.deploy(router, vault)
  console.log("AUDCT deployed to:", token.address);

  // const pair = new hre.ethers.Contract(await token.uniswapV2Pair(), UniswapV2Deployer.Interface.IUniswapV2Pair.abi)

  // // approve the spending
  // await weth9.approve(router.address, eth(1000))
  // await token.approve(router.address, _token(1000))

  // // add liquidity
  // await router.addLiquidityETH(
  //   token.address,
  //   _token(500),
  //   _token(500),
  //   eth(10),
  //   _deployer.address,
  //   constants.MaxUint256,
  //   { value: eth(10) }
  // )


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
