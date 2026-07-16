const express = require('express');
const router = express.Router();
const { getDb, saveDb } = require('../db');

router.get('/', (req, res) => {
  try {
    const db = getDb();
    res.json({ success: true, data: db.methods });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/active', (req, res) => {
  try {
    const db = getDb();
    res.json({ success: true, data: db.methods.filter(m => m.is_active === 1) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const db = getDb();
    const method = db.methods.find(m => m.id === parseInt(req.params.id));
    if (!method) return res.status(404).json({ success: false, message: 'طريقة الدفع غير موجودة' });
    res.json({ success: true, data: method });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', (req, res) => {
  try {
    const { name, type, is_active, sort_order, settings } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'اسم طريقة الدفع مطلوب' });
    }
    const db = getDb();
    const newMethod = {
      id: db.nextId,
      name: name.trim(),
      type: type || 'bank_transfer',
      is_active: is_active !== undefined ? (is_active ? 1 : 0) : 1,
      sort_order: sort_order || 0,
      settings: settings || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    db.methods.push(newMethod);
    db.nextId++;
    saveDb(db);
    res.status(201).json({ success: true, data: newMethod });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const db = getDb();
    const index = db.methods.findIndex(m => m.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ success: false, message: 'طريقة الدفع غير موجودة' });

    const existing = db.methods[index];
    const { name, type, is_active, sort_order, settings } = req.body;

    db.methods[index] = {
      ...existing,
      name: name !== undefined ? name.trim() : existing.name,
      type: type || existing.type,
      is_active: is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active,
      sort_order: sort_order !== undefined ? sort_order : existing.sort_order,
      settings: settings !== undefined ? settings : existing.settings,
      updated_at: new Date().toISOString()
    };
    saveDb(db);
    res.json({ success: true, data: db.methods[index] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/:id/toggle', (req, res) => {
  try {
    const db = getDb();
    const index = db.methods.findIndex(m => m.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ success: false, message: 'طريقة الدفع غير موجودة' });
    db.methods[index].is_active = db.methods[index].is_active ? 0 : 1;
    db.methods[index].updated_at = new Date().toISOString();
    saveDb(db);
    res.json({ success: true, data: db.methods[index] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const db = getDb();
    const index = db.methods.findIndex(m => m.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ success: false, message: 'طريقة الدفع غير موجودة' });
    db.methods.splice(index, 1);
    saveDb(db);
    res.json({ success: true, message: 'تم حذف طريقة الدفع بنجاح' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
