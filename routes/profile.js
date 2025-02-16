const express = require("express");
const pool = require("../db");
const checkJwt = require("../middleware/auth");

const router = express.Router();

// ✅ Get User Profile (Includes Role Check)
router.get("/:userId", checkJwt, async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);

    if (result.rows.length > 0) {
      const user = result.rows[0];

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || null, // If role is null, user is in waiting status
        profile_picture: user.profile_picture,
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ Update User Profile (General Info)
router.put("/:userId", checkJwt, async (req, res) => {
  const { userId } = req.params;
  const { name, profile_picture } = req.body;

  try {
    await pool.query(
      "UPDATE users SET name = $1, profile_picture = $2 WHERE id = $3",
      [name, profile_picture, userId]
    );
    res.json({ message: "Profile updated successfully!" });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ Admin Assigns Role to Waiting Users
router.put("/assign-role/:userId", checkJwt, async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  try {
    if (!["admin", "teacher", "student"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    await pool.query("UPDATE users SET role = $1 WHERE id = $2", [role, userId]);
    res.json({ message: `User role updated to ${role}` });
  } catch (err) {
    console.error("Error assigning role:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
