const fs = require('fs');
const path = require('path');

const filesPath = path.join(__dirname, 'files');
const filesCopyPath = path.join(__dirname, 'files-copy');

function copyDir(filesDir, filesCopyDir) {
  fs.mkdir(filesCopyDir, { recursive: true }, (err) => {
    if (err) {
      console.log('Error creat directory:', err);
    }

    fs.readdir(filesCopyDir, { withFileTypes: true }, (err, filesCopy) => {
      if (err) {
        console.log('Error read filesCopyDir:', err);
      }

      fs.readdir(filesDir, { withFileTypes: true }, (err, files) => {
        if (err) {
          console.log('Error read filesDir:', err);
        }

        const fileNames = files.map((file) => file.name);

        filesCopy.forEach((file) => {
          if (!fileNames.includes(file.name)) {
            const filePath = path.join(filesCopyDir, file.name);

            fs.rm(filePath, { recursive: true, force: true }, (err) => {
              if (err) {
                console.log(`Error delete file ${file.name}:`, err);
              } else {
                console.log(`Delete file ${file.name}`);
              }
            });
          }
        });

        files.forEach((file) => {
          const filePath = path.join(filesDir, file.name);
          const fileCopyPath = path.join(filesCopyDir, file.name);

          if (file.isFile()) {
            fs.copyFile(filePath, fileCopyPath, (err) => {
              if (err) {
                console.log('Error copy file:', err);
              }
              console.log(`Copy file: ${file.name}`);
            });
          } else if (file.isDirectory()) {
            copyDir(filePath, fileCopyPath);
          }
        });
      });
    });
  });
}

copyDir(filesPath, filesCopyPath);
