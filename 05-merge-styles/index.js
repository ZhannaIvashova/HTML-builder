const fs = require('fs');
const path = require('path');

const fileStylesPath = path.join(__dirname, 'styles');
const fileBundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

async function readCssFiles() {
  await fs.promises.unlink(fileBundlePath).catch((err) => {
    if (err.code !== 'ENOENT') throw err;
  });

  try {
    const files = await fs.promises.readdir(fileStylesPath, {
      withFileTypes: true,
    });

    const cssFiles = files
      .filter(
        (file) => file.isFile() && path.extname(file.name).slice(1) === 'css',
      )
      .map((file) => {
        const filePath = path.join(fileStylesPath, file.name);
        return fs.promises.readFile(filePath, 'utf-8');
      });

    const dataStyle = await Promise.all(cssFiles);

    writeDataToFileBundle(dataStyle.join('\n'));
  } catch (err) {
    console.error('Error:', err);
  }
}

function writeDataToFileBundle(dataStyle) {
  fs.writeFile(fileBundlePath, dataStyle, 'utf-8', (err) => {
    if (err) {
      console.error('Error write to file:', err);
    } else {
      console.log('CSS bundle file created successfully!');
    }
  });
}

readCssFiles();
