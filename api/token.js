const midtransClient = require('midtrans-client');

export default async function handler(req, res) {
  // --- 1. SETTING IZIN KONEKSI (CORS) AGAR TIDAK ERROR "FAILED TO FETCH" ---
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Boleh diakses dari mana saja
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Jika browser bertanya "Boleh masuk gak?", jawab "Boleh!" (Preflight Check)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // --- 2. CONFIG MIDTRANS ---
    // Cek Kunci Anda: Jika depannya "SB-Mid-...", pakai isProduction: false
    // Jika depannya "Mid-..." (tanpa SB), pakai isProduction: true
    
    // Berdasarkan gambar Anda, kuncinya "Mid-server...", jadi kita coba mode Production:
    let snap = new midtransClient.Snap({
      isProduction: true, // Ubah ke true karena kunci Anda kunci Production
      serverKey: 'Mid-server-ojIlP1e1ziOJLDWRN0Zc40vT' // Server Key dari screenshot Anda
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
    console.error("Error backend:", error);
    res.status(500).json({ error: error.message });
  }
}
