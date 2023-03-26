const express = require('express');
const app = express();
const open = require('open');

app.use(express.static('./'));

const server = app.listen(5050, function () {
   open(`http://localhost:${5050}`);
});