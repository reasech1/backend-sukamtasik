const midtransClient = require('midtrans-client');

export default async function handler(req, res) {
  // --- 1. IZIN AKSES (CORS) ---
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Respon OK untuk cek koneksi awal
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // --- 2. CONFIG MIDTRANS (MODE SANDBOX) ---
    // Kita PAKSA ke false, karena Dashboard Anda Sandbox.
    // Server Key tetap pakai yang dari gambar Anda.
    let snap = new midtransClient.Snap({
      isProduction: false, 
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
    // Kirim pesan error asli biar ketahuan salahnya apa
    res.status(500).json({ error: error.message });
  }
}
