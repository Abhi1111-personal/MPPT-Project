const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
  // res.send({ "name": "GeeksforGeeks" });
    res.render("index"); // Render the main form page
});

app.post("/submit", (req, res) => {
    const { ambientTemp, moduleTemp, irradiance } = req.body;
    res.redirect(`/results?ambientTemp=${ambientTemp}&moduleTemp=${moduleTemp}&irradiance=${irradiance}`);
});

app.get("/results", (req, res) => {
    const { ambientTemp, moduleTemp, irradiance } = req.query;
    res.render("results", { ambientTemp, moduleTemp, irradiance });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
