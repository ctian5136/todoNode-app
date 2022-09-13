const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

//models
const TodoTask = require("./models/TodoTask");

dotenv.config();

app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true }));

//connection to db
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Connected to db!");
    port = process.env.PORT || 3000
    app.listen(port, () => console.log("Server Up and running", port));
});

app.set("view engine", "ejs");

// GET METHOD - this get function reads the data from the database and renders it onto the UI
app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });
    });
});

//POST METHOD - this post function allows the user inputted text to be added to the database, saving the task in the database and thus the UI
app.post('/',async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});

//UPDATE - this update function allows the tasks to be edited and updated within the database and thus the UI
app
    .route("/edit/:id")
    .get((req, res) => {
        const id = req.params.id;
        TodoTask.find({}, (err, tasks) => {
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
        });
    })
    .post((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
            if (err) return res.send(500, err);
            res.redirect("/");
        });
    });

//DELETE - this delete function allows for tasks to be removed from the database and thus the UI
app.route("/remove/:id").get((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndRemove(id, err => {
            if (err) return res.send(500, err);
            res.redirect("/");
        });
    });
