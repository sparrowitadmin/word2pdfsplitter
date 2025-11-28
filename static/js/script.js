// Global variables
let sessionId = null;
let totalPages = 0;
let fileInput, uploadArea, uploadStatus;

// Initialize after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // File input handling
    fileInput = document.getElementById('file-input');
    uploadArea = document.getElementById('upload-area');
    uploadStatus = document.getElementById('upload-status');

    if (!fileInput || !uploadArea || !uploadStatus) {
        console.error('Required elements not found');
        return;
    }

    fileInput.addEventListener('change', handleFileSelect);

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            handleFileSelect();
        }
    });
});

// Handle file selection
function handleFileSelect() {
    const file = fileInput.files[0];
    
    if (!file) {
        return;
    }
    
    // Validate file type
    const validExtensions = ['.doc', '.docx'];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some(ext => fileName.endsWith(ext));
    
    if (!isValid) {
        showStatus('error', 'Please select a valid Word document (.doc or .docx)');
        return;
    }
    
    // Validate file size (50MB)
    if (file.size > 50 * 1024 * 1024) {
        showStatus('error', 'File size exceeds 50MB limit');
        return;
    }
    
    uploadFile(file);
}

// Upload file to server
async function uploadFile(file) {
    showLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            sessionId = data.session_id;
            totalPages = data.page_count;
            
            showStatus('success', data.message);
            
            // Show configuration section
            document.getElementById('config-section').style.display = 'block';
            document.getElementById('output-section').style.display = 'block';
            document.getElementById('page-count').textContent = totalPages;
            
            // Add initial split row
            addSplitRow();
            
            // Scroll to config section
            document.getElementById('config-section').scrollIntoView({ behavior: 'smooth' });
        } else {
            showStatus('error', data.error || 'Upload failed');
        }
    } catch (error) {
        showStatus('error', 'Network error: ' + error.message);
    } finally {
        showLoading(false);
    }
}

// Generate multiple empty rows
function generateRows() {
    const numSplits = parseInt(document.getElementById('num-splits').value);
    const bulkStatus = document.getElementById('bulk-status');
    
    if (!numSplits || numSplits < 1 || numSplits > 100) {
        bulkStatus.className = 'bulk-status error';
        bulkStatus.textContent = 'Please enter a valid number between 1 and 100';
        return;
    }
    
    // Clear existing rows
    document.getElementById('splits-tbody').innerHTML = '';
    
    // Generate new rows
    for (let i = 0; i < numSplits; i++) {
        addSplitRow();
    }
    
    bulkStatus.className = 'bulk-status success';
    bulkStatus.textContent = `Successfully generated ${numSplits} empty row(s). You can now fill them in or paste data.`;
}

// Parse and apply pasted Excel data
function applyPastedData() {
    const pasteData = document.getElementById('paste-data').value.trim();
    const bulkStatus = document.getElementById('bulk-status');
    
    if (!pasteData) {
        bulkStatus.className = 'bulk-status error';
        bulkStatus.textContent = 'Please paste some data first';
        return;
    }
    
    try {
        // Split by newlines and parse each row
        const lines = pasteData.split('\n').filter(line => line.trim());
        
        if (lines.length === 0) {
            bulkStatus.className = 'bulk-status error';
            bulkStatus.textContent = 'No valid data found';
            return;
        }
        
        // Clear existing rows
        const tbody = document.getElementById('splits-tbody');
        tbody.innerHTML = '';
        
        let successCount = 0;
        let errors = [];
        
        // Process each line
        lines.forEach((line, index) => {
            // Split by tab or multiple spaces
            const parts = line.split(/\t+|\s{2,}/).map(p => p.trim()).filter(p => p);
            
            if (parts.length >= 3) {
                const filename = parts[0];
                const startPage = parseInt(parts[1]);
                const endPage = parseInt(parts[2]);
                
                // Validate
                if (!filename) {
                    errors.push(`Row ${index + 1}: Empty filename`);
                    return;
                }
                
                if (isNaN(startPage) || isNaN(endPage)) {
                    errors.push(`Row ${index + 1}: Invalid page numbers`);
                    return;
                }
                
                if (startPage < 1 || endPage < 1) {
                    errors.push(`Row ${index + 1}: Page numbers must be greater than 0`);
                    return;
                }
                
                if (startPage > endPage) {
                    errors.push(`Row ${index + 1}: Start page cannot be greater than end page`);
                    return;
                }
                
                if (endPage > totalPages) {
                    errors.push(`Row ${index + 1}: End page (${endPage}) exceeds document length (${totalPages})`);
                    return;
                }
                
                // Add row with data
                const row = tbody.insertRow();
                const cleanFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
                
                row.innerHTML = `
                    <td><input type="text" value="${cleanFilename}"></td>
                    <td><input type="number" min="1" max="${totalPages}" value="${startPage}" onchange="validatePageRange(this)"></td>
                    <td><input type="number" min="1" max="${totalPages}" value="${endPage}" onchange="validatePageRange(this)"></td>
                    <td><button class="btn btn-danger" onclick="removeSplitRow(this)">Remove</button></td>
                `;
                
                successCount++;
            } else {
                errors.push(`Row ${index + 1}: Invalid format (need 3 columns: filename, start, end)`);
            }
        });
        
        // Show results
        if (successCount > 0) {
            bulkStatus.className = 'bulk-status success';
            bulkStatus.textContent = `Successfully imported ${successCount} split configuration(s) from pasted data.`;
            
            if (errors.length > 0) {
                bulkStatus.textContent += ` (${errors.length} row(s) skipped due to errors)`;
            }
            
            // Clear the textarea
            document.getElementById('paste-data').value = '';
        } else {
            bulkStatus.className = 'bulk-status error';
            bulkStatus.textContent = 'Failed to import data. Errors: ' + errors.join('; ');
        }
        
    } catch (error) {
        bulkStatus.className = 'bulk-status error';
        bulkStatus.textContent = 'Error parsing data: ' + error.message;
    }
}

