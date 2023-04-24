const express = require('express');
const app = express();
const open = require('open');

app.use(express.static('./'));

const server = app.listen(5050, function () {
   console.log(`Server listening on port 5050`);
   open(`http://localhost:${5050}`);
});