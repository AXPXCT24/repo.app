import db from "../db.js";

export const getVehicle = async (req, res) => {
  try {
    db.all("SELECT * FROM Vehicle_details", [], (err, rows) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      res.status(200).json(rows);
    });
  } catch (e) {
    res.status(500).json({ message: "An unexpected message occurred" });
  }
};

export const getVehicleDetails = async (req, res) => {
  const { plate_number } = req.query;

  if (!plate_number) {
    return res.status(400).json({ message: "Unresolved params, cannot get." });
  }

  try {
    db.all(
      "SELECT * FROM Vehicle_details WHERE plate_number = ? OR plate_number LIKE ?",
      [plate_number, `${plate_number}%`],
      function (err, rows) {
        if (err) {
          return res.status(500).json({ message: err.message });
        }
        if (!rows.length === 0) {
          return res.status(404).json({ message: "Vehicle not found" });
        }
        res.status(200).json(rows);
      }
    );
  } catch (e) {}
};

export const addVehicleDetails = async (req, res) => {
  const { vehicle_model, plate_number, color, supervisor } = req.body;
  try {
    db.run(
      "INSERT INTO Vehicle_details (vehicle_model, plate_number, color, supervisor)" +
        "VALUES (?, ?, ?, ?)",
      [vehicle_model, plate_number, color, supervisor],
      function (err) {
        if (err) {
          return res.status(500).json({ message: err.message });
        }
        res.status(201).json({
          message: true,
          response: `vehicle: ${vehicle_model} successfully inserted to database`
        });
      }
    );
  } catch (e) {
    res.status(500).json({ message: "An unexpected message occurred" });
  }
};

export const deleteVehicleEntry = async (req, res) => {
  const { plate_number } = req.params;

  if (!plate_number) {
    return res
      .status(400)
      .json({ message: "Unresolved params, cannot delete." });
  }

  try {
    db.run(
      "DELETE FROM Vehicle_details WHERE plate_number = ?",
      [plate_number],
      function (err) {
        if (err) {
          return res.status(500).json({ message: "Internal server error" });
        }
        if (this.changes === 0) {
          return res.status(404).json({ error: "Vehicle not found" });
        }
        res.status(204).send();
      }
    );
  } catch (e) {
    res.status(500).json({ message: "An unexpected message occurred" });
  }
};
