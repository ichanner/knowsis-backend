export default interface IDocument {
  id: string;
  library_id: string;
  content_url: string;
  owner_id: string;
  creation_date: number;
  has_chapters: boolean;
  title: string | null;
  description: string | null;
  author: string | null;
  title: string | null;
  title_vector: string;
  author_vector: string;
  description_vector: string;
  tags: string;
  cover_url: string | null;
  total_pages: number | null;
  total_chapters: number | null;
}