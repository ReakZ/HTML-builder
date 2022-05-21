const { writeFile } = require('fs');
const { readdir, readFile, appendFile } = require('fs/promises');
const path = require('path');

async function packStyles() {
  const stylesPath = path.join(__dirname, 'styles');
  const pathToBundleFile = path.join(__dirname, 'project-dist', 'bundle.css');
  writeFile(pathToBundleFile, '', (err) => {
    if (err) throw err;
  });
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

    totalStyle.forEach((x) => addToBundle(x));
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

packStyles();


