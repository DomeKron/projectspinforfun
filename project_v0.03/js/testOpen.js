const open = require('open').default; // Добавлено ".default"

async function testOpen() {
  try {
    console.log('Открываю файл...');
    await open('C:/Users/hukhu/Desktop/project_v0.03/html/panel.html');
    console.log('Файл открыт успешно.');
  } catch (err) {
    console.error('Ошибка при открытии файла:', err);
  }
}

testOpen();