const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    isDeleted : {
        type : Boolean,
        default : false
    },
    email : {
        unique : true,
        require : true,
        type : String
    },
    password : {
        type : String,
        require : true
    },
    name : {
        type : String
    }
},{
    versionKey : false,
    timestamp : true
});

module.exports = mongoose.model('todoUser',userSchema);