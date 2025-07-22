export interface MessageItem {
  role: 'user' | 'model';
  content: string;
  timestamp?: string;
}
