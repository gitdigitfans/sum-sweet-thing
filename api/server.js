const express = require('express');
const cors = require('cors');
const path = require('path');
const paymentMethodsRouter = require('./routes/payment-methods');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/payment-methods', paymentMethodsRouter);

app.use('/api/public', express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, '..')));

const rootDir = path.join(__dirname, '..');
app.get('/', (req, res) => {
  res.sendFile(path.join(rootDir, 'index.html'));
});

app.get('/gold-challenge', (req, res) => {
  res.sendFile(path.join(rootDir, 'gold-challenge.html'));
});

app.get('/admin', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'admin.html');
  res.sendFile(filePath, err => {
    if (err) {
      console.error('Error sending admin.html:', err.message);
      res.status(500).send('Error loading admin page');
    }
  });
});

app.get('/checkout', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'checkout.html');
  res.sendFile(filePath, err => {
    if (err) {
      console.error('Error sending checkout.html:', err.message);
      res.status(500).send('Error loading checkout page');
    }
  });
});

if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`  Admin:    http://localhost:${PORT}/admin`);
    console.log(`  Checkout: http://localhost:${PORT}/checkout`);
    console.log(`  API:      http://localhost:${PORT}/api/payment-methods`);
  });
}

module.exports = app;
