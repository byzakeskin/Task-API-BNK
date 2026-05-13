const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT doğrulama — tüm korumalı route'larda kullanılır
const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ message: 'Yetkisiz: Token bulunamadı' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Kullanıcı bulunamadı' });
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') return res.status(401).json({ message: 'Geçersiz token' });
    if (error.name === 'TokenExpiredError') return res.status(401).json({ message: 'Token süresi dolmuş' });
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Sadece admin rolüne sahip kullanıcıların erişebileceği route'lar için
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Bu işlem için admin yetkisi gereklidir' });
  }
  next();
};

module.exports = { protect, adminOnly };
