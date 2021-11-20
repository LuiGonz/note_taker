// imports express package for the server framework
const express = require("express");

// imports fs module, which enables us to work with the file system
const fs = require("fs");

// importing file path resolution methods
const path = require("path");

// Helper method for generating unique ids
const uuid = require("./helpers/uuid.js")

// Initialize app variable
const app = express();

// imports db.json from db folder
const db = require("./db/db.json")

// defining the port variable
const PORT = process.env.PORT || 3001;

// Implement middleware for the parsing of JSON data
app.use(express.json());

// Implement middleware for parsing of URL encoded data
app.use(express.urlencoded({extended: true}));

// Invokes app.use() and serve static files from the '/public' folder
app.use(express.static("public"));

// GET request for route api/notes
app.get("/api/notes", (req, res) => {
    // Logs request to the terminal
    console.info(`${req.method} request received to get notes`);
    res.json(db);
});

// POST request to add an api/notes route
app.post("/api/notes", (req, res) => {
    // Logged that a POST request was received
    console.info(`${req.method} request received to add the route notes`);
    const newNotes = req.body;
    newNotes.id = uuid();
    db.push(newNotes);
    createdJsonFile();
    res.send(db);
});

// Deletes a note with specific id
app.delete("/api/notes/:id", (req, res) => {
    let noteId = req.params.id;
    db.splice(noteId, 1);
    createdJsonFile();
    res.send("DELETE NOTES ID" + noteId);
});

// Create a route that will serve up the `public/notes.html` page
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// Create a route that will serve up the `public/index.html` page
app.get("/index", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
    // Show the user agent information in the terminal
    console.info(req.rawHeaders);
});

// Listens for requests after routes are set up
app.listen(PORT, () =>
    console.info(`Example app listening at http://localhost:${PORT} 🚀`)
);

//Creates db.json file
createdJsonFile = () => {
    // Converts the data to a string and writes the string to db file each time a new note is added 
    fs.writeFile("./db/db.json", JSON.stringify(db), (err) =>
    err ? console.error(err) : console.info("The new notes id was successfully updated!")
    );
}