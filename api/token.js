// api/token.js
const midtransClient = require('midtrans-client');

export default async function handler(req, res) {
  // Setup Midtrans
  let snap = new midtransClient.Snap({
    isProduction: false, // Ganti true jika sudah live
    serverKey: 'MASUKAN_SERVER_KEY_MIDTRANS_DISINI'
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