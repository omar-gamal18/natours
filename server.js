const express = require('express');
const tourRoutes = require('./routes/tourRoutes');

const port = 5000;
const app = express();

app.use(express.json());

app.use('/api/v1/tours', tourRoutes);

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
