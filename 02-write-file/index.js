const path = require('path');
const fs = require('fs');
const { exit } = require('process');
const { stdin } = process;

fs.writeFile(path.join(__dirname, 'mynotes.txt'), '', (err) => {
  if (err) throw err;
});

console.log('Введите текст или введите "exit" для выхода из программы.');
stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    onExit();
  } else {
    fs.appendFile(
      path.join(__dirname, 'mynotes.txt'),
      data.toString().trim() + '\n',
      (err) => {
        if (err) throw err;
      }
    );
  }
});

function onExit() {
  console.log('Удачи в изучении Node.js!');
  exit();
}
process.on('SIGINT', () => {
  onExit();
});
