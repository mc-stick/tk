import { pool } from "../conn/dbconf.js";
import bcrypt from "bcrypt";

export const getEmployees = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.*, p.nombre AS puesto_nombre,
        GROUP_CONCAT(r.name SEPARATOR ',') AS roles
      FROM employees e
      LEFT JOIN employee_roles er ON e.employee_id = er.employee_id
      LEFT JOIN roles r ON er.role_id = r.role_id
      LEFT JOIN puesto p ON e.puesto_id = p.id
      GROUP BY e.employee_id
      ORDER BY e.employee_id;
    `);

    res.json(rows);
  } catch (err) {
    console.error("Error listando empleados:", err);
    res.status(500).json({ error: "Error al obtener empleados" });
  }
};

export const getEmployeeById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      `
      SELECT e.*, p.nombre AS puesto_nombre,
        GROUP_CONCAT(r.name SEPARATOR ',') AS roles,
        GROUP_CONCAT(r.role_id SEPARATOR ',') AS role_ids
      FROM employees e
      LEFT JOIN employee_roles er ON e.employee_id = er.employee_id
      LEFT JOIN roles r ON er.role_id = r.role_id
      LEFT JOIN puesto p ON e.puesto_id = p.id
      WHERE e.employee_id = ?
      GROUP BY e.employee_id;
      `,
      [id]
    );

    res.json(rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener empleado" });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const { username, password, full_name, puesto_id, roles } = req.body;

    const passHash = await bcrypt.hash(password, 10);

    const [rows] = await pool.query(
      `CALL sp_add_employee(?, ?, ?, ?)`,
      [username, passHash, full_name, puesto_id]
    );

    const newId = rows[0][0].new_employee_id;
    const parsedRoles = Array.isArray(roles)
      ? roles
      : roles.split(",").map((x) => x.trim());

    for (const roleId of parsedRoles) {
      await pool.query(`CALL sp_add_employee_role(?, ?)`, [newId, roleId]);
    }

    res.json({ message: "Empleado creado", id: newId });
  } catch (err) {
    console.error("Error creando empleado:", err);
    res.status(500).json({ error: "Error al crear empleado" });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, full_name, puesto_id, is_active, roles } =
      req.body;

    let hashed = null;
    if (password) hashed = await bcrypt.hash(password, 10);

    await pool.query(
      `CALL sp_update_employee(?, ?, ?, ?, ?, ?)`,
      [id, username, full_name, puesto_id, is_active, hashed]
    );

    await pool.query(`DELETE FROM employee_roles WHERE employee_id = ?`, [id]);

    const parsedRoles = Array.isArray(roles)
      ? roles
      : roles.split(",").map((r) => r.trim());

    for (const roleId of parsedRoles) {
      await pool.query(`CALL sp_add_employee_role(?, ?)`, [id, roleId]);
    }

    res.json({ message: "Empleado actualizado" });
  } catch (err) {
    console.error("Error actualizando empleado:", err);
    res.status(500).json({ error: "Error al actualizar empleado" });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(`CALL sp_delete_employee(?)`, [id]);

    res.json({ message: "Empleado eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar empleado" });
  }
};
