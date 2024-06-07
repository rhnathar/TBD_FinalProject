const express = require('express');
const TA_TBDRoutes = require('./src/TA_TBD/routes');

const app = express();
const port = 3000;

app.use(express.json());
//test
app.get("/", (req, res)=>{
  res.send("Hi");
});

app.use('/api/GRBOnlineStore', TA_TBDRoutes);
app.listen(port, () => {
  console.log(`app listening on port ${port}`)
});