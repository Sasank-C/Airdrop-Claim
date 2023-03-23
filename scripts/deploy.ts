import { ethers } from "hardhat";
const { abi: UniswapV3PoolABI } = require('@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json')
const { abi: SwapRouterABI } = require('@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json')
const { abi: NonfungiblePositionManagerABI } = require('@uniswap/v3-periphery/artifacts/contracts/interfaces/INonfungiblePositionManager.sol/INonfungiblePositionManager.json')
const { abi: IUniswapV3FactoryABI } = require('@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json')

async function main() {

  // Get contracts
  const ArbToken = "0x912CE59144191C1204E64559FE8253a0e49E6548"
  const TokenDistributor = "0x67a24CE4321aB3aF51c2D0a4801c3E111D88C9d9"
  const poolAddress = "0x92fd143A8FA0C84e016C2765648B9733b0aa519e"

  // Get accounts from hardhat
  const [owner, addr1, addr2] = await ethers.getSigners(); // Change according to your needs

  // Get ArbToken contract
  const arbToken = await ethers.getContractAt("L2ArbitrumToken", ArbToken);

  // Get TokenDistributor contract
  const tokenDistributor = await ethers.getContractAt("TokenDistributor", TokenDistributor);

  // Get SwapRouter contract
  const swapRouter = await ethers.getContractAt(SwapRouterABI, "0xE592427A0AEce92De3Edee1F18E0157C05861564");

  // Get UniswapV3Pool contract
  const uniswapV3Pool = await ethers.getContractAt(UniswapV3PoolABI, poolAddress);

  // Get chainId
  const chainId = await hre.ethers.provider.getNetwork().then((network) => network.chainId);
  console.log("ChainId: ", chainId);

  // get current block, timestamp and claim period start
  const latestBlock = await hre.ethers.provider.getBlock("latest")
  console.log("Current block: ", latestBlock.number);
  console.log("Current timestamp: ", latestBlock.timestamp);

  const claimStart = await tokenDistributor.claimPeriodStart();
  console.log("Claim period start: ", claimStart.toString());


  // Get claimable tokens
  let tx = await tokenDistributor.claimableTokens(owner.address);
  console.log("Account 1 Claimable tokens: ", tx.toString());
  let ownerBalance = tx.toString();

  tx = await tokenDistributor.claimableTokens(addr1.address);
  console.log("Account 2 Claimable tokens: ", tx.toString());
  let addr1ClaimableTokens = tx.toString();

  tx = await tokenDistributor.claimableTokens(addr2.address);
  console.log("Account 3 Claimable tokens: ", tx.toString());
  let addr2ClaimableTokens = tx.toString();


  // Claim tokens from all accounts and send to owner
  let tx1 = await tokenDistributor.connect(owner).claim();
  console.log("Owner Claim tx: ", tx1.hash);

  tx1 = await tokenDistributor.connect(addr1).claim();
  console.log("Addr 1 Claim tx: ", tx1.hash);

  tx1 = await tokenDistributor.connect(addr2).claim();
  console.log("Addr 2 Claim tx: ", tx1.hash);


  // Send tokens to owner
  tx1 = await arbToken.connect(addr1).transfer(owner.address, addr1ClaimableTokens);
  console.log("Addr 1 transfer tx: ", tx1.hash);

  tx1 = await arbToken.connect(addr2).transfer(owner.address, addr2ClaimableTokens);
  console.log("Addr 2 transfer tx: ", tx1.hash);

  // ----------------------------- Swap ArbToken for WETH ------------------------------//
  // ------------------------ Experimental. Uncomment to use. -------------------------//

  // // allow swapRouter to spend max ArbToken - Approve ArbToken on Uniswap V3
  // let tx2 = await arbToken.approve(swapRouter.address, ethers.constants.MaxUint256);
  // console.log("Approve tx: ", tx2.hash);

  // // Get ArbToken balance
  // let balance = await arbToken.balanceOf(owner.address);
  // console.log("Balance: ", balance.toString());
  // ownerBalance = balance.toString();

  // // Swap ArbToken for WETH
  // let params = {
  //   tokenIn: ArbToken,
  //   tokenOut: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
  //   fee: 10000,
  //   recipient: owner.address,
  //   deadline: latestBlock.timestamp + 10000,
  //   amountIn: ethers.utils.parseEther("1000"), // Swap 1000 ArbToken - Change this to your sell amount
  //   amountOutMinimum: ethers.utils.parseEther("3"), // 3 WETH - Change this to your output amount
  //   sqrtPriceLimitX96: 0,
  // }

  // // Swap ArbToken for WETH on Uniswap V3
  // let tx3 = await swapRouter.exactInputSingle(params , { gasLimit: 1000000 });
  // console.log("Swap tx: ", tx3.hash);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
