# Usage Examples

This document provides practical examples of how to use the Word to PDF Splitter application.

## Example 1: Simple Two-Part Split

**Scenario:** You have a 10-page document and want to split it into two equal parts.

**Configuration:**

| Output File Name | Start Page | End Page | Description |
|-----------------|------------|----------|-------------|
| part1.pdf       | 1          | 5        | First half  |
| part2.pdf       | 6          | 10       | Second half |

**Output:** Creates `part1.pdf` (pages 1-5) and `part2.pdf` (pages 6-10)

---

## Example 2: Extract Specific Sections

**Scenario:** You have a 20-page report with introduction, content, and conclusion sections.

**Configuration:**

| Output File Name | Start Page | End Page | Description        |
|-----------------|------------|----------|--------------------|
| intro.pdf       | 1          | 3        | Introduction       |
| content.pdf     | 4          | 17       | Main content       |
| conclusion.pdf  | 18         | 20       | Conclusion         |

**Output:** Creates 3 PDFs with the specified sections

---

## Example 3: Chapter Extraction from Book

**Scenario:** You have a 50-page book manuscript and want to extract individual chapters.

**Configuration:**

| Output File Name | Start Page | End Page | Description |
|-----------------|------------|----------|-------------|
| chapter_01.pdf  | 1          | 8        | Chapter 1   |
| chapter_02.pdf  | 9          | 15       | Chapter 2   |
| chapter_03.pdf  | 16         | 23       | Chapter 3   |
| chapter_04.pdf  | 24         | 32       | Chapter 4   |
| chapter_05.pdf  | 33         | 42       | Chapter 5   |
| chapter_06.pdf  | 43         | 50       | Chapter 6   |

**Output:** Creates 6 PDFs, one for each chapter

---

## Example 4: Extract Single Pages

**Scenario:** You need to extract specific individual pages as separate PDFs.

**Configuration:**

| Output File Name   | Start Page | End Page | Description    |
|-------------------|------------|----------|----------------|
| cover_page.pdf    | 1          | 1        | Cover only     |
| executive_sum.pdf | 2          | 2        | Executive sum  |
| appendix.pdf      | 15         | 15       | Appendix page  |

**Output:** Creates 3 PDFs, each containing a single page

---

## Example 5: Overlapping Ranges (Creating Duplicates)

**Scenario:** You want to create multiple PDFs with some overlapping content.

**Configuration:**

| Output File Name    | Start Page | End Page | Description           |
|--------------------|------------|----------|-----------------------|
| full_intro.pdf     | 1          | 10       | Complete introduction |
| summary_only.pdf   | 8          | 10       | Just the summary      |
| next_section.pdf   | 11         | 20       | Next section          |

**Output:** Creates 3 PDFs where pages 8-10 appear in both the first and second PDFs

---

## Example 6: Using the Sample Document

**Scenario:** Testing with the included `sample_document.docx` (6 pages).

**Configuration:**

| Output File Name | Start Page | End Page | Content                    |
|-----------------|------------|----------|----------------------------|
| intro_section.pdf | 1        | 2        | Introduction & Section 1   |
| technical.pdf   | 3          | 4        | Technical details & Examples|
| final.pdf       | 5          | 6        | Best practices & Conclusion |

**Steps:**
1. Start the application: `python app.py`
2. Open http://localhost:5000
3. Upload `sample_document.docx`
4. Add 3 splits with the configuration above
5. Set output folder to your desired location
6. Click "Generate PDF Files"

**Output:** Creates 3 PDFs from the sample document

---

## Tips for Effective Splitting

### 1. Plan Your Splits First
Before uploading, review your document and note:
- Total page count
- Where sections begin and end
- What content you need in each output file

### 2. Use Descriptive File Names
Good examples:
- ✅ `contract_appendix_a.pdf`
- ✅ `report_executive_summary.pdf`
- ✅ `manual_chapter_03_installation.pdf`

Avoid:
- ❌ `output1.pdf`
- ❌ `file.pdf`
- ❌ `temp.pdf`

### 3. Verify Page Numbers
The application shows the total page count after upload. Double-check your ranges:
- Start page ≤ End page
- End page ≤ Total pages
- No typos in page numbers

### 4. Choose the Right Output Folder
- Create a dedicated folder for outputs
- Use a path you have write permissions to
- Consider organizing by date or project:
  ```
  /Documents/PDFs/2025-11-28_Report_Splits/
  ```

### 5. Test with Small Documents First
Before processing important documents:
1. Test with the sample document
2. Verify the splits work as expected
3. Check the output quality
4. Then process your important documents

---

## Common Use Cases

### Academic Papers
Split a thesis into:
- Abstract
- Literature review
- Methodology
- Results
- Discussion
- References

### Business Reports
Split a quarterly report into:
- Executive summary
- Financial statements
- Market analysis
- Recommendations

### Legal Documents
Split a contract into:
- Main agreement
- Terms and conditions
- Appendices
- Exhibits

### Training Materials
Split a training manual into:
- Course overview
- Individual modules
- Exercises
- Answer key

### Presentations
Convert PowerPoint slides saved as Word to PDFs:
- Introduction slides
- Main content by section
- Summary and Q&A

---

## Advanced Tips

### Batch Processing Strategy
For multiple documents:
1. Process one document at a time
2. Use consistent naming conventions
3. Organize outputs in separate folders

### Quality Check
After splitting:
- Open each PDF to verify content
- Check page ranges are correct
- Ensure no pages are missing
- Verify text and images are clear

### File Organization
Create a folder structure like:
```
project_name/
  ├── original/
  │   └── master_document.docx
  └── splits/
      ├── section_1.pdf
      ├── section_2.pdf
      └── section_3.pdf
```

---

## Error Prevention

### Before Uploading
- ✅ Save and close the Word document
- ✅ Check file size (max 50MB)
- ✅ Verify file format (.doc or .docx)

### Before Processing
- ✅ Verify all fields are filled
- ✅ Check page ranges don't exceed total pages
- ✅ Ensure output folder exists
- ✅ Confirm you have write permissions

### After Processing
- ✅ Check all expected files were created
- ✅ Open and review each PDF
- ✅ Keep the original Word file as backup

---

Need more help? Check the [README.md](README.md) or [QUICKSTART.md](QUICKSTART.md) for additional information!

