const Web3 = require('web3');

// Replace with your provider URL (e.g., Infura, Alchemy)
const providerUrl = 'YOUR_PROVIDER_URL';

const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));

async function getEthereumBalance(address) {
  try {
    const balance = await web3.eth.getBalance(address);
    const weiToEther = web3.utils.fromWei(balance, 'ether');
    return weiToEther;
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw new Error('Failed to retrieve balance'); // Re-throw for handling in the route
  }
}

module.exports = getEthereumBalance;
