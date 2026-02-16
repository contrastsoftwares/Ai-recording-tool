export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  attachments?: Attachment[];
}

export interface Attachment {
  type: "image" | "file";
  name: string;
  url: string;
}

export interface Conversation {
  id: string;
  noteId: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}
