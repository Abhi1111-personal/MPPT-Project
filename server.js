const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { Client } = require("pg"); // PostgreSQL client
const fs = require("fs");
const csv = require("csv-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// PostgreSQL connection // new pg.client
const dbClient = new Client({
  host: "localhost",
  user: "postgres",   // Replace with your PostgreSQL username
  password: "Apstyle@1001", // Replace with your PostgreSQL password
  database: "Plant_MPPT",  // Replace with your PostgreSQL database name
  PORT: 5432
});

dbClient.connect().catch(err => console.error("Error connecting to PostgreSQL:", err));

// Routes
// Render the input form
app.get("/", (req, res) => {
  res.render("index");
});

// Handle form submission and query data
app.post("/submit", async (req, res) => {
  const { start_time, end_time, ambient_temp, module_temp, irradiation } = req.body;
  const results = [];

  // Query from PostgreSQL
  const conditions = [];
  if (start_time && end_time) {
    conditions.push(`date_time BETWEEN '${start_time}' AND '${end_time}'`);
  }
  if (ambient_temp) {
    conditions.push(`ambient_temperature = ${ambient_temp}`);
  }
  if (module_temp) {
    conditions.push(`module_temperature = ${module_temp}`);
  }
  if (irradiation) {
    conditions.push(`irradiation = ${irradiation}`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  try {
    const query = `SELECT * FROM plant_data ${whereClause}`;
    const dbResults = await dbClient.query(query);
    results.push(...dbResults.rows);
  } catch (err) {
    console.error("Error querying PostgreSQL:", err);
  }

  // If no results from the database, check CSV file
  if (results.length === 0) {
    // fs.createReadStream(path.join(__dirname, "data", "plant_data.csv"))
    //   .pipe(csv())
    //   .on("data", (row) => {
    //     if (
    //       (!start_time || new Date(row.date_time) >= new Date(start_time)) &&
    //       (!end_time || new Date(row.date_time) <= new Date(end_time)) &&
    //       (!ambient_temp || parseFloat(row.ambient_temperature) === parseFloat(ambient_temp)) &&
    //       (!module_temp || parseFloat(row.module_temperature) === parseFloat(module_temp)) &&
    //       (!irradiation || parseFloat(row.irradiation) === parseFloat(irradiation))
    //     ) {
    //       results.push(row);
    //     }
    //   })
    //   .on("end", () => {
    //     res.render("results", { data: results });
    //   });
    console.log("No results from PostgreSQL. Checking CSV file...");
  } else {
    res.render("results", { data: results });
    console.log("Results from PostgreSQL:", results);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
