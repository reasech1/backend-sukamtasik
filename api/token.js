// api/token.js
const midtransClient = require('midtrans-client');

export default async function handler(req, res) {
  // KITA KEMBALIKAN KE FALSE KARENA DASHBOARD ANDA SANDBOX
  let snap = new midtransClient.Snap({
    isProduction: false, 
    serverKey: 'Mid-server-ojIlP1e1ziOJLDWRN0Zc40vT' // Server Key Anda
  });

  const { id, name, total } = req.body;

  let parameter = {
    transaction_details: {
      order_id: id,
      gross_amount: total
    },
    customer_details: {
      first_name: name
    }
  };

  try {
    const transaction = await snap.createTransaction(parameter);
    res.status(200).json({ token: transaction.token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
