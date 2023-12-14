import { ethers } from "ethers";
import { BigNumber } from "@ethersproject/bignumber";

// WETH address
const WETH = ''; 

// Your wallet Privatekey
const privatekey = 'Your wallet Privatekey'; 

// Your RPC Provider
const Provider = new ethers.providers.JsonRpcProvider('Your RPC');

// Uniswap router address
const routeraddess = ''; 
// Uniswap router ABI
const routerabi = require(''); 
const routercontract = new ethers.Contract(routeraddess, routerabi, mywallet);

// Uniswap factory address
const factoryaddess = ''; 
// Uniswap factory ABI
const factoryabi = require(''); 
const factorycontract = new ethers.Contract(factoryaddess, factoryabi, mywallet);

// Listening for 'PairCreated' event
factorycontract.on('PairCreated', async (token0, token1, pairAddress) => {
  console.log('***********************************************')
  console.log('New Pair Created') // 监听到新的交易对被创建
  console.log('token0:', token0) // 代币0
  console.log('token1:', token1) // 代币1
  console.log('pairAddress:', pairAddress); // 交易对地址

  let tokenIn, tokenOut;

  // Determine input and output tokens based on WETH
  // 根据 WETH 确定输入和输出的代币
  if (token0 == WETH) {
    tokenIn = token0; 
    tokenOut = token1;
  }

  if (token1 == WETH) {
    tokenIn = token1; 
    tokenOut = token0;
  }

  const path = [tokenIn, tokenOut]
  const amountIn = ethers.utils.parseUnits('', 18); // Amount of WETH you spend
  const amounts = await routercontract.getAmountsOut(amountIn, path);
  const amountOutMin = amounts[1].sub(amounts[1].div(10));

  console.log('***********************************************')
  console.log('Buying New Token') // 开始购买新代币
  console.log('AmoutIn:', ethers.utils.formatEther(amountIn)) // 输入金额
  console.log('AmoutOut:', ethers.utils.formatEther(amountOutMin)) // 预期输出金额
  console.log('***********************************************')

  let gas_price = await Provider.getGasPrice();
  let transGasLimit = 230000;  

  // Swap tokens
  // 交换代币
  const tx = await routercontract.swapExactTokensForTokens(
    amountIn,
    amountOutMin,
    path,
    '', // Your address
    Date.now() + 1000 * 60 * 10, // 10 minutes
    { 
      from: '', // Your address
      gasLimit: 300000,
      gasPrice: gas_price, 
      value: ethers.utils.parseEther('0')
    }
  );
  const receipt = await tx.wait(); 
  console.log('Transaction receipt');
  console.log(receipt);
});