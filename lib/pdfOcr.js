// lib/pdfOcr.js
import fs from 'fs/promises';
import sharp from 'sharp';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import Tesseract from 'tesseract.js-node';

const MIN_TEXT_LEN = 200;

/**
 * Try text extraction with pdf-parse, then fall back to OCR on image-only PDFs.
 * @param {string} filePath - Temp path from formidable
 */
export async function extractPdfTextWithOcr(filePath) {
  const dataBuffer = await fs.readFile(filePath);

  // 1) Normal text extraction
  const pdfData = await pdfParse(dataBuffer);
  let text = (pdfData.text || '').trim();

  if (text.length >= MIN_TEXT_LEN) {
    return text;
  }

  // 2) OCR fallback: render first page to image and OCR it
  const firstPageImage = await renderFirstPageToPng(dataBuffer);
  if (!firstPageImage) return text;

  const ocrText = await ocrImageBuffer(firstPageImage);
  return (text + '\n' + ocrText).trim();
}

async function renderFirstPageToPng(pdfBuffer) {
  // pdf-parse gives access to individual page rendering via its internal API,
  // but for a simple drop-in we rasterize via sharp's PDF support.
  // Note: sharp must be built with librsvg/poppler on some platforms.
  try {
    const image = sharp(pdfBuffer, { density: 200 }); // 200 DPI
    const png = await image.png().toBuffer();
    return png;
  } catch (err) {
    console.error('PDF -> PNG render error:', err);
    return null;
  }
}

async function ocrImageBuffer(buf) {
  try {
    const { data } = await Tesseract.recognize(buf, 'eng');
    return (data.text || '').trim();
  } catch (err) {
    console.error('Tesseract OCR error:', err);
    return '';
  }
}
