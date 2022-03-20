import { ethers } from "ethers";
import { BigNumber } from "@ethersproject/bignumber";


const WETH = ''   WETH addess

const privatekey = '  Your wallet Privatekey'
const Provider = new ethers.providers.JsonRpcProvider('Your RPC')

const mywallet = new ethers.Wallet(privatekey, Provider);

const routeraddess = '';   //uniswap routeraddess
const routerabi = require(''); uniswap routerabi
const routercontract = new ethers.Contract(routeraddess, routerabi, mywallet);

const factoryaddess = '';     //uniswap factoryaddes
const factoryabi = require('');          //uniswap factoryabi
const factorycontract = new ethers.Contract(factoryaddess,factoryabi,mywallet);


factorycontract.on('PairCreated', async (token0, token1, pairAddress) => {
console.log('***********************************************')
console.log('New Pair Created')
console.log('token0:',token0)
console.log('token1:',token1)
console.log('pairAddress:',pairAddress);

let tokenIn,tokenOut;

  if(token0 == WETH) {
  tokenIn = token0; 
  tokenOut = token1;
}

if(token1 == WETH) {
  tokenIn = token1; 
  tokenOut = token0;
}

const path = [tokenIn, tokenOut]
const amountIn =ethers.utils.parseUnits('',18);  //WETH you spend
const amounts = await routercontract.getAmountsOut(amountIn,path);
//console.log(ethers.utils.formatUnits(amounts[1],18));
const amountOutMin = amounts[1].sub(amounts[1].div(10));
//console.log(ethers.utils.formatUnits(amountOutMin,18));
console.log('***********************************************')
console.log('Buying New Token')
console.log('AmoutIn:',ethers.utils.formatEther(amountIn))
console.log('AmoutOut:',ethers.utils.formatEther(amountOutMin))
console.log('***********************************************')
let gas_price =await Provider.getGasPrice();

let transGasLimit = 230000;  

const tx = await routercontract.swapExactTokensForTokens(
  amountIn,
  amountOutMin,
  path,

  '',  //your  address
  Date.now() + 1000 * 60 * 10, //10 minutes
  { 
    from: '',     //your  address
    gasLimit:300000,
    gasPrice: gas_price, 
    value:ethers.utils.parseEther('0')
  }
);
const receipt = await tx.wait(); 
console.log('Transaction receipt');
console.log(receipt);

});
