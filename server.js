const express = require('express');
const db = require("./config/connection");
const {User, Reaction, Thought} = require('./models')
const app = express();
const port = process.env.PORT || 3001;
app.use(express.json())
app.use(express.urlencoded({extended: true}));


// GET /api/users
app.post('/api/users',({body}, res) => {
    try {
        User.create(body).then(Userdb => res.json(Userdb))
    } catch (error) {
        res.status(404).json(err)
    }
})














db.once('open', () => {
    app.listen(port, () => console.log(`Connected to localhost at  port ${port}!!`));
  } )










