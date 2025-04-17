const WebSocket = require('ws');

const ACCESS_TOKEN = 'plhtnf1oo9b51pfi1jyargv62bvnko'; // Ваш токен
const CLIENT_ID = 'gp762nuuoqcoxypju8c569th9wz7q5'; // Ваш Client ID
const CHANNEL_ID = '423975429'; // ID вашего Twitch-канала

const WS_URL = 'wss://pubsub-edge.twitch.tv';

const ws = new WebSocket(WS_URL);

const open = require('open').default; // Или const open = require('open').default, если требуется

function startRoulette() {
  console.log('Запуск рулетки...');
  open('C:/Users/hukhu/Desktop/project_v0.03/html/panel.html')
    .then(() => console.log('Файл открыт успешно.'))
    .catch(err => console.error('Ошибка при открытии файла:', err));
}
const listenMessage = {
  type: 'LISTEN',
  data: {
    topics: [`channel-points-channel-v1.${CHANNEL_ID}`],
    auth_token: ACCESS_TOKEN,
  },
};

ws.on('open', () => {
  console.log('Подключено к Twitch PubSub');
  ws.send(JSON.stringify(listenMessage));
});

ws.on('message', (data) => {
  const message = JSON.parse(data);

  if (message.type === 'MESSAGE') {
    const payload = JSON.parse(message.data.message);
    if (payload.type === 'reward-redeemed') {
      const reward = payload.data.redemption.reward;
      console.log(`Награда "${reward.title}" была куплена!`);

      // Проверяем, совпадает ли название награды
      if (reward.title === 'Тестовая награда') { // Замените на название вашей награды
        startRoulette(); // Запуск `panel.html`
      }
    }
  }
});

ws.on('error', (error) => {
  console.error('Ошибка WebSocket:', error);
});

ws.on('close', () => {
  console.log('Соединение закрыто.');
});
