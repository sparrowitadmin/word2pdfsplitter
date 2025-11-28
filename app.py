import os
import json
import subprocess
import platform
from flask import Flask, render_template, request, jsonify, send_file
from werkzeug.utils import secure_filename
from docx import Document
try:
    from docx2pdf import convert as docx2pdf_convert
except ImportError:
    docx2pdf_convert = None
from pypdf import PdfReader, PdfWriter
import tempfile
import shutil
from pathlib import Path

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max file size
app.config['UPLOAD_FOLDER'] = tempfile.gettempdir()

ALLOWED_EXTENSIONS = {'docx', 'doc'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_word_page_count(docx_path):
    """
    Estimate page count from a Word document.
    This is an approximation based on content.
    """
    try:
        doc = Document(docx_path)
        # Rough estimation: count paragraphs and tables
        paragraph_count = len(doc.paragraphs)
        # Assume ~40 lines per page, ~2 paragraphs per page on average
        estimated_pages = max(1, paragraph_count // 2)
        return estimated_pages
    except Exception as e:
        print(f"Error estimating page count: {e}")
        return 1

def convert_word_to_pdf(word_path, pdf_path):
    """Convert Word document to PDF using multiple methods."""
    import subprocess
    import platform
    
    # Method 1: Try using soffice (LibreOffice) - most reliable on macOS
    try:
        # Common LibreOffice paths on macOS
        soffice_paths = [
            '/Applications/LibreOffice.app/Contents/MacOS/soffice',
            '/usr/local/bin/soffice',
            'soffice'
        ]
        
        soffice_cmd = None
        for path in soffice_paths:
            result = subprocess.run(['which', path if path == 'soffice' else ''], 
                                   capture_output=True, text=True, timeout=2)
            if result.returncode == 0 or os.path.exists(path):
                soffice_cmd = path
                break
        
        if soffice_cmd:
            output_dir = os.path.dirname(pdf_path)
            cmd = [
                soffice_cmd,
                '--headless',
                '--convert-to', 'pdf',
                '--outdir', output_dir,
                word_path
            ]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            
            # LibreOffice creates PDF with same base name
            base_name = os.path.splitext(os.path.basename(word_path))[0]
            generated_pdf = os.path.join(output_dir, f"{base_name}.pdf")
            
            if os.path.exists(generated_pdf):
                if generated_pdf != pdf_path:
                    os.rename(generated_pdf, pdf_path)
                return True
    except Exception as e:
        print(f"LibreOffice conversion failed: {e}")
    
    # Method 2: Try docx2pdf (requires Microsoft Word)
    if docx2pdf_convert:
        try:
            docx2pdf_convert(word_path, pdf_path)
            if os.path.exists(pdf_path):
                return True
        except Exception as e:
            print(f"docx2pdf conversion failed: {e}")
    
    # Method 3: Try textutil (macOS built-in, creates basic PDF)
    if platform.system() == 'Darwin':
        try:
            cmd = ['textutil', '-convert', 'html', word_path, '-output', word_path + '.html']
            subprocess.run(cmd, capture_output=True, timeout=10)
            
            # Then use wkhtmltopdf or similar if available
            # For now, just return False as textutil alone doesn't make good PDFs
        except Exception as e:
            print(f"textutil conversion failed: {e}")
    
    print(f"Error: All conversion methods failed. Please install LibreOffice or Microsoft Word.")
    return False

def split_pdf(source_pdf, splits_config, output_folder):
    """
    Split PDF into multiple files based on page ranges.
    
    Args:
        source_pdf: Path to source PDF
        splits_config: List of dicts with 'filename', 'start_page', 'end_page'
        output_folder: Destination folder for output PDFs
    
    Returns:
        List of created files or error messages
    """
    results = []
    
    try:
        reader = PdfReader(source_pdf)
        total_pages = len(reader.pages)
        
        for split in splits_config:
            filename = split['filename']
            start_page = int(split['start_page'])
            end_page = int(split['end_page'])
            
            # Validate page ranges
            if start_page < 1 or end_page < 1:
                results.append({
                    'filename': filename,
                    'status': 'error',
                    'message': 'Page numbers must be greater than 0'
                })
                continue
            
            if start_page > end_page:
                results.append({
                    'filename': filename,
                    'status': 'error',
                    'message': f'Start page ({start_page}) cannot be greater than end page ({end_page})'
                })
                continue
            
            if end_page > total_pages:
                results.append({
                    'filename': filename,
                    'status': 'error',
                    'message': f'End page ({end_page}) exceeds total pages ({total_pages})'
                })
                continue
            
            # Create PDF writer for this split
            writer = PdfWriter()
            
            # Add pages (convert to 0-indexed)
            for page_num in range(start_page - 1, end_page):
                writer.add_page(reader.pages[page_num])
            
            # Ensure filename ends with .pdf
            if not filename.lower().endswith('.pdf'):
                filename += '.pdf'
            
            # Write output file
            output_path = os.path.join(output_folder, secure_filename(filename))
            
            try:
                with open(output_path, 'wb') as output_file:
                    writer.write(output_file)
                
                results.append({
                    'filename': filename,
                    'status': 'success',
                    'message': f'Created with pages {start_page}-{end_page}',
                    'path': output_path
                })
            except Exception as e:
                results.append({
                    'filename': filename,
                    'status': 'error',
                    'message': f'Error writing file: {str(e)}'
                })
        
        return results
    
    except Exception as e:
        return [{'status': 'error', 'message': f'Error reading PDF: {str(e)}'}]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    """Handle file upload and return page count."""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Please upload a .docx or .doc file'}), 400
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        word_path = os.path.join(app.config['UPLOAD_FOLDER'], f"upload_{filename}")
        file.save(word_path)
        
        # Convert to PDF
        pdf_path = os.path.join(app.config['UPLOAD_FOLDER'], f"converted_{filename}.pdf")
        
        if not convert_word_to_pdf(word_path, pdf_path):
            os.remove(word_path)
            return jsonify({'error': 'Failed to convert Word document to PDF'}), 500
        
        # Get page count
        try:
            reader = PdfReader(pdf_path)
            page_count = len(reader.pages)
        except Exception as e:
            os.remove(word_path)
            os.remove(pdf_path)
            return jsonify({'error': f'Error reading PDF: {str(e)}'}), 500
        
        # Store file paths in session-like manner (use temp file)
        session_id = os.path.basename(pdf_path).replace('converted_', '').replace('.pdf', '')
        
        return jsonify({
            'success': True,
            'page_count': page_count,
            'session_id': session_id,
            'message': f'File uploaded successfully. Document has {page_count} pages.'
        })
    
    except Exception as e:
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500

@app.route('/process', methods=['POST'])
def process_splits():
    """Process the PDF splitting based on user input."""
    try:
        data = request.json
        session_id = data.get('session_id')
        splits = data.get('splits', [])
        output_folder = data.get('output_folder', '')
        
        if not session_id:
            return jsonify({'error': 'Invalid session'}), 400
        
        if not splits:
            return jsonify({'error': 'No split configurations provided'}), 400
        
        if not output_folder:
            return jsonify({'error': 'Output folder not specified'}), 400
        
        # Validate output folder
        if not os.path.exists(output_folder):
            return jsonify({'error': 'Output folder does not exist'}), 400
        
        if not os.path.isdir(output_folder):
            return jsonify({'error': 'Output path is not a directory'}), 400
        
        # Get PDF path
        pdf_filename = f"converted_{session_id}.pdf"
        pdf_path = os.path.join(app.config['UPLOAD_FOLDER'], pdf_filename)
        
        if not os.path.exists(pdf_path):
            return jsonify({'error': 'Source file not found. Please upload again.'}), 400
        
        # Process splits
        results = split_pdf(pdf_path, splits, output_folder)
        
        # Clean up temporary files
        word_path = os.path.join(app.config['UPLOAD_FOLDER'], f"upload_{session_id}")
        if os.path.exists(word_path):
            os.remove(word_path)
        if os.path.exists(pdf_path):
            os.remove(pdf_path)
        
        # Check if any succeeded
        success_count = sum(1 for r in results if r['status'] == 'success')
        
        return jsonify({
            'success': success_count > 0,
            'results': results,
            'message': f'Successfully created {success_count} of {len(splits)} PDF files'
        })
    
    except Exception as e:
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500

if __name__ == '__main__':
    print("Starting Word to PDF Splitter Application")
    print("Open your browser and navigate to: http://localhost:5001")
    app.run(debug=True, port=5001, host='127.0.0.1')

