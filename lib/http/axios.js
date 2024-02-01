let instance = {
  baseURL: process.env.PROCTOR_BACKEND,
  timeout: 50000000,
  headers: { "Content-Type": "application/json" }
};
let recognizer = {
  baseURL: process.env.RECOGNIZER,
  timeout: 60000,
  headers: { "Content-Type": "application/json","X-Api-Key":'iuqu5aishai7Nuothacohcah' }
};
let ai_serive = {
  baseURL: process.env.AI_SERVICE,
  timeout: 50000000,
  headers: { "Content-Type": "application/json","X-Api-Key":'iuqu5aishai7Nuothacohcah' }
};
let sync = {
  baseURL: process.env.SYNC,
  timeout: 50000000,
  headers: { "Content-Type": "application/json","X-Api-Key":'iuqu5aishai7Nuothacohcah' }
};
let user_service = {
  baseURL: process.env.USER_SERVICE,
  timeout: 50000000,
  headers: { "Content-Type": "application/json","X-Api-Key":'iuqu5aishai7Nuothacohcah' }
};
  let Tao_service = {
  baseURL: process.env.Tao_SERVICE,
  timeout: 50000000
  //headers: { "Content-Type": "application/json","X-Api-Key":'iuqu5aishai7Nuothacohcah' }
};

module.exports = {
  instance,
  recognizer,
  ai_serive,
  sync,
  user_service,
  Tao_service
};
