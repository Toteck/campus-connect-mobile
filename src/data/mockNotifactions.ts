import { Notification } from "@/types/notification";

export const mockNotification: Notification[] = [
  {
    id: "1",
    title: "Novo Edital Disponível",
    description: "Confira o novo edital publicado para o curso de engenharia.",
    tag: "edital",
    createdAt: "2 horas atrás",
  },
  {
    id: "2",
    title: "Notícia Importante",
    description: "Atualizações sobre o retorno das aulas presenciais.",
    tag: "notícia",
    createdAt: "1 dia atrás",
  },
  {
    id: "3",
    title: "Reunião com os Professores",
    description: "Reunião agendada para discutir o calendário acadêmico.",
    tag: "reunião",
    createdAt: "3 dias atrás",
  },
  {
    id: "4",
    title: "Aviso de Manutenção",
    description:
      "Manutenção programada na plataforma no próximo fim de semana.",
    tag: "aviso",
    createdAt: "5 dias atrás",
  },
  {
    id: "5",
    title: "Limpeza da Biblioteca",
    description: "O a biblioteca será limpa esta tarde.",
    tag: "aviso",
    createdAt: "5 dias atrás",
  },
];
