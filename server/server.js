require("https").globalAgent.options.ca = require("ssl-root-cas").create();
const express = require("express");
const app = express();
const sql = require("mssql");

const dbConfig = {
  user: "hidden",
  password: "hidden",
  server: "hidden",
  database: "hidden",
  options: {
    trustServerCertificate: true, // change to false for prod
  },
};

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.get("/api/table", async (req, res) => {
  try {
    const pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();
    const result = await pool.request().query("SELECT * FROM myTable");
    const data = result.recordset;
    console.log("Data fetched successfully:", data);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data from database!");
  }
});

app.post("/api/table", async (req, res) => {
  console.log("Received data:", req.body);
  const data = req.body.data;
  const pool = new sql.ConnectionPool(dbConfig);
  await pool.connect();

  try {
    for (const row of data) {
      console.log("Inserting row:", row);
      await pool
        .request()
        .input("column1", sql.VarChar, row.column1)
        .input("column2", sql.VarChar, row.column2)
        .input("column3", sql.VarChar, row.column3)
        .query(
          "INSERT INTO myTable (column1, column2, column3) VALUES (@column1, @column2, @column3)"
        );
    }
    console.log("Data inserted successfully!");
    res.send("Data inserted successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error inserting data into database!");
  }
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