// Add a new split row to the table
function addSplitRow() {
    const tbody = document.getElementById('splits-tbody');
    const rowCount = tbody.rows.length;
    
    const row = tbody.insertRow();
    row.innerHTML = `
        <td><input type="text" placeholder="output_${rowCount + 1}" value="output_${rowCount + 1}.pdf"></td>
        <td><input type="number" min="1" max="${totalPages}" value="1" onchange="validatePageRange(this)"></td>
        <td><input type="number" min="1" max="${totalPages}" value="${totalPages}" onchange="validatePageRange(this)"></td>
        <td><button class="btn btn-danger" onclick="removeSplitRow(this)">Remove</button></td>
    `;
}

// Remove a split row
function removeSplitRow(button) {
    const row = button.closest('tr');
    row.remove();
}

// Validate page range
function validatePageRange(input) {
    const value = parseInt(input.value);
    const min = parseInt(input.min);
    const max = parseInt(input.max);
    
    if (value < min) {
        input.value = min;
    } else if (value > max) {
        input.value = max;
    }
}

// Process splits and generate PDFs
async function processSplits() {
    // Get all split configurations
    const tbody = document.getElementById('splits-tbody');
    const rows = tbody.rows;
    
    if (rows.length === 0) {
        alert('Please add at least one split configuration');
        return;
    }
    
    const splits = [];
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const filename = row.cells[0].querySelector('input').value.trim();
        const startPage = row.cells[1].querySelector('input').value;
        const endPage = row.cells[2].querySelector('input').value;
        
        if (!filename) {
            alert(`Please enter a filename for row ${i + 1}`);
            return;
        }
        
        splits.push({
            filename: filename,
            start_page: parseInt(startPage),
            end_page: parseInt(endPage)
        });
    }
    
    // Validate page ranges
    for (let i = 0; i < splits.length; i++) {
        const split = splits[i];
        if (split.start_page < 1 || split.end_page < 1) {
            alert(`Invalid page range in row ${i + 1}: Pages must be greater than 0`);
            return;
        }
        if (split.start_page > split.end_page) {
            alert(`Invalid page range in row ${i + 1}: Start page cannot be greater than end page`);
            return;
        }
        if (split.end_page > totalPages) {
            alert(`Invalid page range in row ${i + 1}: End page exceeds document length (${totalPages} pages)`);
            return;
        }
    }
    
    // Send to server
    showLoading(true);
    
    try {
        const response = await fetch('/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                session_id: sessionId,
                splits: splits
            })
        });
        
        if (response.ok) {
            // Check if response is a ZIP file
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/zip')) {
                // Download the ZIP file
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'split_pdfs.zip';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                
                // Show success message
                displayResults([{
                    filename: 'split_pdfs.zip',
                    status: 'success',
                    message: `Successfully created ${splits.length} PDF file(s). Download started!`
                }], `✅ Success! Your PDFs have been downloaded as a ZIP file.`);
            } else {
                // Handle JSON error response
                const data = await response.json();
                alert('Error: ' + (data.error || 'Processing failed'));
            }
        } else {
            const data = await response.json();
            alert('Error: ' + (data.error || 'Processing failed'));
        }
    } catch (error) {
        alert('Network error: ' + error.message);
    } finally {
        showLoading(false);
    }
}

// Display results
function displayResults(results, message) {
    const resultsSection = document.getElementById('results-section');
    const resultsContent = document.getElementById('results-content');
    
    // Hide other sections
    document.getElementById('upload-section').style.display = 'none';
    document.getElementById('config-section').style.display = 'none';
    document.getElementById('output-section').style.display = 'none';
    
    // Build results HTML
    let html = `<div class="info-box"><p><strong>${message}</strong></p></div>`;
    
    results.forEach(result => {
        const status = result.status === 'success' ? 'success' : 'error';
        const icon = result.status === 'success' ? '✅' : '❌';
        
        html += `
            <div class="result-item ${status}">
                <span class="result-icon">${icon}</span>
                <div class="result-item-info">
                    <div class="result-item-title">${result.filename}</div>
                    <div class="result-item-message">${result.message}</div>
                </div>
            </div>
        `;
    });
    
    resultsContent.innerHTML = html;
    resultsSection.style.display = 'block';
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Reset application
function resetApp() {
    // Clear session
    sessionId = null;
    totalPages = 0;
    
    // Reset file input
    fileInput.value = '';
    
    // Clear splits table
    document.getElementById('splits-tbody').innerHTML = '';
    
    // Reset status
    uploadStatus.className = 'status-message';
    uploadStatus.textContent = '';
    uploadStatus.style.display = 'none';
    
    // Show upload section, hide others
    document.getElementById('upload-section').style.display = 'block';
    document.getElementById('config-section').style.display = 'none';
    document.getElementById('output-section').style.display = 'none';
    document.getElementById('results-section').style.display = 'none';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show status message
function showStatus(type, message) {
    uploadStatus.className = `status-message ${type}`;
    uploadStatus.textContent = message;
    uploadStatus.style.display = 'block';
}

// Show/hide loading overlay
function showLoading(show) {
    document.getElementById('loading-overlay').style.display = show ? 'flex' : 'none';
}

