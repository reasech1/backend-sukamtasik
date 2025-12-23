const midtransClient = require('midtrans-client');

export default async function handler(req, res) {
  // --- IZIN CORS (PENTING) ---
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // --- MODE SANDBOX (TESTING) ---
    let snap = new midtransClient.Snap({
      isProduction: false, // JANGAN UBAH INI (TETAP FALSE)
      // GANTI DENGAN KUNCI YANG ADA "SB-" DI DEPANNYA
      serverKey: 'MASUKAN_SERVER_KEY_YANG_ADA_SB_DISINI' 
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

    const transaction = await snap.createTransaction(parameter);
    res.status(200).json({ token: transaction.token });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
