import db from "../db.js";
import bcrypt from "bcrypt";

export const getAllUser = async (req, res) => {
  try {
    db.all("SELECT * FROM User", [], function (err, rows) {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (!rows.length === 0) {
        return res.status(404).json({ message: "No user found" });
      }
      res.status(200).json(rows);
    });
  } catch (e) {
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

export const createUser = async (req, res) => {
  const { username, password, authority } = req.body;

  if (!username || !password || typeof authority !== "boolean") {
    return res.status(400).json({
      message: "All fields are required: username, password, authority",
    });
  }

  try {
    const hashedPword = await bcrypt.hash(password, 10);
    
    db.run(
      "INSERT INTO User (username, password, authority) VALUES (?, ?, ?)",
      [username, hashedPword, authority],
      function (err) {
        if (err) {
          return res.status(500).json({ message: err.message });
        }
        res.status(201).json({
          message: `user: ${username} successfully created`,
        });
      }
    );
  } catch (e) {
    res.status(500).json({ message: "An unexpected message occurred" });
  }
};

export const getUser = async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    db.all(
      "SELECT * FROM User WHERE username = ? OR username LIKE ?",
      [username, `${username}%`],
      function (err, rows) {
        if (err) {
          return res.status(500).json({ message: err.message });
        }
        if (!rows.length === 0) {
          return res.status(404).json({ message: "No ser found" });
        }
        return res.status(200).json(rows);
      }
    );
  } catch (e) {
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

export const deleteUser = async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    db.run("DELETE FROM User WHERE username = ? ", [username], function (err) {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(204).send();
    });
  } catch (e) {
    res.status(500).json({ message: "An unexpected message occurred" });
  }
};
