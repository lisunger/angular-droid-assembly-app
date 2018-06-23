var mongoose = require('mongoose');

var TodosSchema =  new mongoose.Schema({
    title : {
        type: String
    },
    id : {
        type : Number
    },
    complete : {
        type : Boolean
    }
});

mongoose.model('Todo', TodosSchema);