# 📄 Word to PDF Splitter

A simple web application that splits Word documents into multiple PDF files based on custom page ranges.

## ✨ Features

- 📤 **Upload Word Documents** - Drag & drop or browse (.doc/.docx)
- ✂️ **Split by Page Range** - Create multiple PDFs from one document
- 📦 **Bulk Configuration** - Generate multiple rows or paste from Excel
- 💾 **Download as ZIP** - Get all your split PDFs in one file
- 🎨 **Modern UI** - Clean, intuitive interface
- ⚡ **Fast Processing** - Powered by LibreOffice

## 🚀 Quick Start

### Online Version (Recommended)

Visit the live app: **[Word to PDF Splitter](https://word2pdfsplitter.up.railway.app/)**

No installation needed! Just upload and split.

### Local Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sparrowitadmin/word2pdfsplitter.git
   cd word2pdfsplitter
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install LibreOffice** (required for Word to PDF conversion)
   - **macOS**: `brew install --cask libreoffice`
   - **Linux**: `sudo apt-get install libreoffice`
   - **Windows**: Download from [libreoffice.org](https://www.libreoffice.org)

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Open your browser**
   ```
   http://localhost:5001
   ```

## 📖 How to Use

### Method 1: Manual Entry

1. **Upload** your Word document
2. **Click "Add Split"** to add rows
3. **Enter** filename, start page, and end page for each split
4. **Click "Generate & Download PDFs"**
5. **Extract** the downloaded ZIP file

### Method 2: Bulk Configuration (Faster!)

1. **Upload** your Word document
2. **Enter number of splits** and click "Generate Rows"
3. **Prepare data in Excel** with 3 columns:
   ```
   filename     start_page    end_page
   chapter1     1             5
   chapter2     6             10
   chapter3     11            15
   ```
4. **Copy from Excel**, paste into the text area
5. **Click "Apply Pasted Data"** - table auto-fills!
6. **Click "Generate & Download PDFs"**

## 💡 Example

Split a 20-page document into 3 PDFs:

| File Name | Start Page | End Page |
|-----------|------------|----------|
| intro.pdf | 1 | 5 |
| content.pdf | 6 | 15 |
| conclusion.pdf | 16 | 20 |

Result: Download `split_pdfs.zip` containing all 3 files.

## 🛠️ Technology

- **Backend**: Python, Flask
- **PDF Processing**: pypdf
- **Conversion**: LibreOffice (via subprocess)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Deployment**: Docker, Railway/Render compatible

## 📦 Deployment

The app includes deployment configurations for:

- **Railway** (recommended) - `Dockerfile` included
- **Render** - `render.yaml` included  
- **Heroku** - `Procfile` included
- **Docker** - Ready to containerize

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## ❓ FAQ

**Q: What file types are supported?**  
A: .doc and .docx files up to 50MB

**Q: Where are my files stored?**  
A: Files are processed in memory/temp folders and automatically deleted after processing

**Q: Can I split multiple documents at once?**  
A: Currently one document at a time. Batch processing coming soon!

**Q: Is my data secure?**  
A: Yes! Files are processed temporarily and immediately deleted. Nothing is permanently stored.

## 🐛 Troubleshooting

**Conversion fails?**
- Make sure LibreOffice is installed
- Try restarting the application

**Can't download?**
- Check your browser's download settings
- Try a different browser

**Page range errors?**
- Ensure start page ≤ end page
- Ensure end page doesn't exceed total pages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright © 2025 SurveySparrow

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📧 Support

For issues or questions:
- Check the [Issues](https://github.com/sparrowitadmin/word2pdfsplitter/issues) page
- Read the [QUICKSTART.md](QUICKSTART.md) guide
- Review [USAGE_EXAMPLES.md](USAGE_EXAMPLES.md)

---

**Made with Passion @ SurveySparrow**

[Try it now →](https://word2pdfsplitter.up.railway.app/)
