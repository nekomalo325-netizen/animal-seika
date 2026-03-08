---
name: security-check
description: Webサイトのセキュリティ対策を確認するためのガイドライン。XSS、CSRF、その他の脆弱性対策から、HTTPSやセキュリティヘッダーまで網羅します。
---

# セキュリティ対策チェック スキル

このスキルは、Webサイトやアプリケーションのセキュリティを確認・強化するためのガイドラインです。フロントエンドからバックエンドまで、主要なセキュリティ対策を網羅しています。

---

## ⚠️ 重要度レベル

| レベル | 説明 |
|--------|------|
| 🔴 **Critical** | 必ず対策が必要。放置すると重大な被害 |
| 🟠 **High** | 優先的に対策すべき |
| 🟡 **Medium** | 対策を推奨 |
| 🟢 **Low** | 可能であれば対策 |

---

## 🔒 1. HTTPS / SSL/TLS

### 🔴 HTTPS必須化

```apache
# .htaccess（Apache）
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

```nginx
# nginx.conf
server {
    listen 80;
    server_name example.com;
    return 301 https://$server_name$request_uri;
}
```

### 🔴 HSTS（HTTP Strict Transport Security）

ブラウザにHTTPS接続を強制させる。

```html
<!-- HTTPヘッダーで設定（推奨） -->
```

```apache
# .htaccess
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
```

```nginx
# nginx.conf
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
```

### チェックリスト

| 項目 | 重要度 | 確認 |
|-----|--------|-----|
| SSL/TLS証明書が有効か | 🔴 | □ |
| HTTPからHTTPSへリダイレクトされるか | 🔴 | □ |
| HSTSヘッダーが設定されているか | 🟠 | □ |
| 混合コンテンツ（HTTP + HTTPS）がないか | 🔴 | □ |
| TLS 1.2以上を使用しているか | 🟠 | □ |

---

## 🛡️ 2. XSS（クロスサイトスクリプティング）対策

悪意のあるスクリプトが実行されることを防ぐ。

### 🔴 ユーザー入力のエスケープ

```javascript
// ❌ 危険：直接HTMLに挿入
element.innerHTML = userInput;

// ✅ 安全：テキストとして挿入
element.textContent = userInput;

// ✅ 安全：エスケープ関数を使用
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

element.innerHTML = escapeHtml(userInput);
```

### 🔴 テンプレートリテラルの安全な使用

```javascript
// ❌ 危険
const html = `<div>${userInput}</div>`;

// ✅ 安全：タグ付きテンプレートリテラル
function safeHtml(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i - 1];
    const escaped = typeof value === 'string' 
      ? value.replace(/[&<>"']/g, char => ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        })[char])
      : value;
    return result + escaped + str;
  });
}

const html = safeHtml`<div>${userInput}</div>`;
```

### 🟠 DOMPurifyの使用（リッチテキスト）

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.6/purify.min.js"></script>
<script>
  // リッチテキストを安全にサニタイズ
  const cleanHtml = DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'title']
  });
</script>
```

### 🔴 Content Security Policy（CSP）

```html
<!-- metaタグで設定 -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' https://trusted-cdn.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
">
```

```apache
# HTTPヘッダーで設定（推奨）
Header set Content-Security-Policy "default-src 'self'; script-src 'self' https://trusted-cdn.com; style-src 'self' 'unsafe-inline';"
```

### CSPディレクティブ一覧

| ディレクティブ | 説明 |
|---------------|------|
| `default-src` | フォールバックポリシー |
| `script-src` | JavaScriptのソース |
| `style-src` | CSSのソース |
| `img-src` | 画像のソース |
| `font-src` | フォントのソース |
| `connect-src` | XHR、WebSocket等の接続先 |
| `frame-src` | iframe のソース |
| `frame-ancestors` | このページを埋め込めるサイト |
| `form-action` | フォームの送信先 |
| `base-uri` | base要素のURI |

### チェックリスト

| 項目 | 重要度 | 確認 |
|-----|--------|-----|
| ユーザー入力をエスケープしているか | 🔴 | □ |
| innerHTMLを安全に使用しているか | 🔴 | □ |
| CSPヘッダーが設定されているか | 🟠 | □ |
| インラインスクリプトを最小限にしているか | 🟠 | □ |
| eval()を使用していないか | 🔴 | □ |

