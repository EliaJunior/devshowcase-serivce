import app from './app';
import { env } from './config/env';

const server = app.listen(env.PORT, () => {
  const url = `http://localhost:${env.PORT}`;
  const green = '\x1b[32m';
  const cyan = '\x1b[36m';
  const yellow = '\x1b[33m';
  const bold = '\x1b[1m';
  const reset = '\x1b[0m';

  console.log(`
${green}${bold}====================================================${reset}
${green}${bold}       ✨  SISTEMA INICIADO COM SUCESSO!  ✨         ${reset}
${green}${bold}====================================================${reset}
  ${cyan}🚀 Serviço${reset}      : ${bold}DevShowcase REST API${reset}
  ${cyan}🌐 Endereço${reset}     : ${yellow}${url}${reset}
  ${cyan}🩺 Health Check${reset} : ${yellow}${url}/health${reset}
  ${cyan}📚 Documentação${reset} : ${yellow}README.md / DevShowcase.postman_collection.json${reset}
  ${cyan}📦 Ambiente${reset}     : ${bold}${env.NODE_ENV}${reset}
  ${cyan}🗄️  Banco${reset}        : PostgreSQL (Prisma ORM)
${green}${bold}====================================================${reset}
${bold}Pronto para receber requisições! 🎯${reset}
`);
});

export default server;
