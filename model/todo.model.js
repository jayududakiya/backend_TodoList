const mongoose = require('mongoose');


const todoSchema = mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'todoUser'
    },
    todoText:{
        type : String,
        require : true
    },
    isDone : {
        type: Boolean,
        default : false
    },
    isDeleted : {
        type: Boolean,
        default : false
    }
},{
    versionKey : false,
    timestamp : true
});

module.exports = mongoose.model('userTodo',todoSchema);