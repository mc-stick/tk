import { pool } from "../conn/dbconf.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key_change_this";

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: "Usuario y contraseña requeridos" });

  try {
    const [rows] = await pool.query(
      `
      SELECT 
        e.employee_id,
        e.username,
        e.password_hash,
        e.full_name,
        e.is_active,
        e.puesto_id,
        p.nombre AS puesto_name,
        GROUP_CONCAT(r.name SEPARATOR ',') AS roles
      FROM employees e
      LEFT JOIN puesto p ON e.puesto_id = p.id
      LEFT JOIN employee_roles er ON e.employee_id = er.employee_id
      LEFT JOIN roles r ON er.role_id = r.role_id
      WHERE e.username = ?
      GROUP BY e.employee_id
      LIMIT 1;
      `,
      [username]
    );

    if (rows.length === 0)
      return res.status(401).json({ error: "Credenciales incorrectas" });

    const user = rows[0];

    if (!user.is_active)
      return res.status(403).json({ error: "Usuario desactivado" });

    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid)
      return res.status(401).json({ error: "Credenciales incorrectas" });

    if (user.puesto_id === 1 && !user.roles.includes("admin"))
      return res.status(403).json({ error: "No tienes un puesto asignado" });

    const payload = {
      employee_id: user.employee_id,
      username: user.username,
      full_name: user.full_name,
      puesto_id: user.puesto_id,
      puesto_name: user.puesto_name,
      roles: user.roles.split(","),
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });

    res.json({ token, user: payload });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
