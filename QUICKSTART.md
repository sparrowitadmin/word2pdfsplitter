# Quick Start Guide

Get up and running with the Word to PDF Splitter in 5 minutes!

## Prerequisites

✅ Python 3.7 or higher installed  
✅ Microsoft Word (Mac/Windows) or LibreOffice (Linux)  
✅ Terminal/Command Prompt access

## Installation Steps

### 1. Open Terminal and Navigate to Project

```bash
cd /Users/ceetus/Projects/sibi_project
```

### 2. Create Virtual Environment (Recommended)

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- Flask (web framework)
- python-docx (Word file handling)
- pypdf (PDF manipulation)
- docx2pdf (Word to PDF conversion)
- Werkzeug (utility library)

## Running the Application

### 1. Start the Server

```bash
python app.py
```

You should see:
```
Starting Word to PDF Splitter Application
Open your browser and navigate to: http://localhost:5000
 * Running on http://127.0.0.1:5000
```

### 2. Open Your Browser

Navigate to: **http://localhost:5000**

### 3. Use the Application

1. **Upload** the sample document (sample_document.docx) or your own Word file
2. **Configure** your splits by adding rows and setting page ranges
3. **Select** an output folder (e.g., `/Users/ceetus/Documents/`)
4. **Generate** the PDF files
5. **Check** your output folder for the split PDFs!

## Test Run with Sample Document

The project includes `sample_document.docx` (6 pages). Try this configuration:

| Output File Name | Start Page | End Page |
|-----------------|------------|----------|
| intro.pdf       | 1          | 2        |
| middle.pdf      | 3          | 4        |
| end.pdf         | 5          | 6        |

## Troubleshooting

### "Command not found: python"
Use `python3` instead:
```bash
python3 app.py
```

### "Module not found" errors
Make sure you activated the virtual environment and installed requirements:
```bash
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

### "Failed to convert Word to PDF"
- **Mac**: Install Microsoft Word from the App Store
- **Windows**: Install Microsoft Word
- **Linux**: Install LibreOffice:
  ```bash
  sudo apt-get install libreoffice
  ```

### Port 5000 already in use
Kill the process using port 5000 or change the port in `app.py`:
```python
app.run(debug=True, port=5001)  # Change to any available port
```

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Experiment with different page ranges
- Try splitting your own Word documents

## Need Help?

Check the error messages in:
- Browser console (F12 → Console tab)
- Terminal where Flask is running
- Application UI (error messages are displayed)

---

Happy document splitting! 📄✂️📑

