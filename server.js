const express = require('express');
const db = require("./config/connection");
const {User, Reaction, Thought} = require('./models')
const app = express();
const port = process.env.PORT || 3001;
app.use(express.json())
app.use(express.urlencoded({extended: true}));


// POST  /api/users
app.post('/api/users',({body}, res) => {
    try {
        User.create(body).then(Userdb => res.json(Userdb))
    } catch (error) {
        res.status(404).json(err)
    }
})
// get all user 
// GET /api/users
app.get('/api/users',(req, res) => {
    try {
        User.find({}).select('-__v').then(Userdb => res.json(Userdb))
    } catch (error) {
        res.status(500).json(error)
    }
})
// get user by id
// GET /api/users/:id
app.get('/api/users/:id',({params}, res) => {
    try {
        User.findOne({ _id: params.id }).populate([
            { path: 'thoughts', select: "-__v" },
            { path: 'friends', select: "-__v" }
        ])
        .select('-__v')
        .then(Userdb => {
            if (!Userdb) {
                res.status(404).json({message: 'User not found in Database'});
                return;
            }
            res.json(Userdb);
        })
    } catch (error) {
        res.status(404).json(404)
    }
})
// Update user by id
// PUT /api/users/:id
app.put('/api/users/:id', ({params, body}, res) => {
    try {
        User.findOneAndUpdate({_id: params.id}, body, {new:true}).then(Userdb => {
            if(!Userdb) {
                res.status(404).json({message: "User not found"})
                return;
            }
            res.json(Userdb)
        })
    } catch (error) {
        res.status(404).json(error)
    }
})

// Delete User
// DELETE /api/users/:id
app.delete('/api/users/:id',({params},res) => {
    try {
        User.findOneAndDelete({ _id: params.id}).then(Userdb => {
            if(!Userdb) {
                res.status(404).json({message: "User not found"})
                return;
            }
            // after delete user we want to update the User schema
            User.updateMany({_id: {$in: Userdb.friends}}, {$pull: { friends: params.id}}).
            then(() => {res.json({message: "successfully deleted"})
        }).catch(err => res.status(400).json(err));
        }).catch(err => res.status(400).json(err));
    } catch (error) {
        res.status(404).json(error)
    }
})
// add Friend
// POST /api/users/:userId/friends/:friendId
app.post('/api/users/:userId/friends/:friendId', ({params}, res) => {
    try {
        User.findByIdAndUpdate({ _id: params.userId}, {$addToSet: {friends: params.friendId}}, {new: true, runValidators: true}).then(
            Userdb => {
                if(!Userdb) {
                    res.status(404).json({message: 'User not found'});
                    return;
                }
                // add UserId to friendsId
                User.findByIdAndUpdate({ _id: params.friendId},{ $addToSet: {friends: params.userId}}, {new: true, runValidators: true}).then(Userdb2 => {
                    if(!Userdb2) {
                        res.status(404).json({message: "User not found"})
                        return;
                    }
                    res.json(Userdb)
                }).catch(err => res.json(err))
            }
        )
    } catch (error) {
        res.status(404).json(error)
    }
})
// This is THOUGHT section
// Create thoughts 
// POST /api/thoughts
app.post('/api/thoughts', ({body}, res) => {
    try {
        Thought.create(body).then(Thoughtdb => {
            User.findOneAndUpdate({_id: body.userId}, {$push: {thoughts: Thoughtdb._id}}, {new: true}).then(Userdb => {
                if(!Userdb) {
                    res.status(404).json({message: 'No user found'});
                    return;
                }
                res.json(Userdb)
            }).catch(err => res.json(err))

        })
    } catch (error) {
        res.status(400).json(error)
    }
})

// get all thoughts
// GET /api/thoughts
app.get('/api/thoughts', (req, res) => {
    Thought.findOne({}).populate({path: 'reactions', select:'-__v' }).select('-__v').then(Thoughtdb => res.json(Thoughtdb)).
    catch(err => res.status(500).json(err))
})
// get thought by ID
// GET /api/thoughts/:id
app.get('/api/thoughts/:id', ({params}, res) => {
    try {
        Thought.findOne({_id: params.id}).populate({path: 'reactions', select:'-__v' }).select('-__v').
        then(Thoughtdb => {
            if(!Thoughtdb) {
                res.status(404).json({message: "User not found"});
                return;
            }
            res.json(Thoughtdb)
        } )
    } catch (error) {
        res.status(404).json(error)
    }
})
// Update thought by id
// PUT /api/thoughts/:id
app.put('/api/thoughts/:id', ({params, body}, res) => {
    try {
        Thought.findOneAndUpdate({ _id: params.id}, body, {new: true}).
        then(Thoughtdb => {
            if(!Thoughtdb) {
                res.status(404).json({message: 'No Thought found'});
                return;
            }
            res.json(Thoughtdb)
        } )
    } catch (error) {
        res.status(404).json(error)
    }
})
// Deelete thought
// DELETE /api/thoughts/:id
app.delete('/api/thoughts/:id', ({params}, res) => {
    try {
        Thought.findOneAndDelete({_id: params.id}).then(Thoughtdb =>{
            if(!Thoughtdb) {
                res.status(404).json({message: "No thought found with this user"});
                return;
            }
            User.findOneAndUpdate({username: Thoughtdb.username}, {$pull: {thoughts: params.id}}).then(() => {
                res.json({message: "Successfully delete thought"})
            }).catch(err => res.status(500).json(err));
        })
    } catch (error) {
        res.status(404).json(error)
    }
})













db.once('open', () => {
    app.listen(port, () => console.log(`Connected to localhost at  port ${port}!!`));
  } )










