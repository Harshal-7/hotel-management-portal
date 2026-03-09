import * as hotelService from '../services/hotelService.js';
import db from '../db.js';

export function list(req, res) {
  const hotels = hotelService.getAll();
  res.json(hotels);
}

export function getById(req, res) {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid hotel id' });
  }
  const hotel = hotelService.getById(id);
  if (!hotel) {
    return res.status(404).json({ error: 'Hotel not found' });
  }
  res.json(hotel);
}

export function create(req, res) {
  const { name, address, errors } = hotelService.validateHotelBody(req.body);
  if (errors.length) {
    return res.status(400).json({ error: errors.join('; ') });
  }
  const hotel = hotelService.create(name, address);
  res.status(201).json(hotel);
}

export function update(req, res) {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid hotel id' });
  }
  const existing = hotelService.getById(id);
  if (!existing) {
    return res.status(404).json({ error: 'Hotel not found' });
  }
  const { name, address, errors } = hotelService.validateHotelBody(req.body);
  if (errors.length) {
    return res.status(400).json({ error: errors.join('; ') });
  }
  const hotel = hotelService.update(id, name, address);
  res.json(hotel);
}

export function remove(req, res) {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid hotel id' });
  }
  const deleted = hotelService.remove(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Hotel not found' });
  }
  res.status(204).send();
}