---

## 🔐 3. CSRF（クロスサイトリクエストフォージェリ）対策

ユーザーの意図しないリクエストを防ぐ。

### 🔴 CSRFトークン

```html
<!-- フォームにトークンを埋め込む -->
<form action="/api/submit" method="POST">
  <input type="hidden" name="_csrf" value="ランダムなトークン">
  <input type="text" name="data">
  <button type="submit">送信</button>
</form>
```

```javascript
// サーバー側でトークンを検証
app.post('/api/submit', (req, res) => {
  if (req.body._csrf !== req.session.csrfToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  // 処理を続行
});
```

### 🔴 SameSite Cookie属性

```javascript
// Cookieに SameSite 属性を設定
res.cookie('sessionId', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'Strict' // または 'Lax'
});
```

| 値 | 説明 |
|---|------|
| `Strict` | 同一サイトからのリクエストのみCookie送信 |
| `Lax` | トップレベルナビゲーションではCookie送信（デフォルト） |
| `None` | すべてのリクエストでCookie送信（Secure必須） |

### 🟠 Originヘッダーの検証

```javascript
// リクエストの送信元を検証
app.use((req, res, next) => {
  const origin = req.headers.origin || req.headers.referer;
  const allowedOrigins = ['https://example.com', 'https://www.example.com'];
  
  if (req.method !== 'GET' && !allowedOrigins.some(o => origin?.startsWith(o))) {
    return res.status(403).json({ error: 'Invalid origin' });
  }
  next();
});
```

### チェックリスト

| 項目 | 重要度 | 確認 |
|-----|--------|-----|
| CSRFトークンを使用しているか | 🔴 | □ |
| CookieにSameSite属性があるか | 🔴 | □ |
| 重要な操作はPOST/PUT/DELETEか | 🟠 | □ |
| Originヘッダーを検証しているか | 🟡 | □ |

---

## 💉 4. インジェクション対策

### 🔴 SQLインジェクション

```javascript
// ❌ 危険：文字列連結
const query = `SELECT * FROM users WHERE email = '${userInput}'`;

// ✅ 安全：プリペアドステートメント
const query = 'SELECT * FROM users WHERE email = ?';
db.query(query, [userInput], (err, results) => {
  // ...
});

// ✅ 安全：ORMを使用
const user = await User.findOne({ where: { email: userInput } });
```

### 🔴 NoSQLインジェクション

```javascript
// ❌ 危険
db.users.find({ username: req.body.username, password: req.body.password });
// 攻撃: { "username": "admin", "password": { "$ne": "" } }

// ✅ 安全：型チェック
const username = String(req.body.username);
const password = String(req.body.password);
db.users.find({ username, password });

// ✅ 安全：mongooseのスキーマ検証
const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }
});
```

### 🔴 コマンドインジェクション

```javascript
// ❌ 危険
const exec = require('child_process').exec;
exec(`ls ${userInput}`, callback);

// ✅ 安全：引数を配列で渡す
const spawn = require('child_process').spawn;
const ls = spawn('ls', [userInput]);

// ✅ 安全：ホワイトリスト検証
const allowedCommands = ['list', 'show', 'help'];
if (!allowedCommands.includes(userInput)) {
  throw new Error('Invalid command');
}
```

### チェックリスト

| 項目 | 重要度 | 確認 |
|-----|--------|-----|
| プリペアドステートメントを使用しているか | 🔴 | □ |
| ユーザー入力を型チェックしているか | 🔴 | □ |
| シェルコマンドに入力を直接渡していないか | 🔴 | □ |
| ORMを使用しているか | 🟠 | □ |

---

## 📋 5. セキュリティヘッダー

### 推奨ヘッダー一覧

```apache
# .htaccess（Apache）

# XSS対策
Header set X-Content-Type-Options "nosniff"
Header set X-XSS-Protection "1; mode=block"

# クリックジャッキング対策
Header set X-Frame-Options "DENY"

# Referrer制御
Header set Referrer-Policy "strict-origin-when-cross-origin"

# 権限ポリシー
Header set Permissions-Policy "geolocation=(), microphone=(), camera=()"

# CSP
Header set Content-Security-Policy "default-src 'self';"

# HSTS
Header set Strict-Transport-Security "max-age=31536000; includeSubDomains"
```

