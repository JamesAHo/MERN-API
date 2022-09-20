const express = require('express');
const db = require("./config/connection");
const app = express();
const port = process.env.PORT || 3001;
app.use(express.json())
app.use(express.urlencoded({extended: true}));
// app.use(routes)


db.once('open', () => {
    app.listen(port, () => console.log(`Connected to ${port}`));
})