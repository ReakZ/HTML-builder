const {
  writeFile,
  readdir,
  readFile,
  appendFile,
  access,
  mkdir,
  copyFile,
  rmdir
} = require('fs/promises');
const path = require('path');

const dirForPage = path.join(__dirname, 'project-dist');
const pathTopage = path.join(dirForPage, 'index.html');
const pathToTemplate = path.join(__dirname, 'template.html');
const pathToComponents = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const pathToBundleFile = path.join(__dirname, 'project-dist', 'style.css');
const sourceDirAssets = path.join(__dirname, 'assets');
const distDirAssets = path.join(__dirname, 'project-dist', 'assets');

async function getTemplate() {
  await createDir(dirForPage);
  await writeFile(pathTopage, await insertComponents());
  await packStyles(stylesPath, pathToBundleFile);
  await copyFiles(sourceDirAssets, distDirAssets);
}
async function insertComponents() {
  let templateHtml = await readTemplate(pathToTemplate);
  let listBlocks = await createListBlocks(pathToComponents);

  const rexgz = /{{(\w*)}}/;
  listBlocks.forEach(() => {
    templateHtml = templateHtml.replace(rexgz, function (currentBlock) {
      return listBlocks.filter((val) => val.name == currentBlock)[0].data;
    });
  });

  return templateHtml;
}

async function createDir(pathToDir) {
  try {
    await access(pathToDir);
  } catch (error) {
    if (error.code == 'ENOENT') {
      try {
        await mkdir(pathToDir);
      } catch (error) {
        console.log(error, 'cant create');
      }
    }
  }
}

async function readTemplate(dir) {
  try {
    const data = await readFile(dir);
    return data.toString();
  } catch (error) {
    console.log(error);
  }
}

async function createListBlocks(dir) {
  const listComponents = [];
  const listFiles = await readdir(dir, { withFileTypes: true });
  listFiles.forEach(async (componentFile) => {
    if (path.extname(componentFile.name) === '.html') {
      listComponents.push(componentFile.name);
    }
  });
  const listOfComponentFiles = listComponents.map(async (component) => {
    const data = await readFile(path.join(dir, component));
    return { name: `{{${path.parse(component).name}}}`, data: data.toString() };
  });
  const resultlist = await Promise.all(listOfComponentFiles);
  return resultlist;
}

(function () {
  getTemplate();
})();

// merge style function from 05 task
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

    totalStyle.reverse().forEach((x) => addToBundle(x));
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

// copy-directory function from 04 task

async function copyFiles(fromDir, toDir) {
  try {
    await mkdir(toDir);
  } catch (err) {
    if (err.code == 'EEXIST') {
      await rmdir(toDir, { recursive: true });
      await mkdir(toDir);
    }
  } finally {
    const filesInDir = await readdir(fromDir, { withFileTypes: true });

    filesInDir.forEach(async (x) => {
      if (x.isFile()) {
        await copyFile(path.join(fromDir, x.name), path.join(toDir, x.name));
      }
      if (x.isDirectory()) {
        await copyFiles(path.join(fromDir, x.name), path.join(toDir, x.name));
      }
    });
  }
}
