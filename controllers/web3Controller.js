const { Web3 } = require('web3');

// Alchemy provider URL
const providerUrl = 'https://eth-sepolia.g.alchemy.com/v2/fWr3m1Bq4Mqxz0n-WoE86aq24VsXTsrq';

// Create a new Web3 instance
const web3 = new Web3(providerUrl);

exports.fetchBalance = async (req, res) => {
  const { address } = req.params;

  try {
    // Validate the Ethereum address
    const isValidAddress = Web3.utils.isAddress(address);
    if (!isValidAddress) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }

    // Get the account balance in Wei
    const balance = await web3.eth.getBalance(address);

    // Convert the balance from Wei to Ether
    const balanceInEther = Web3.utils.fromWei(balance, 'ether');

    res.json({ balance: balanceInEther });
  } catch (error) {
    console.error('Error fetching account balance:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};