```nginx
# nginx.conf

add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Frame-Options "DENY" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
add_header Content-Security-Policy "default-src 'self';" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### ヘッダー詳細

| ヘッダー | 説明 | 推奨値 |
|---------|------|--------|
| `X-Content-Type-Options` | MIMEタイプスニッフィング防止 | `nosniff` |
| `X-Frame-Options` | クリックジャッキング防止 | `DENY` または `SAMEORIGIN` |
| `X-XSS-Protection` | ブラウザのXSSフィルター | `1; mode=block` |
| `Referrer-Policy` | Referer情報の送信制御 | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | ブラウザ機能の制限 | 使用する機能のみ許可 |
| `Content-Security-Policy` | リソース読み込み制限 | サイトに応じて設定 |
| `Strict-Transport-Security` | HTTPS強制 | `max-age=31536000` |

### チェックリスト

| 項目 | 重要度 | 確認 |
|-----|--------|-----|
| X-Content-Type-Options が設定されているか | 🟠 | □ |
| X-Frame-Options が設定されているか | 🟠 | □ |
| Referrer-Policy が設定されているか | 🟡 | □ |
| Content-Security-Policy が設定されているか | 🟠 | □ |
| Strict-Transport-Security が設定されているか | 🟠 | □ |

---

## 🔑 6. 認証とセッション管理

### 🔴 パスワードの安全な保存

```javascript
// ❌ 危険：平文保存
db.users.insert({ password: userPassword });

// ❌ 危険：MD5やSHA-1
const hash = crypto.createHash('md5').update(password).digest('hex');

// ✅ 安全：bcrypt使用
const bcrypt = require('bcrypt');
const saltRounds = 12;

// ハッシュ化
const hashedPassword = await bcrypt.hash(password, saltRounds);

// 検証
const isMatch = await bcrypt.compare(inputPassword, hashedPassword);
```

### 🔴 セッション管理

```javascript
// セッション設定
app.use(session({
  secret: process.env.SESSION_SECRET, // 環境変数から取得
  name: 'sessionId', // デフォルトの 'connect.sid' を変更
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,      // HTTPS必須
    httpOnly: true,    // JavaScript からアクセス不可
    sameSite: 'strict', // CSRF対策
    maxAge: 1800000    // 30分
  }
}));

// セッション再生成（ログイン後）
req.session.regenerate((err) => {
  req.session.userId = user.id;
});
```

### 🟠 二要素認証（2FA）

```javascript
// TOTP（Time-based One-Time Password）の実装例
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// シークレット生成
const secret = speakeasy.generateSecret({ name: 'MyApp (user@email.com)' });

// QRコード生成
const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

// 検証
const verified = speakeasy.totp.verify({
  secret: secret.base32,
  encoding: 'base32',
  token: userToken
});
```

### 🔴 ブルートフォース対策

```javascript
// レート制限
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 5, // 5回まで
  message: 'ログイン試行回数が上限に達しました。15分後に再試行してください。',
  standardHeaders: true,
  legacyHeaders: false
});

app.post('/login', loginLimiter, (req, res) => {
  // ログイン処理
});

// アカウントロック
const MAX_ATTEMPTS = 5;
const LOCK_TIME = 30 * 60 * 1000; // 30分

if (user.loginAttempts >= MAX_ATTEMPTS) {
  if (Date.now() - user.lockUntil < 0) {
    return res.status(403).json({ error: 'アカウントがロックされています' });
  }
  user.loginAttempts = 0; // ロック解除
}
```

### チェックリスト

| 項目 | 重要度 | 確認 |
|-----|--------|-----|
| パスワードをbcryptでハッシュ化しているか | 🔴 | □ |
| セッションCookieにhttpOnlyがあるか | 🔴 | □ |
| セッションCookieにsecureがあるか | 🔴 | □ |
| ログイン後にセッションを再生成しているか | 🟠 | □ |
| レート制限を実装しているか | 🟠 | □ |
| 2FAを提供しているか（推奨） | 🟡 | □ |

---

## 📁 7. ファイルアップロードのセキュリティ

### 🔴 ファイルタイプの検証

```javascript
const path = require('path');
const fileType = require('file-type');

