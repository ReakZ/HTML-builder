const { readdir, access, mkdir, copyFile } = require('fs/promises');
const path = require('path');

const dir = path.join(__dirname, 'files');
const copyDir = path.join(__dirname, 'files-copy');

async function copyFiles() {
  try {
    await access(copyDir);
  } catch (error) {
    if (error.code == 'ENOENT') {
      try {
        await mkdir(copyDir);
      } catch (error) {
        console.log(error, 'cant create');
      }
    }
  }
  try {
    const filesInDir = await readdir(dir, { withFileTypes: true });

    filesInDir.forEach(async (x) => {
      if (x.isFile()) {
        await copyFile(path.join(dir, x.name), path.join(copyDir, x.name));
      }
    });
  } catch (err) {
    console.log(err);
  }
}

copyFiles();

