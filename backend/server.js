const express = require("express");
const { open } = require("sqlite");
const path = require("path");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
const JWT_SECRET = "MY_SECRET_KEY";

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "maintenance.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({ filename: dbPath, driver: sqlite3.Database });

    await db.exec(
      `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      name TEXT, 
      email TEXT UNIQUE, 
      password TEXT, 
      role TEXT
      )
    `
    );

    await db.exec(
      `CREATE TABLE IF NOT EXISTS maintenance_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      title TEXT, 
      description TEXT, 
      priority TEXT, 
      status TEXT, 
      user_id INTEGER, 
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `
    );

    const authenticateToken = (req, res, next) => {
      const authHeader = req.headers["authorization"];

      if (!authHeader) {
        return res.status(401).json({ error: "Missing token" });
      }

      const token = authHeader.split(" ")[1];

      jwt.verify(token, JWT_SECRET, (error, payload) => {
        if (error) {
          return res.status(401).json({ error: "Invalid token" });
        }

        req.user = payload;
        next();
      });
    };

    app.post("/register", async (req, res) => {
      const { name, password, email, role } = req.body;

      if (!name || !password || !email || !role) {
        return res.status(400).json({ error: "All fields required" });
      }

      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.run(
          `INSERT INTO users 
            (name, email, password, role)
          VALUES (?, ?, ?, ?)`,
          [name, email, hashedPassword, role]
        );
        res.status(201).json("User created successfully");
      } catch (e) {
        res.status(400).json("User already registered");
      }
    });

    app.post("/login", async (req, res) => {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and Password required" });
      }

      try {
        const user = await db.get(`SELECT * FROM users WHERE email = ?`, [
          email,
        ]);

        if (!user) {
          return res.status(400).json({ error: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
          { userId: user.id, role: user.role },
          JWT_SECRET,
          { expiresIn: "1d" }
        );

        res.status(200).json({ token });
      } catch (e) {
        res.status(500).json({ error: "Login failed" });
      }
    });

    app.get("/profile", authenticateToken, async (req, res) => {
      const { userId } = req.user;

      const user = await db.get(
        `SELECT id, name, email, role FROM users WHERE id = ?`,
        [userId]
      );

      res.status(200).json(user);
    });

    app.post("/requests", authenticateToken, async (req, res) => {
      const { title, description, priority } = req.body;
      const { userId } = req.user;

      if (!title || !description || !priority) {
        return res.status(400).json({ error: "All fields required" });
      }

      await db.run(
        `INSERT INTO maintenance_requests 
            (title, description, priority, status, user_id)
        VALUES (?, ?, ?, ?, ?)`,
        [title, description, priority, "pending", userId]
      );

      res.status(201).json({ message: "Request created" });
    });

    app.get("/requests", authenticateToken, async (req, res) => {
      const { userId, role } = req.user;

      try {
        let query = "";

        if (role === "tenant") {
          query = `
            SELECT * FROM maintenance_requests
            WHERE user_id = ?
            ORDER BY created_at DESC
          `;
          const data = await db.all(query, [userId]);
          return res.status(200).json(data);
        }

        query = `
            SELECT * FROM maintenance_requests
            ORDER BY created_at DESC
        `;
        const data = await db.all(query);
        res.status(200).json(data);
      } catch (e) {
        res.status(500).json({ error: "Failed to fetch requests" });
      }
    });

    app.get("/requests/:id", authenticateToken, async (req, res) => {
      const { id } = req.params;
      const { userId, role } = req.user;

      const query =
        role === "tenant"
          ? `SELECT * FROM maintenance_requests WHERE id = ? AND user_id = ?`
          : `SELECT * FROM maintenance_requests WHERE id = ?`;

      const params = role === "tenant" ? [id, userId] : [id];

      const request = await db.get(query, params);

      if (!request) {
        return res.status(404).json({ error: "Request Not Found" });
      }

      res.json(request);
    });

    app.put("/requests/:id/status", authenticateToken, async (req, res) => {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ error: "Status required" });
      }

      const result = await db.run(
        `UPDATE maintenance_requests
     SET status = ?
     WHERE id = ?`,
        [status, id]
      );

      if (result.changes === 0) {
        return res.status(404).json({ error: "Request not found" });
      }

      res.status(200).json({ message: "Status updated successfully" });
    });

    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();
