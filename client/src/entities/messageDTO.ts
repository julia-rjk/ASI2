export interface MessageDTO {
  userId: number;
  sender: string;
  message: string;
  date?: Date;
  room?: string;
}
