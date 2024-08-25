import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import NoteList from "./components/NoteList";
import AddNote from "./components/AddNote";

const App = () => {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        // Fetch notes from the server
        axios
            .get("http://localhost:5000/api/notes")
            .then((response) => setNotes(response.data))
            .catch((error) => console.error("Error fetching notes:", error));
    }, []);

    const handleAddNote = () => {
        // Add a new note to the server
        axios
            .post("http://localhost:5000/api/notes", { title, content })
            .then((response) => {
                setNotes([...notes, response.data]);
                setTitle("");
                setContent("");
            })
            .catch((error) => console.error("Error adding note:", error));
    };

    const handleEditNote = (id, updatedTitle, updatedContent) => {
        // Update note by ID
        axios
            .put(`http://localhost:5000/api/notes/${id}`, {
                title: updatedTitle,
                content: updatedContent,
            })
            .then((response) => {
                const updatedNotes = notes.map((note) =>
                    note._id === id ? response.data : note
                );
                setNotes(updatedNotes);
            })
            .catch((error) => console.error("Error updating note:", error));
    };

    const handleDeleteNote = (id) => {
        // Delete note by ID
        axios
            .delete(`http://localhost:5000/api/notes/${id}`)
            .then(() => {
                const updatedNotes = notes.filter((note) => note._id !== id);
                setNotes(updatedNotes);
            })
            .catch((error) => console.error("Error deleting note:", error));
    };

    return (
        <div className="app-container">
            <h1> Keep Notes</h1>
            <AddNote
                title={title}
                setTitle={setTitle}
                content={content}
                setContent={setContent}
                onAddNote={handleAddNote}
            />
            <NoteList
                notes={notes}
                onEditNote={handleEditNote}
                onDeleteNote={handleDeleteNote}
            />
        </div>
    );
};

export default App;
