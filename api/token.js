const midtransClient = require('midtrans-client');

export default async function handler(req, res) {
  // 1. HEADER KONEKSI (WAJIB ADA BIAR GAK "FAILED TO FETCH")
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
    // 2. KITA GUNAKAN SETTINGAN "TRUE" (ASLI)
    // Karena kunci Anda diawali "Mid-", bukan "SB-"
    let snap = new midtransClient.Snap({
      isProduction: true, // KITA UBAH JADI TRUE
      serverKey: 'Mid-server-ojIlP1e1ziOJLDWRN0Zc40vT'
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
