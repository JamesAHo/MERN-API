const { Schema, model} = require('mongoose');
const ReactionData = require('./Reaction');
const moment = require('moment');

const ThoughtData = new Schema({
    thoughtContent: {
        type: String, required: true, minLength: 1, maxLength: 280
    },
    CreatedAt: {
        type: Date,
        default: Date.now,
        get: (CreatedAtdb) => moment(CreatedAtdb).format("MMM DD, YYY [at] hh:mm a")
    },
    username: {
        type: String, required: true
    },
    reactions: [ReactionData]
},
{
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
}
)

ThoughtData.virtual('reactionCount').get(function() {
    return this.reactions.length;
})
const Thought = model('Thought', ThoughtData);

module.exports = Thought;