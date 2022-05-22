const { readdir, mkdir, copyFile, rmdir } = require('fs/promises');
const path = require('path');

const dir = path.join(__dirname, 'files');
const copyDir = path.join(__dirname, 'files-copy');

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

copyFiles(dir, copyDir);
