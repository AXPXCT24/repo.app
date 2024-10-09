import db from "../db.js";
import bcrypt from "bcrypt";
import cookie from "cookie";

export const authUser = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username or password is required" });
  }

  db.get("SELECT * FROM User WHERE username = ?", [username], (err, user) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (!user) {
      return res
        .status(404)
        .json({ message: "Username does not match. Please try again" });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password." });
      }

      const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000);
      db.run(
        "INSERT INTO Session (username, expires_at) VALUES (?, ?)",
        [username, expiresAt],
        (err) => {
          if (err) {
            return res.status(500).json({ message: err.message });
          }
          res.setHeader(
            "Set-Cookie",
            cookie.serialize("username", username, {
              httpOnly: true,
              maxAge: 3 * 60 * 60,
              path: "/",
            })
          );
          res.setHeader(
            "Set-Cookie",
            cookie.serialize("authority", user.authority, {
              httpOnly: true,
              maxAge: 3 * 60 * 60,
              path: "/",
            })
          );

          return res.status(200).json({
            auth: true,
            user: { username: user.username, authority: user.authority },
          });
        }
      );
    });
  });
};

export const logoutUser = (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  db.run("DELETE FROM Session WHERE username = ?", [username], (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("username", "", {
        httpOnly: true,
        maxAge: 0,
        path: "/",
      })
    );
    return res
      .status(200)
      .json({ auth: false, message: "Logged out successfully" });
  });
};

export const sessionAuth = (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(500).json({ auth: false });
  }

  db.get(
    "SELECT * FROM Session WHERE username = ?",
    [username],
    (err, session) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (!session) {
        return res
          .status(401)
          .json({ auth: false, message: "Session expired" });
      }

      const now = new Date();
      if (new Date(session.expires_at) < now) {
        return res
          .status(401)
          .json({ auth: false, message: "Session expired" });
      }

      return res.status(200).json({ auth: true, message: "Session is valid" });
    }
  );
};
