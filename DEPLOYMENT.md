# Deployment Guide

This guide explains how to deploy the Word to PDF Splitter application to various cloud platforms.

## ⚠️ Important Note About Deployment

This application requires **LibreOffice** or **Microsoft Word** to convert Word documents to PDFs. Most cloud platforms (Heroku, Render, etc.) **do not** have these installed by default.

### Recommended Deployment Options:

1. **Railway** (Easiest - supports custom buildpacks)
2. **Render** (Good free tier)
3. **PythonAnywhere** (Has LibreOffice pre-installed)
4. **Docker** (Full control, can install LibreOffice)
5. **VPS/EC2** (Most flexible but requires more setup)

---

## Option 1: Deploy to Railway (Recommended)

Railway supports custom Docker containers, making it easy to include LibreOffice.

### Step 1: Create Dockerfile

A `Dockerfile` has been included in the project.

### Step 2: Deploy

1. Go to [railway.app](https://railway.app/)
2. Sign up/login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `sibi_project` repository
5. Railway will auto-detect the Dockerfile and deploy
6. Add environment variables if needed
7. Your app will be live at `https://your-app.railway.app`

**Cost:** $5/month after free trial

---

## Option 2: Deploy to Render

### Step 1: Create render.yaml

A `render.yaml` file is included in the project.

### Step 2: Deploy

1. Go to [render.com](https://render.com/)
2. Sign up/login with GitHub
3. Click "New" → "Blueprint"
4. Connect your GitHub repository
5. Render will use the render.yaml configuration
6. Wait for deployment (includes LibreOffice installation)
7. Your app will be live at `https://your-app.onrender.com`

**Cost:** Free tier available (apps sleep after inactivity)

---

## Option 3: Deploy to PythonAnywhere

PythonAnywhere has LibreOffice pre-installed, making it ideal for this app.

### Steps:

1. Sign up at [pythonanywhere.com](https://www.pythonanywhere.com/)
2. Go to "Web" tab → "Add a new web app"
3. Choose "Flask" and Python 3.10
4. In the Bash console:
   ```bash
   git clone https://github.com/YOUR_USERNAME/sibi_project.git
   cd sibi_project
   pip install -r requirements.txt
   ```
5. Configure WSGI file to point to your app
6. Reload the web app
7. Your app will be at `https://yourusername.pythonanywhere.com`

**Cost:** Free tier available (limited CPU)

---

## Option 4: Docker Deployment (Advanced)

Use the included `Dockerfile` to deploy anywhere that supports Docker.

### Build and Run Locally:

```bash
docker build -t word-pdf-splitter .
docker run -p 5001:5001 word-pdf-splitter
```

### Deploy to:
- **AWS ECS**
- **Google Cloud Run**
- **Azure Container Instances**
- **DigitalOcean App Platform**

---

## Option 5: VPS Deployment (Ubuntu/Debian)

### Steps:

1. **Get a VPS** (DigitalOcean, Linode, AWS EC2, etc.)

2. **Install dependencies:**
   ```bash
   sudo apt update
   sudo apt install -y python3 python3-pip libreoffice nginx
   ```

3. **Clone and setup:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/sibi_project.git
   cd sibi_project
   pip3 install -r requirements.txt
   ```

4. **Run with Gunicorn:**
   ```bash
   gunicorn --bind 0.0.0.0:5001 app:app
   ```

5. **Setup Nginx as reverse proxy** (optional but recommended)

6. **Setup as systemd service** for auto-restart

**Cost:** $5-10/month for basic VPS

---

## Configuration for Production

### Update app.py for Production:

The app needs a small modification for production. Change the last line:

```python
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(debug=False, host='0.0.0.0', port=port)
```

This has already been done in the repository.

### Environment Variables:

Set these environment variables in your deployment platform:

- `PORT`: The port to run on (usually set automatically)
- `MAX_CONTENT_LENGTH`: Maximum upload size in bytes (default: 52428800)
- `SECRET_KEY`: Flask secret key for sessions (generate a random string)

---

## Security Considerations for Public Deployment

1. **File Size Limits:** The app limits uploads to 50MB
2. **File Cleanup:** Temporary files are automatically deleted
3. **Input Validation:** All inputs are validated and sanitized
4. **HTTPS:** Use platform's built-in HTTPS (most provide it automatically)
5. **Rate Limiting:** Consider adding rate limiting for production
6. **Authentication:** Consider adding user authentication for sensitive use

---

## Monitoring and Maintenance

### Health Check Endpoint:

Add this to `app.py`:

```python
@app.route('/health')
def health():
    return jsonify({'status': 'healthy'}), 200
```

### Logs:

Check logs on your platform:
- Railway: Dashboard → Deployments → Logs
- Render: Dashboard → Logs tab
- PythonAnywhere: Error log and Server log

---

## Troubleshooting

### "LibreOffice not found" error:
- Make sure LibreOffice is installed in your Docker image/VPS
- Check the soffice path in `app.py`

### Conversion timeouts:
- Increase timeout values in `app.py`
- Use a platform with more resources

### Out of memory:
- Upgrade your plan
- Add memory limits to Docker container

---

## Cost Comparison

| Platform | Free Tier | Paid (Monthly) | LibreOffice Support |
|----------|-----------|----------------|---------------------|
| Railway | Limited | $5+ | ✅ (via Docker) |
| Render | Yes | $7+ | ✅ (with setup) |
| PythonAnywhere | Yes | $5+ | ✅ (pre-installed) |
| Heroku | No | $7+ | ❌ (requires buildpack) |
| VPS | No | $5-20 | ✅ (manual install) |

---

## Recommended: Railway Deployment

For ease of use and reliability, **Railway** is recommended:

1. Best developer experience
2. Automatic HTTPS
3. Easy environment variable management
4. Automatic deployments from GitHub
5. Built-in monitoring

---

For questions or issues, check the main README.md or open an issue on GitHub.

