const pdfParse = require('pdf-parse');
const fs = require('fs').promises;

const parseResume = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    return {
      text: data.text,
      metadata: data.metadata,
      numPages: data.numpages
    };
  } catch (error) {
    throw new Error(`PDF Processing Failed: ${error.message}`);
  }
};

module.exports = { parseResume };
