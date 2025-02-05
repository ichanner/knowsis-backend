export default interface ILibrary {
  id: string;
  name: string;
  description: string | null;
  name_vector: string;
  description_vector: string;
  cover_url: string | null;
  owner_id: string;
  creation_date: number;
}