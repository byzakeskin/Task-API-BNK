const express = require('express');
const Task = require('../models/Task');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Yeni görev oluştur
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               status: { type: string, enum: [pending, in-progress, done] }
 *               priority: { type: string, enum: [low, medium, high] }
 *     responses:
 *       201: { description: Görev oluşturuldu }
 */
router.post('/', async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;
    const task = await Task.create({ title, description, status, priority, user: req.user._id });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Görevleri listele (admin hepsini, user sadece kendinkini görür)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [pending, in-progress, done] }
 *       - in: query
 *         name: priority
 *         schema: { type: string, enum: [low, medium, high] }
 *       - in: query
 *         name: userId
 *         schema: { type: string }
 *         description: Sadece admin kullanabilir — belirli kullanıcının task'larını filtreler
 *     responses:
 *       200: { description: Görev listesi }
 */
router.get('/', async (req, res) => {
  try {
    const filter = {};

    if (req.user.role === 'admin') {
      // Admin: userId query param ile filtreleyebilir, yoksa hepsini döner
      if (req.query.userId) filter.user = req.query.userId;
    } else {
      // Normal kullanıcı: sadece kendi task'larını görür
      filter.user = req.user._id;
    }

    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;

    const tasks = await Task.find(filter)
      .populate('user', 'name email') // task sahibinin adı ve emailini de getir
      .sort({ createdAt: -1 });

    res.json({ count: tasks.length, tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Tek görev getir
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Görev }
 *       404: { description: Bulunamadı }
 */
router.get('/:id', async (req, res) => {
  try {
    const query = { _id: req.params.id };
    if (req.user.role !== 'admin') query.user = req.user._id;

    const task = await Task.findOne(query).populate('user', 'name email');
    if (!task) return res.status(404).json({ message: 'Görev bulunamadı' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Görevi güncelle
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               status: { type: string }
 *               priority: { type: string }
 *     responses:
 *       200: { description: Güncellendi }
 *       404: { description: Bulunamadı }
 */
router.put('/:id', async (req, res) => {
  try {
    const query = { _id: req.params.id };
    if (req.user.role !== 'admin') query.user = req.user._id;

    const { title, description, status, priority } = req.body;
    const task = await Task.findOneAndUpdate(
      query,
      { title, description, status, priority },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: 'Görev bulunamadı' });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Görevi sil
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Silindi }
 *       404: { description: Bulunamadı }
 */
router.delete('/:id', async (req, res) => {
  try {
    const query = { _id: req.params.id };
    if (req.user.role !== 'admin') query.user = req.user._id;

    const task = await Task.findOneAndDelete(query);
    if (!task) return res.status(404).json({ message: 'Görev bulunamadı' });
    res.json({ message: 'Görev başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
