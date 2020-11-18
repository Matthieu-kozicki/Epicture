const express = require('express');
const app = express();
const port = 8080;
const about = require('./about');

app.get('/about.json', (req, res) => {
    let rep = about;
    rep.about.customer = req.ip;
    rep.about.server.current_time = new Date(2010, 6, 26).getTime() / 1000;
    res.send(rep);
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})