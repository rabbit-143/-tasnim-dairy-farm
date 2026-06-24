// Database helper - works with both PostgreSQL and SQLite
const { pool, db, usePg, saveSQLite } = require('./database');

// Get the database instance
function getDb() {
  if (usePg) {
    return pool;
  } else {
    return db;
  }
}

// Query helper that works with both databases
async function query(sql, params = []) {
  if (usePg) {
    // PostgreSQL
    const result = await pool.query(convertToPostgres(sql), params);
    return result.rows;
  } else {
    // SQLite
    return querySQLite(sql, params);
  }
}

// Convert SQL placeholders from ? to $1, $2, etc. for PostgreSQL
function convertToPostgres(sql) {
  let paramCount = 1;
  return sql.replace(/\?/g, () => `$${paramCount++}`);
}

// SQLite query helper
function querySQLite(sql, params = []) {
  try {
    if (!sql.trim().toUpperCase().startsWith('SELECT')) {
      // INSERT, UPDATE, DELETE
      db.run(sql, params);
      saveSQLite();
      return [];
    }

    // SELECT query
    const result = db.exec(sql);
    if (result.length === 0) return [];

    const columns = result[0].columns;
    return result[0].values.map(row => {
      const obj = {};
      columns.forEach((col, i) => {
        obj[col] = row[i];
      });
      return obj;
    });
  } catch (error) {
    console.error('SQLite query error:', error);
    throw error;
  }
}

// Run a command (INSERT, UPDATE, DELETE)
async function run(sql, params = []) {
  if (usePg) {
    await pool.query(convertToPostgres(sql), params);
  } else {
    db.run(sql, params);
    saveSQLite();
  }
}

// Get one row
async function getOne(sql, params = []) {
  const results = await query(sql, params);
  return results.length > 0 ? results[0] : null;
}

// Get all rows
async function getAll(sql, params = []) {
  return await query(sql, params);
}

// Get by ID for a specific table
function getById(table, id) {
  if (usePg) {
    return pool.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
  } else {
    const result = db.exec(`SELECT * FROM ${table} WHERE id = ?`, [id]);
    if (result.length === 0 || result[0].values.length === 0) return { values: [[]] };
    return result;
  }
}

// Check if record exists by ID
function existsById(table, id) {
  if (usePg) {
    // For PostgreSQL, we need to use async
    return pool.query(`SELECT 1 FROM ${table} WHERE id = $1 LIMIT 1`, [id]).then(r => r.rows.length > 0);
  } else {
    const result = db.exec(`SELECT 1 FROM ${table} WHERE id = ? LIMIT 1`, [id]);
    return result.length > 0 && result[0].values.length > 0;
  }
}

// Delete by ID
function deleteById(table, id) {
  if (usePg) {
    return pool.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
  } else {
    db.run(`DELETE FROM ${table} WHERE id = ?`, [id]);
    saveSQLite();
  }
}

// Save function (for SQLite)
function save() {
  if (!usePg && db) {
    saveSQLite();
  }
}

module.exports = {
  getDb,
  query,
  run,
  getOne,
  getAll,
  getById,
  existsById,
  deleteById,
  save,
  convertToPostgres
};