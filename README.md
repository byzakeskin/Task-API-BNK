# TaskFlow — Görev Yönetimi

Full-stack task yönetimi uygulaması. Node.js + Express + MongoDB + JWT Auth.

## Özellikler

- JWT kimlik doğrulama (register/login)
- Her kullanıcı sadece kendi görevlerini görür
- Admin girişi yapınca tüm kullanıcıların görevlerini görür
- Görev oluşturma, düzenleme, silme
- Durum: Bekliyor / Devam Ediyor / Tamamlandı
- Öncelik: Düşük / Orta / Yüksek
- Filtreleme ve arama
- Swagger API dökümantasyonu
- Modern dark UI, responsive tasarım

## Kurulum

### 1. Bağımlılıkları yükle
```bash
npm install
```

### 2. .env dosyasını oluştur
```bash
cp .env.example .env
```
`.env` içindeki `JWT_SECRET` değerini değiştirin.

### 3. MongoDB'nin çalıştığından emin ol
```bash
# Local MongoDB varsa
mongod
```

### 4. Sunucuyu başlat
```bash
npm run dev      # geliştirme (nodemon)
npm start        # production
```

### 5. Tarayıcıda aç
```
http://localhost:3000        → Frontend
http://localhost:3000/api-docs → Swagger UI
```

## Admin Hesabı Oluşturma

Normal kayıt ile oluşturulan hesaplar `role: "user"` olarak kaydedilir.
Admin yapmak için MongoDB'den manuel güncelleme:

```js
// MongoDB Shell veya Compass'ta:
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## Proje Yapısı

```
task-manager/
├── backend/
│   ├── server.js
│   └── src/
│       ├── config/db.js
│       ├── middleware/auth.js
│       ├── models/User.js, Task.js
│       ├── routes/authRoutes.js, taskRoutes.js
│       └── swagger.js
├── frontend/
│   └── index.html
├── .env.example
├── .gitignore
└── package.json
```

## API Endpointleri

| Method | URL | Açıklama | Auth |
|--------|-----|----------|------|
| POST | /api/auth/register | Kayıt | ❌ |
| POST | /api/auth/login | Giriş | ❌ |
| GET | /api/auth/me | Profil | ✅ |
| GET | /api/auth/users | Tüm kullanıcılar | ✅ Admin |
| POST | /api/tasks | Görev oluştur | ✅ |
| GET | /api/tasks | Görevleri listele | ✅ |
| GET | /api/tasks/:id | Tek görev | ✅ |
| PUT | /api/tasks/:id | Güncelle | ✅ |
| DELETE | /api/tasks/:id | Sil | ✅ |

## GitHub'a Yükleme

```bash
git init
git add .
git commit -m "initial commit: task manager with JWT auth"
git remote add origin https://github.com/KULLANICI_ADIN/task-manager.git
git branch -M main
git push -u origin main
```
