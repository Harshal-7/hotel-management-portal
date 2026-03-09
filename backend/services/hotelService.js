import db from '../db.js';

export function validateHotelBody(body) {
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const address = typeof body?.address === 'string' ? body.address.trim() : '';
  const errors = [];
  if (!name) errors.push('name is required');
  if (!address) errors.push('address is required');
  return { name, address, errors };
}

export function getAll() {
  return db.prepare('SELECT id, name, address FROM hotels ORDER BY id').all();
}

export function getById(id) {
  return db.prepare('SELECT id, name, address FROM hotels WHERE id = ?').get(id);
}

export function create(name, address) {
  const result = db.prepare('INSERT INTO hotels (name, address) VALUES (?, ?)').run(name, address);
  return getById(Number(result.lastInsertRowid));
}

export function update(id, name, address) {
  db.prepare('UPDATE hotels SET name = ?, address = ? WHERE id = ?').run(name, address, id);
  return getById(id);
}

export function remove(id) {
  const result = db.prepare('DELETE FROM hotels WHERE id = ?').run(id);
  return result.changes > 0;
}