// 許可する拡張子
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
const ALLOWED_MIMETYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

async function validateFile(file) {
  // 拡張子チェック
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new Error('許可されていないファイル形式です');
  }
  
  // MIMEタイプチェック（マジックバイト）
  const type = await fileType.fromBuffer(file.buffer);
  if (!type || !ALLOWED_MIMETYPES.includes(type.mime)) {
    throw new Error('ファイルの内容が不正です');
  }
  
  // ファイルサイズチェック
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_SIZE) {
    throw new Error('ファイルサイズが大きすぎます');
  }
  
  return true;
}
```

### 🔴 安全なファイル保存

```javascript
const crypto = require('crypto');
const path = require('path');

function generateSafeFilename(originalName) {
  // ランダムなファイル名を生成
  const randomName = crypto.randomBytes(16).toString('hex');
  const ext = path.extname(originalName).toLowerCase();
  
  // 許可された拡張子のみ
  const safeExt = ALLOWED_EXTENSIONS.includes(ext) ? ext : '';
  
  return `${randomName}${safeExt}`;
}

// 保存先をWebルート外に
const UPLOAD_DIR = '/var/uploads/'; // Webからアクセス不可

// ディレクトリトラバーサル対策
const safePath = path.join(UPLOAD_DIR, path.basename(filename));
if (!safePath.startsWith(UPLOAD_DIR)) {
  throw new Error('不正なパス');
}
```

### 🟠 画像の再処理

```javascript
const sharp = require('sharp');

// アップロードされた画像を再処理（メタデータ削除、リサイズ）
async function processImage(buffer) {
  return await sharp(buffer)
    .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();
}
```

### チェックリスト

| 項目 | 重要度 | 確認 |
|-----|--------|-----|
| 拡張子をホワイトリストで検証しているか | 🔴 | □ |
| MIMEタイプ（マジックバイト）を検証しているか | 🔴 | □ |
| ファイルサイズを制限しているか | 🟠 | □ |
| ファイル名をランダム化しているか | 🟠 | □ |
| アップロードディレクトリがWebルート外か | 🔴 | □ |
| 画像を再処理しているか | 🟡 | □ |

---

## 🌐 8. サードパーティリソースの管理

### 🔴 Subresource Integrity（SRI）

```html
<!-- CDNから読み込むリソースにハッシュを指定 -->
<script 
  src="https://cdn.example.com/library.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
  crossorigin="anonymous">
</script>

<link 
  href="https://cdn.example.com/style.css"
  rel="stylesheet"
  integrity="sha384-..."
  crossorigin="anonymous">
```

### SRIハッシュの生成

```bash
# ファイルからハッシュを生成
openssl dgst -sha384 -binary library.js | openssl base64 -A

# または
shasum -b -a 384 library.js | awk '{ print $1 }' | xxd -r -p | base64
```

### 🟠 依存関係の管理

```bash
# 脆弱性チェック
npm audit

# 自動修正
npm audit fix

# 本番用のみチェック
npm audit --production
```

```json
// package.json - 依存関係のバージョン固定
{
  "dependencies": {
    "express": "4.18.2",  // 正確なバージョン指定
    "lodash": "^4.17.21" // キャレット（マイナーアップデート許可）
  }
}
```

### チェックリスト

| 項目 | 重要度 | 確認 |
|-----|--------|-----|
| CDNリソースにSRIを設定しているか | 🟠 | □ |
| npm auditで脆弱性をチェックしているか | 🟠 | □ |
| 依存関係のバージョンを固定しているか | 🟡 | □ |
| 不要な依存関係を削除しているか | 🟡 | □ |

---

## 🔏 9. 機密情報の保護

### 🔴 環境変数の使用

```javascript
// ❌ 危険：ハードコード
const API_KEY = 'sk-1234567890abcdef';
const DB_PASSWORD = 'password123';

// ✅ 安全：環境変数
const API_KEY = process.env.API_KEY;
const DB_PASSWORD = process.env.DB_PASSWORD;

// .env ファイル（.gitignoreに追加必須）
// API_KEY=sk-1234567890abcdef
// DB_PASSWORD=password123
```

### 🔴 .gitignoreの設定

```gitignore
# 環境変数
.env
.env.local
.env.production

# 秘密鍵
*.pem
*.key
private/

