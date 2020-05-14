require('dotenv').config(); 
const app = require('./server.js');


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`\n*** Server Running on http://localhost:${port} ***\n`);
});


