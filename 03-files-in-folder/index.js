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
        const fileExtension = path.extname(file.name);
        const faleName = path.basename(file.name, fileExtension);

        fs.stat(fullFilePath, (err, stats) => {
          if (err) {
            console.log(err);
          } else {
            console.log(
              `${faleName} - ${fileExtension.slice(1)} - ${(
                Number(stats.size) / 1024
              ).toFixed(3)}kb`,
            );
          }
        });
      }
    });
  }
});
