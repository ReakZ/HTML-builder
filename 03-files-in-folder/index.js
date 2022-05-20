const { readdir, stat } = require('fs/promises');
const path = require('path');

const secretFolder = path.join(__dirname, 'secret-folder');

async function reader() {
  try {
    const dir = await readdir(secretFolder, { withFileTypes: true });
    const onlyFiles = dir.filter((f) => f.isFile());

    onlyFiles.forEach(async (x) => {
      console.log(await getDat(x));
    });
  } catch (err) {
    console.log(err);
  }
}

async function getDat(file) {
  const pf = path.join(secretFolder, file.name);
  const statSize = await stat(pf, function (err, stats) {
    if (err) console.log(err);
    return stats.size;
  });

  return `${path.parse(file.name).name} - ${path
    .extname(file.name)
    .slice(1)} - ${statSize.size} bytes`;
}

reader();
