const Todo = require('../model/todo.model')
const User = require('../model/user.model');

exports.addTodo = async (req,res) => {
    try {
        const {user} = req;
        // Check if user is authenticated
        if (!user || !user._id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const todo = await Todo.create({
            ...req.body, // Spread other fields from the request body
            userId: user._id // Set the userId field to the authenticated user's ID
        });
        console.log('todo',todo);
        
        if(todo){
            res.redirect('/api/todo')
        }else {
            res.status(400).json({ message: 'Failed to create todo' });
        }
    } catch (error) {
        console.log('Error',error);
        res.status(500).json({message:'Internal Server Error'});
    }
};

exports.showTodoPage = async (req,res) => {
    try {
        const {user} = req;
        // Check if user is authenticated
        if (!user || !user._id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const todo = await Todo.find({isDeleted : false,userId : user._id});
        // if(todo.length === 0) return res.status(404).json({message : 'Todo Not Found'});
        res.render('todo.ejs',{todo,user});
    } catch (error) {
        console.log('Error',error);
        res.status(500).json({message:'Internal Server Error'});
    }
}

exports.updateTodo = async (req,res) => {
    try {
        let updateTodo = await Todo.findOne({_id:req.params.id,isDeleted : false});
        if(!updateTodo) return res.status(404).json({message : 'Todo Not Found'});
        updateTodo = await Todo.findByIdAndUpdate(updateTodo._id,{$set : {todoText : req.body.todoText}},{new : true})
        res.redirect('/api/todo');
    } catch (error) {
        console.log('Error',error);
        res.status(500).json({message:'Internal Server Error'});
    }
};

exports.deleteTodo = async (req,res) => {
    try {
        const Id = req.params.id;
        const todo = await Todo.findOne({_id: Id , isDeleted : false});
        if(!todo) return res.status(404).json({message :'Todo Is Not found'});
        await Todo.findByIdAndUpdate(todo._id , {$set : {isDeleted : true}},{new : true})
        res.redirect('/api/todo');
    } catch (error) {
        console.log('Error',error);
        res.status(500).json({message:'Internal Server Error'});
    }
};

exports.completeTodo = async (req,res) => {
    try {
        const Id = req.params.id;
        const todo = await Todo.findOne({_id: Id , isDeleted : false , isDone : false});
        if(!todo) return res.status(404).json({message :'Todo Is Not found'});
        await Todo.findByIdAndUpdate(todo._id , {$set : {isDone : true}},{new : true})
        res.redirect('/api/todo');
    } catch (error) {
        console.log('Error',error);
        res.status(500).json({message:'Internal Server Error'});
    }
};

exports.updateFiled = async (req,res) => {
    try {
        const { user } = req;
        if (!user || !user._id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const todo = await Todo.findOne({_id : req.params.id , isDeleted : false});
        if(!todo) return res.status(404).json({message : 'Todo Not Found'});
        res.render('updateTodo.ejs',{todo,user})
    } catch (error) {
        console.log('Error',error);
        res.status(500).json({message:'Internal Server Error'});
    }
}