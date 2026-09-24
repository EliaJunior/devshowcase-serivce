import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar tabelas existentes
  await prisma.feedback.deleteMany();
  await prisma.project.deleteMany();
  await prisma.technology.deleteMany();
  await prisma.profile.deleteMany();

  // 1. Criar Tecnologias
  const techTypescript = await prisma.technology.create({
    data: { name: 'TypeScript' },
  });
  const techNode = await prisma.technology.create({
    data: { name: 'Node.js' },
  });
  const techReact = await prisma.technology.create({
    data: { name: 'React' },
  });
  const techPrisma = await prisma.technology.create({
    data: { name: 'Prisma ORM' },
  });

  console.log('✅ Tecnologias criadas');

  // 2. Criar Perfis
  const profileElias = await prisma.profile.create({
    data: {
      name: 'Elias Cunha',
      email: 'elias.cunha@devshowcase.com',
      bio: 'Engenheiro de Software apaixonado por APIs escaláveis, TypeScript e arquitetura limpa.',
    },
  });

  const profileMariana = await prisma.profile.create({
    data: {
      name: 'Mariana Silva',
      email: 'mariana.silva@devshowcase.com',
      bio: 'Desenvolvedora Full Stack com foco no ecossistema JavaScript/TypeScript e React.',
    },
  });

  console.log('✅ Perfis criados');

  // 3. Criar Projetos associados aos Perfis e Tecnologias
  const projectDevShowcase = await prisma.project.create({
    data: {
      title: 'DevShowcase Service',
      description: 'API REST para vitrine de desenvolvedores, seus projetos, tecnologias e feedbacks.',
      repositoryUrl: 'https://github.com/EliaJunior/devshowcase-serivce',
      profileId: profileElias.id,
      technologies: {
        connect: [
          { id: techTypescript.id },
          { id: techNode.id },
          { id: techPrisma.id },
        ],
      },
    },
  });

  const projectDashboard = await prisma.project.create({
    data: {
      title: 'DevShowcase Web UI',
      description: 'Interface web moderna para explorar perfis e avaliar projetos técnicos.',
      repositoryUrl: 'https://github.com/EliaJunior/devshowcase-web',
      profileId: profileMariana.id,
      technologies: {
        connect: [
          { id: techTypescript.id },
          { id: techReact.id },
        ],
      },
    },
  });

  console.log('✅ Projetos criados');

  // 4. Criar Feedbacks para os Projetos
  await prisma.feedback.create({
    data: {
      projectId: projectDevShowcase.id,
      authorName: 'Carlos Tech Lead',
      comment: 'Estruturação impecável de camadas (DTOs, Repositórios, Serviços e Controladores).',
      rating: 5,
    },
  });

  await prisma.feedback.create({
    data: {
      projectId: projectDevShowcase.id,
      authorName: 'Renata QA Engineer',
      comment: 'Validações com Zod muito bem definidas e mensagens de erro amigáveis.',
      rating: 5,
    },
  });

  await prisma.feedback.create({
    data: {
      projectId: projectDashboard.id,
      authorName: 'Lucas Product Manager',
      comment: 'Design clean e ótima usabilidade no fluxo de avaliação.',
      rating: 4,
    },
  });

  console.log('✅ Feedbacks criados');
  console.log('🚀 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
