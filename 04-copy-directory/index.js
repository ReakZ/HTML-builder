const { readdir, access, mkdir, copyFile } = require('fs/promises');
const path = require('path');

const dir = path.join(__dirname, 'files');
const copyDir = path.join(__dirname, 'files-copy');

async function copyFiles(fromDir,toDir) {
  try {
    await access(toDir);
  } catch (error) {
    if (error.code == 'ENOENT') {
      try {
        await mkdir(toDir);
      } catch (error) {
        console.log(error, 'cant create');
      }
    }
  }
  try {
    const filesInDir = await readdir(fromDir, { withFileTypes: true });

    filesInDir.forEach(async (x) => {
      if (x.isFile()) {
        await copyFile(path.join(fromDir, x.name), path.join(toDir, x.name));
      }
    });
  } catch (err) {
    console.log(err);
  }
}

copyFiles(dir,copyDir);

