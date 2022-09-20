const {Schema, model} = require('mongoose')

const UserData = new Schema({
    username: {
        type: String, required: true, trim: true, unique: true
    },
    email: {
        type: String,
        required: true, unique: true, match: [/.+@.+\..+/]
    },
    thoughts: [{type: Schema.Types.ObjectId, ref: 'Thought'}], friends: [{type: Schema.Types.ObjectId, ref: 'User'}]
},
{
    toJSON: {
        virtuals: true
    },
    id: false,
});
// TODO: counts friends
UserData.virtual("friendCount").get(function(){
    return this.friends.length;
});

const User = model('User', UserData);

module.exports = User;