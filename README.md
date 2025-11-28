# Word to PDF Splitter

A web-based application that allows users to upload a Word document (.doc/.docx) and split it into multiple PDF files with custom page ranges.

## Features

- 📤 **Easy File Upload**: Drag-and-drop or click to upload Word documents
- 📄 **Automatic Conversion**: Converts Word files to PDF automatically
- ✂️ **Custom Splitting**: Split PDF into multiple files with custom page ranges
- 📝 **User-Friendly Interface**: Clean, modern UI with intuitive controls
- ✅ **Error Handling**: Validates page ranges and handles errors gracefully
- 📁 **Flexible Output**: Choose your own output folder and file names

## Requirements

- Python 3.7 or higher
- Microsoft Word or LibreOffice (required for docx2pdf conversion)
  - **macOS**: Requires Microsoft Word to be installed
  - **Windows**: Works with Microsoft Word
  - **Linux**: Requires LibreOffice (`sudo apt-get install libreoffice`)

## Installation

1. **Clone or download this repository**

2. **Navigate to the project directory**:
   ```bash
   cd sibi_project
   ```

3. **Create a virtual environment** (recommended):
   ```bash
   python3 -m venv venv
   ```

4. **Activate the virtual environment**:
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```

5. **Install required packages**:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

### Starting the Application

1. **Run the Flask application**:
   ```bash
   python app.py
   ```

2. **Open your web browser** and navigate to:
   ```
   http://localhost:5000
   ```

### Using the Application

#### Step 1: Upload Word Document
1. Click the "Choose File" button or drag and drop a Word document (.doc or .docx)
2. Maximum file size: 50MB
3. Wait for the file to upload and convert to PDF
4. The application will display the total number of pages

#### Step 2: Configure PDF Splits
1. Click "Add Split" to add a new split configuration
2. For each split, enter:
   - **Output File Name**: Name for the output PDF (e.g., "chapter1.pdf")
   - **Start Page**: First page to include (1-indexed)
   - **End Page**: Last page to include (1-indexed)
3. You can add multiple splits to create several PDF files
4. Click "Remove" to delete a split configuration
5. Page ranges are validated automatically

#### Step 3: Select Output Folder
1. Enter the full path to the folder where you want to save the PDF files
   - Example (Mac): `/Users/username/Documents/PDFs`
   - Example (Windows): `C:\Users\username\Documents\PDFs`
2. Make sure the folder exists before processing

#### Step 4: Generate PDFs
1. Click "Generate PDF Files" to start the splitting process
2. Wait for processing to complete
3. Review the results showing which files were created successfully
4. Check the output folder for your generated PDF files

#### Step 5: Start Over
1. Click "Start Over" to upload and process another document

## Example Usage

### Scenario: Split a 20-page document into 3 PDFs

1. Upload your 20-page Word document
2. Configure splits:
   - **Split 1**:
     - File name: `introduction.pdf`
     - Start page: 1
     - End page: 5
   - **Split 2**:
     - File name: `main_content.pdf`
     - Start page: 6
     - End page: 15
   - **Split 3**:
     - File name: `conclusion.pdf`
     - Start page: 16
     - End page: 20
3. Enter output folder: `/Users/username/Documents/PDFs`
4. Click "Generate PDF Files"
5. Three PDF files will be created in your output folder

## Error Handling

The application handles various error scenarios:

- ❌ **Invalid file type**: Only .doc and .docx files are accepted
- ❌ **File too large**: Maximum 50MB file size
- ❌ **Invalid page ranges**: Start page must be ≤ end page
- ❌ **Page out of bounds**: End page cannot exceed total pages
- ❌ **Missing output folder**: Output folder must exist
- ❌ **Empty configurations**: At least one split must be configured
- ❌ **Conversion errors**: Handles Word to PDF conversion failures

## Project Structure

```
sibi_project/
│
├── app.py                      # Flask backend application
├── requirements.txt            # Python dependencies
├── README.md                   # This file
│
├── templates/
│   └── index.html             # Main HTML template
│
├── static/
│   ├── css/
│   │   └── style.css          # Application styles
│   └── js/
│       └── script.js          # Frontend JavaScript
│
└── sample_document.docx       # Sample Word file for testing
```

## Technology Stack

- **Backend**: Python, Flask
- **PDF Processing**: pypdf (formerly PyPDF2)
- **Word to PDF Conversion**: docx2pdf, python-docx
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **UI Design**: Modern gradient design with responsive layout

## Troubleshooting

### Issue: "Failed to convert Word document to PDF"

**Solution**: 
- **macOS**: Make sure Microsoft Word is installed
- **Windows**: Make sure Microsoft Word is installed
- **Linux**: Install LibreOffice:
  ```bash
  sudo apt-get install libreoffice
  ```

### Issue: "Output folder does not exist"

**Solution**: Create the folder first or use an existing folder path

### Issue: Port 5000 already in use

**Solution**: 
- Stop other applications using port 5000
- Or modify `app.py` to use a different port:
  ```python
  app.run(debug=True, port=5001)  # Change to 5001 or any available port
  ```

### Issue: Permission denied when saving files

**Solution**: Make sure you have write permissions to the output folder

## Security Notes

- The application stores uploaded files temporarily and cleans them up after processing
- Maximum file size is limited to 50MB
- File uploads are validated for correct file types
- All filenames are sanitized using `secure_filename()`

## Limitations

- Maximum file size: 50MB
- Supported formats: .doc, .docx only
- Output format: PDF only
- Requires Microsoft Word (Windows/Mac) or LibreOffice (Linux) for conversion

## Future Enhancements

Potential improvements for future versions:
- Support for other input formats (RTF, ODT)
- Batch processing of multiple Word files
- PDF merging functionality
- Cloud storage integration
- Docker containerization for easier deployment
- Command-line interface (CLI) option

## License

This project is provided as-is for educational and personal use.

## Support

For issues or questions, please refer to the troubleshooting section or check the error messages displayed in the application.

---

**Created with ❤️ using Flask and Python**

