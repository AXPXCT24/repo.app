import db from "../db.js";

export const getAllLogs = async (req, res) => {
  try {
    db.get("SELECT * FROM SystemLogs", [], function (err, rows) {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      res.status(200).json(rows);
    });
  } catch (e) {
    res.status(500).json({ message: "An unexpected message occurred" });
  }
};

export const getSystemLog = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "SystemLog ID is required. Please send a request again.",
    });
  }

  try {
    db.get("SELECT * FROM SystemLogs WHERE id = ?", [id], function (err) {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (!row) {
        return res.status(404).json({ message: "System Log not found" });
      }
      res.status(200).json(rows);
    });
  } catch (e) {
    res.status(500).json({ message: "An unexpected message occurred" });
  }
};

export const addSystemLog = async (req, res) => {
  const { user, action } = req.body;

  if (!user || !action) {
    return res.status(400).json({
      message:
        "User or Action is required for system logs. Please send a request again.",
    });
  }

  try {
    db.run(
      "INSERT INTO SystemLogs(user, action) VALUES(?, ?)",
      [user, action],
      function (err) {
        if (err) {
          return res.status(500).json({ message: err.message });
        }
        res.status(201).json({
          message: `SystemLog: ${action} successfully inserted to database`,
        });
      }
    );
  } catch (e) {
    res.status(500).json({ message: "An unexpected message occurred" });
  }
};
