import axios from 'axios';

const api = axios.create({
  // Modificar de acordo com o endereço do servidor/dispositivo utilizado (emulador Android, iOS, etc.)
  // Pode ser necessário executar o comando abaixo dependendo da plataforma
  // $ adb reverse tcp:3333 tcp:3333
  //baseURL: 'http://localhost:3333',
  baseURL: "http://10.0.2.2:3333",
});

export default api;
