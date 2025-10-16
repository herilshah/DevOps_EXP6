const express = require('express');
const app = express();
const port = process.env.PORT || 5001;

app.get('/', (req, res) => {
  res.json({service: "user-service", status: "running", message: "User Service is running!"});
});

app.listen(port, () => {
  console.log(`User Service listening on port ${port}`);
});
