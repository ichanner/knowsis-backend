export default interface IProgress {
  user_id: string;
  document_id: string;
  pages_read: number;
  chapters_read: number | null;
}