# 設定ファイル
config/secrets.js
config/production.js

# ログ
logs/
*.log

# OS生成ファイル
.DS_Store
Thumbs.db
```

### 🔴 フロントエンドでの機密情報

```javascript
// ❌ 危険：フロントエンドにAPIキーを含める
const apiKey = 'sk-secret-key';
fetch(`https://api.example.com?key=${apiKey}`);

// ✅ 安全：バックエンドを経由
fetch('/api/proxy', {
  method: 'POST',
  body: JSON.stringify(data)
});

// バックエンド
app.post('/api/proxy', (req, res) => {
  const apiKey = process.env.API_KEY; // サーバー側で管理
  // APIリクエスト
});
```

### 🟠 エラー情報の制限

```javascript
// ❌ 危険：詳細なエラーを返す
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message,
    stack: err.stack, // スタックトレースを公開
    query: req.query  // リクエスト情報を公開
  });
});

// ✅ 安全：本番環境では最小限の情報
app.use((err, req, res, next) => {
  console.error(err); // ログには記録
  
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.status(500).json({
    error: isProduction ? 'サーバーエラーが発生しました' : err.message,
    ...(isProduction ? {} : { stack: err.stack })
  });
});
```

### チェックリスト

| 項目 | 重要度 | 確認 |
|-----|--------|-----|
| APIキーを環境変数で管理しているか | 🔴 | □ |
| .envファイルが.gitignoreに含まれているか | 🔴 | □ |
| フロントエンドに機密情報がないか | 🔴 | □ |
| 本番環境でスタックトレースを隠しているか | 🟠 | □ |
| ソースコードに秘密情報がないか | 🔴 | □ |

---

## 🔗 10. 外部リンクのセキュリティ

### 🔴 rel="noopener noreferrer"

```html
<!-- 外部リンクにセキュリティ属性を追加 -->
<a href="https://external-site.com" target="_blank" rel="noopener noreferrer">
  外部サイト
</a>
```

| 属性 | 説明 |
|-----|------|
| `noopener` | 新しいウィンドウから`window.opener`へのアクセスを防ぐ |
| `noreferrer` | Refererヘッダーを送信しない |

### JavaScript での動的リンク

```javascript
// 外部リンクに自動で属性を追加
document.querySelectorAll('a[target="_blank"]').forEach(link => {
  if (link.hostname !== window.location.hostname) {
    link.setAttribute('rel', 'noopener noreferrer');
  }
});
```

---

## ✅ セキュリティチェックリスト（総合）

### 必須（🔴 Critical）

- [ ] HTTPS を使用している
- [ ] ユーザー入力をエスケープしている
- [ ] SQLインジェクション対策済み
- [ ] パスワードをbcryptでハッシュ化
- [ ] セッションCookieにhttpOnly/secure設定
- [ ] CSRFトークンを使用
- [ ] ファイルアップロードを検証
- [ ] 機密情報を環境変数で管理
- [ ] .gitignore が適切に設定

### 高優先度（🟠 High）

- [ ] HSTS ヘッダー設定
- [ ] CSP ヘッダー設定
- [ ] X-Content-Type-Options 設定
- [ ] X-Frame-Options 設定
- [ ] レート制限を実装
- [ ] SRI を使用
- [ ] npm audit でチェック

### 推奨（🟡 Medium）

- [ ] Referrer-Policy 設定
- [ ] Permissions-Policy 設定
- [ ] 2FA を提供
- [ ] 入力バリデーションを強化
- [ ] エラー情報を制限

---

## 🛠️ テストツール

| ツール | 用途 | URL |
|-------|------|-----|
| Mozilla Observatory | 総合セキュリティ評価 | https://observatory.mozilla.org/ |
| Security Headers | HTTPヘッダーチェック | https://securityheaders.com/ |
| SSL Labs | SSL/TLS評価 | https://www.ssllabs.com/ssltest/ |
| Snyk | 依存関係の脆弱性 | https://snyk.io/ |
| OWASP ZAP | 脆弱性スキャン | https://www.zaproxy.org/ |
| CSP Evaluator | CSP評価 | https://csp-evaluator.withgoogle.com/ |

---

## 📚 参考リンク

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Google Web Fundamentals - Security](https://developers.google.com/web/fundamentals/security)
