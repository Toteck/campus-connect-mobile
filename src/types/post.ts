export interface Post {
  id: number;
  title: string;
  content: string;
  tag: string;
  cover: string;
  anexos: Array<{
    id: number;
    title: string;
    url: string;
  }>;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  subtitle: string;
}
