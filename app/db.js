import sqlite3 from "sqlite3";
import path from "path";

sqlite3.verbose();
const db = new sqlite3.Database(
  path.join(process.cwd(), "repossession.db"),
  (err) => {
    if (err) {
      console.error("Error opening database " + err.message);
    } else {
      console.log("Connected to the database.");

      db.serialize(() => {
        db.run(
          `CREATE TABLE IF NOT EXISTS User (
            username TEXT PRIMARY KEY NOT NULL UNIQUE,
            password TEXT NOT NULL,
            authority BOOLEAN NOT NULL DEFAULT 0
          )`,
          (err) => {
            if (err) {
              console.error("Error in creating table: ", err.message);
            } else {
              console.log("Table User initialized");
            }
          }
        );
        db.run(
          `CREATE TABLE IF NOT EXISTS Vehicle_details (
            vehicle_model TEXT NOT NULL,
            plate_number TEXT PRIMARY KEY NOT NULL UNIQUE,
            color TEXT NOT NULL,
            supervisor TEXT NOT NULL
          )`,
          (err) => {
            if (err) {
              console.error("Error in creating table: ", err.message);
            } else {
              console.log("Table Vehicle_details initialized");
            }
          }
        );
        db.run(
          `CREATE TABLE IF NOT EXISTS SystemLogs (
            log_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user TEXT NOT NULL,
            action TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user) REFERENCES User(username)
          )`,
          (err) => {
            if (err) {
              console.error("Error creating SystemLogs table:", err.message);
            } else {
              console.log("SystemLogs table initialized.");
            }
          }
        );
        db.run(
          `CREATE TABLE IF NOT EXISTS Session (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expires_at TIMESTAMP,
            FOREIGN KEY (username) REFERENCES User(username)
          )`,
          (err) => {
            if (err) {
              console.error("Error initializing table: ", err.message);
            } else {
              console.log("Session table initialized.");
            }
          }
        );
      });
    }
  }
);

export default db;
