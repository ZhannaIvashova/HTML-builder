const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = require('process');

const filePath = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(filePath, { flags: 'w' });

stdout.write('What is your favorite color?\n');

stdin.on('data', (userInput) => {
  if (userInput.toString().trim() === 'exit') {
    stdout.write('Goodbye!');
    exit();
  } else {
    writeStream.write(userInput);
  }
});

process.on('SIGINT', () => {
  stdout.write('Goodbye!');
  exit();
});
