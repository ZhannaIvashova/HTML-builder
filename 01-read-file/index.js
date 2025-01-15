const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, 'text.txt');
console.log(filePath);

const stream = fs.createReadStream(filePath, 'utf-8');
stream.pipe(process.stdout);

stream.on('error', (error) => {
  console.error('Error reading file:', error.message);
});
