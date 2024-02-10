const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// connect to database
mongoose.connect(
    "uri"
);

mongoose.connection.on("connected", () => {
    console.log("Mongoose connection open to MongoDB Atlas.");
});

mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error: " + err);
});

mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected.");
});

// Create a schema - this is like a blueprint
let todoSchema = new mongoose.Schema({
    item: String,
});

let Todo = mongoose.model("Todo", todoSchema);

// Create an async function to save the item
// async function saveItem() {
//     try {
//         // Create an instance of the model
//         let itemOne = new Todo({ item: "buy flowers" });

//         // Save the instance using await
//         await itemOne.save();

//         console.log("item saved");
//     } catch (err) {
//         console.error("Error saving item: ", err);
//     }
// }
// saveItem();

// let data = [
//     { item: "get milk" },
//     { item: "walk dog" },
//     { item: "kick some coding ass" },
// ];

let urlencodeParser = bodyParser.urlencoded({ extended: false }); // middleware to pass POST data

module.exports = function (app) {
    app.get("/todo", async function (req, res) {
        // get data from mongodb and pass it to view
        // Todo.find({}, function (err, data) {
        //     if (err) throw err;
        //     res.render("todo", { todos: data });
        // });
        let data = await Todo.find({});
        res.render('todo', { todos: data});
    });

    app.post("/todo", urlencodeParser, async function (req, res) {
        // get data from view and add it to mongodb
        try {
            // Create an instance of the model
            let newTodo = Todo(req.body);

            // Save the instance using await
            await newTodo.save();

            console.log("item saved");

            let data = await Todo.find({});
            res.json(data);
        } catch (err) {
            console.error("Error saving item: ", err);
        }
        // let newTodo = Todo(req.body);
        // data.push(req.body);
        // res.json(data);
    });

    app.delete("/todo/:item", async function (req, res) {
        // delete the requested item from mongodb
        try {
            // Create an instance of the model
            let reqTodo = await Todo.findOneAndDelete({item: req.params.item.replace(/\-/g, " ")});

            // Save the instance using await
            // await reqTodo.deleteOne();

            console.log("item deleted");

            let data = await Todo.find({});
            res.json(data);
        } catch (err) {
            console.error("Error saving item: ", err);
        }
        // data = data.filter(function (todo) {
        //     return todo.item.replace(/ /g, "-") !== req.params.item;
        // });
        // res.json(data);
    });
};
