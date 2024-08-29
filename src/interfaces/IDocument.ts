export default interface IDocument {
  id: string;
  library_id: string;
  url: string;
  size: number;
  owner_id: string;
  creation_date: number;
  has_chapters: boolean;
  name?: string | null;
  description?: string | null;
  author?: string | null;
  title?: string | null;
  tags?: string[];
  cover_url?: string | null;
  pages_read?: number;
  chapters_read?: number;
  total_pages?: number | null;
  total_chapters?: number | null;
}