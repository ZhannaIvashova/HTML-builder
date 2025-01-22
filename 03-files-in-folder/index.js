const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'secret-folder');

fs.readdir(filePath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    files.forEach((file) => {
      if (file.isFile()) {
        const fullFilePath = path.join(filePath, file.name);
        const fileExtension =
          path.extname(file.name).slice(1) || 'no-extension';
        let faleName = path.basename(file.name, fileExtension);
        if (faleName.startsWith('.') || faleName.endsWith('.')) {
          faleName = faleName.replace('.', '');
        }

        fs.stat(fullFilePath, (err, stats) => {
          if (err) {
            console.log(err);
          } else {
            console.log(
              `${faleName} - ${fileExtension} - ${(
                Number(stats.size) / 1024
              ).toFixed(3)}kb`,
            );
          }
        });
      }
    });
  }
});
