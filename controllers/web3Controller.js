const Web3 = require("web3");

// alchemy provider
const web3 = new Web3(
  "https://eth-sepolia.g.alchemy.com/v2/fWr3m1Bq4Mqxz0n-WoE86aq24VsXTsrq"
);

exports.fetchBalance = async (req, res) => {
  const { address } = req.params;

  try {
    // Validate the Ethereum address
    if (!web3.utils.isAddress(address)) {
      return res.status(400).json({ error: "Invalid Ethereum address" });
    }

    // Get the account balance in Wei
    const balance = await web3.eth.getBalance(address);

    // Convert the balance from Wei to Ether
    const balanceInEther = web3.utils.fromWei(balance, "ether");

    res.json({ balance: balanceInEther });
  } catch (error) {
    console.error("Error fetching account balance:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
