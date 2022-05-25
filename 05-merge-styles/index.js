const { readdir, readFile, appendFile, writeFile } = require('fs/promises');
const path = require('path');

const stylesPath = path.join(__dirname, 'styles');
const pathToBundleFile = path.join(__dirname, 'project-dist', 'bundle.css');
async function packStyles(stylesPath, pathToBundleFile) {
  try {
    await writeFile(pathToBundleFile, '');
  } catch (error) {
    console.log(error);
  }
  let stylesArray = [];
  const listStyleFiles = [];
  try {
    const listFiles = await readdir(stylesPath, { withFileTypes: true });
    listFiles.forEach(async (fileCss) => {
      if (path.extname(fileCss.name) === '.css') {
        listStyleFiles.push(fileCss.name);
      }
    });

    stylesArray = listStyleFiles.map((x) => {
      return takeStyles(x);
    });

    const bufferData = await Promise.all(stylesArray);
    let totalStyle = bufferData.map((buff) => buff.toString());
    let ccsData = '';
    totalStyle.forEach((x) => (ccsData += x));
    await addToBundle(ccsData);
  } catch (error) {
    console.log(error);
  }

  async function takeStyles(x) {
    const style = await readFile(path.join(__dirname, 'styles', x));
    return style;
  }

  async function addToBundle(style) {
    try {
      appendFile(pathToBundleFile, style, (err) => {
        if (err) throw err;
      });
    } catch (error) {
      console.log(error);
    }
  }
}

packStyles(stylesPath, pathToBundleFile);
