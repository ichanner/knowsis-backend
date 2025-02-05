export default interface IUser {
  id: string;
  name: string;
  name_vector: string;
  email: string;
  phone: string | null;
  google_id: string | null;
  hash: string | null;
  avatar_url: string | null;
  bio: string | null;
  creation_date: number
}