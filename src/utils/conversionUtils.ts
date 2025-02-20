import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

/**
 * Logan, this one pulls text & metadata straight from a PDF, no fancy libraries—just raw byte parsing.
 */
export async function extractTextFromPDF(filePath: string) {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfText = dataBuffer.toString('utf8');

    // PDFs store metadata like "/Title (Actual Title)", so we regex that shit out
    const titleMatch = pdfText.match(/\/Title\s*\((.*?)\)/);
    const authorMatch = pdfText.match(/\/Author\s*\((.*?)\)/);

    return {
        title: titleMatch ? titleMatch[1] : 'Untitled PDF',
        author: authorMatch ? authorMatch[1] : 'Unknown',
        extractedContent: pdfText
    };
}

/**
 * DOCX files are literally ZIP files with XML inside. So, instead of using a package,
 * we're gonna crack it open ourselves and yank the metadata out of `docProps/core.xml`.
 */
export async function extractMetadataFromDocx(filePath: string) {
    const unzipPath = path.join(__dirname, 'unzipped_docx');

    // Read the DOCX file (which is actually a ZIP)
    const fileBuffer = fs.readFileSync(filePath);
    const zipEntries = new Map();

    let startIndex = 0;
    while (startIndex < fileBuffer.length) {
        const endIndex = fileBuffer.indexOf(Buffer.from([0x50, 0x4b, 0x03, 0x04]), startIndex + 4);
        const chunk = fileBuffer.slice(startIndex, endIndex !== -1 ? endIndex : undefined);
        zipEntries.set(startIndex, chunk);
        startIndex = endIndex !== -1 ? endIndex : fileBuffer.length;
    }

    // We're specifically looking for the `core.xml` file that has metadata
    const coreXmlEntry = [...zipEntries.values()].find(entry => entry.includes('core.xml'));
    if (!coreXmlEntry) {
        return { title: 'Untitled DOCX', author: 'Unknown', description: '', extractedContent: '' };
    }

    const coreXmlContent = coreXmlEntry.toString();
    const titleMatch = coreXmlContent.match(/<dc:title>(.*?)<\/dc:title>/);
    const authorMatch = coreXmlContent.match(/<dc:creator>(.*?)<\/dc:creator>/);
    const descriptionMatch = coreXmlContent.match(/<dc:description>(.*?)<\/dc:description>/);

    return {
        title: titleMatch ? titleMatch[1] : 'Untitled DOCX',
        author: authorMatch ? authorMatch[1] : 'Unknown',
        description: descriptionMatch ? descriptionMatch[1] : '',
        extractedContent: ''
    };
}

/**
 * EPUB files are another kind of ZIP file, but their metadata hides in `content.opf`.
 * We’re gonna rip that file out and parse it ourselves.
 */
export async function extractMetadataFromEPUB(filePath: string) {
    const fileBuffer = fs.readFileSync(filePath);
    const zipEntries = new Map();

    let startIndex = 0;
    while (startIndex < fileBuffer.length) {
        const endIndex = fileBuffer.indexOf(Buffer.from([0x50, 0x4b, 0x03, 0x04]), startIndex + 4);
        const chunk = fileBuffer.slice(startIndex, endIndex !== -1 ? endIndex : undefined);
        zipEntries.set(startIndex, chunk);
        startIndex = endIndex !== -1 ? endIndex : fileBuffer.length;
    }

    // `content.opf` is the jackpot—it’s where EPUB metadata lives
    const opfEntry = [...zipEntries.values()].find(entry => entry.includes('content.opf'));
    if (!opfEntry) {
        return { title: 'Untitled EPUB', author: 'Unknown', description: '', extractedContent: '' };
    }

    const opfContent = opfEntry.toString();
    const titleMatch = opfContent.match(/<dc:title>(.*?)<\/dc:title>/);
    const authorMatch = opfContent.match(/<dc:creator.*?>(.*?)<\/dc:creator>/);
    const descriptionMatch = opfContent.match(/<dc:description>(.*?)<\/dc:description>/);

    return {
        title: titleMatch ? titleMatch[1] : 'Untitled EPUB',
        author: authorMatch ? authorMatch[1] : 'Unknown',
        description: descriptionMatch ? descriptionMatch[1] : '',
        extractedContent: ''
    };
}

/**
 * Web pages are easy. We just fetch the HTML and manually pull out the <title> tag. 
 * No libraries. No BS.
 */
export async function fetchWebPageContent(url: string) {
    const response = await fetch(url);
    const html = await response.text();

    // HTML stores its title in `<title>Actual Title</title>`, so we regex that out
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1] : 'Web Page Title';

    return {
        title,
        description: '',
        extractedContent: html
    };
}