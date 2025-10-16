const express = require('express');
const app = express();
const port = process.env.PORT || 5002;

app.get('/', (req, res) => {
  res.json({service: "order-service", status: "running", message: "Order Service is running!"});
});

app.listen(port, () => {
  console.log(`Order Service listening on port ${port}`);
});
