const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB Atlas
const dbURI = "mongodb+srv://hiteshchouhan9680:hitesh123@cluster0.rqjdn.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Define Note model using Mongoose Schema
const { Schema, model } = mongoose;

const noteSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
});

const Note = model("Note", noteSchema);

// Routes
app.get("/", (req, res) => {
    res.send("Hello, this is the root!");
});

// Get all notes
app.get("/api/notes", async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notes", error: error.message });
    }
});

// Create a new note
app.post("/api/notes", async (req, res) => {
    const { title, content } = req.body;

    const note = new Note({ title, content });

    try {
        const newNote = await note.save();
        res.status(201).json(newNote);
    } catch (error) {
        res.status(400).json({ message: "Error creating note", error: error.message });
    }
});

// Update Note by ID
app.put("/api/notes/:id", async (req, res) => {
    const { title, content } = req.body;
    const { id } = req.params;

    try {
        const updatedNote = await Note.findByIdAndUpdate(
            id,
            { title, content },
            { new: true, runValidators: true }
        );
        if (!updatedNote) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.json(updatedNote);
    } catch (error) {
        res.status(400).json({ message: "Error updating note", error: error.message });
    }
});

// Delete Note by ID
app.delete("/api/notes/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const deletedNote = await Note.findByIdAndDelete(id);
        if (!deletedNote) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.json({ message: "Note deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: "Error deleting note", error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
