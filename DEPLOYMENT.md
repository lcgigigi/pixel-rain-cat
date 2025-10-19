# 部署指南

本文档详细说明如何将此 Vue3 H5 项目部署到网络上，让其他设备可以通过网址访问。

## 🚀 快速部署（推荐方案）

### 方案一：Vercel 部署（最简单，完全免费）

**优点：**
- 完全免费
- 自动 HTTPS
- 全球 CDN 加速
- 自动部署（推送代码自动更新）
- 提供免费域名

**步骤：**

1. **准备工作**
   - 将代码推送到 GitHub 仓库
   - 访问 [https://vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "New Project"
   - 选择你的 GitHub 仓库
   - 点击 "Import"

3. **配置项目**
   - Framework Preset: Vite（自动识别）
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - 点击 "Deploy"

4. **获取网址**
   - 等待 1-2 分钟部署完成
   - 获得类似 `https://your-project.vercel.app` 的网址
   - 可以在手机浏览器直接访问

5. **自定义域名（可选）**
   - 在项目设置中可以添加自己的域名

---

### 方案二：Netlify 部署（同样简单免费）

**优点：**
- 完全免费
- 自动 HTTPS
- 简单易用
- 表单处理功能

**步骤：**

1. 访问 [https://www.netlify.com](https://www.netlify.com)
2. 注册并登录
3. 点击 "Add new site" → "Import an existing project"
4. 连接 GitHub 并选择仓库
5. 构建设置：
   ```
   Build command: npm run build
   Publish directory: dist
   ```
6. 点击 "Deploy site"
7. 获得类似 `https://your-project.netlify.app` 的网址

---

### 方案三：Cloudflare Pages（国内访问快）

**优点：**
- 免费
- 在国内访问速度较快
- 无限带宽

**步骤：**

1. 访问 [https://pages.cloudflare.com](https://pages.cloudflare.com)
2. 登录/注册 Cloudflare 账号
3. 创建新项目
4. 连接 GitHub 仓库
5. 构建配置：
   ```
   Build command: npm run build
   Build output directory: dist
   ```
6. 保存并部署
7. 获得 `https://your-project.pages.dev` 网址

---

## 📱 使用命令行部署

### Vercel CLI 部署

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录（会打开浏览器）
vercel login

# 3. 部署项目
vercel

# 4. 部署到生产环境
vercel --prod
```

### Netlify CLI 部署

```bash
# 1. 安装 Netlify CLI
npm i -g netlify-cli

# 2. 登录
netlify login

# 3. 初始化
netlify init

# 4. 部署
netlify deploy --prod
```

---

## 🌐 其他部署方案

### GitHub Pages（免费但配置稍复杂）

1. **修改配置**

编辑 `vite.config.js`，添加 base 路径：

```javascript
export default defineConfig({
  base: '/你的仓库名/',
  // ...其他配置
})
```

2. **创建部署脚本**

创建 `deploy-gh.sh` 文件：

```bash
#!/usr/bin/env sh
set -e
npm run build
cd dist
git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:你的用户名/你的仓库名.git master:gh-pages
cd -
```

3. **执行部署**

```bash
chmod +x deploy-gh.sh
./deploy-gh.sh
```

4. **启用 GitHub Pages**
   - 进入仓库 Settings → Pages
   - Source 选择 gh-pages 分支
   - 访问 `https://你的用户名.github.io/仓库名/`

---

### 腾讯云 / 阿里云 部署

**适合：** 需要更多控制权或已有服务器

1. **构建项目**
```bash
npm run build
```

2. **上传 dist 文件夹到服务器**

使用 FTP 或 SCP：
```bash
scp -r dist/* user@your-server:/var/www/html/
```

3. **配置 Nginx**

创建 `/etc/nginx/sites-available/your-site`：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 启用 gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

4. **启用配置**
```bash
sudo ln -s /etc/nginx/sites-available/your-site /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

5. **配置 HTTPS（使用 Let's Encrypt）**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 🔍 部署后测试

### 在不同设备上测试

1. **手机浏览器**
   - iOS Safari
   - Android Chrome
   - 微信内置浏览器

2. **电脑浏览器**
   - Chrome
   - Firefox
   - Safari
   - Edge

3. **响应式测试**
   - 使用 Chrome DevTools 设备模拟器
   - 测试不同屏幕尺寸

---

## 📊 性能优化建议

部署后可以考虑以下优化：

1. **启用 CDN**
   - Vercel/Netlify 自带 CDN
   - 或使用 Cloudflare CDN

2. **压缩资源**
   - 已在 Vite 构建中自动完成
   - 服务器端启用 gzip/brotli 压缩

3. **图片优化**
   - 使用 WebP 格式
   - 使用图片 CDN

4. **缓存策略**
   - 静态资源设置长期缓存
   - HTML 文件设置短期缓存

---

## ❓ 常见问题

### Q: 部署后页面空白？
**A:** 检查 `vite.config.js` 中的 `base` 配置是否正确。

### Q: 刷新页面 404？
**A:** 需要配置服务器路由重定向到 `index.html`（已在 `vercel.json` 和 `netlify.toml` 中配置）。

### Q: 如何更新网站内容？
**A:** 修改代码后推送到 GitHub，Vercel/Netlify 会自动重新部署。

### Q: 可以使用自己的域名吗？
**A:** 可以！在 Vercel/Netlify 的项目设置中添加自定义域名，然后在域名 DNS 中添加相应记录。

### Q: 手机访问速度慢？
**A:** 
- 选择 Cloudflare Pages（国内访问快）
- 或使用国内云服务商
- 启用 CDN 加速

---

## 🎯 推荐方案总结

| 方案 | 难度 | 费用 | 速度 | 推荐指数 |
|------|------|------|------|----------|
| Vercel | ⭐ | 免费 | 快 | ⭐⭐⭐⭐⭐ |
| Netlify | ⭐ | 免费 | 快 | ⭐⭐⭐⭐⭐ |
| Cloudflare Pages | ⭐⭐ | 免费 | 很快（国内） | ⭐⭐⭐⭐ |
| GitHub Pages | ⭐⭐⭐ | 免费 | 中等 | ⭐⭐⭐ |
| 云服务器 | ⭐⭐⭐⭐ | 付费 | 可控 | ⭐⭐ |

**新手推荐：** Vercel 或 Netlify，3 分钟完成部署！

---

需要帮助？查看 [README.md](README.md) 或提交 Issue。

