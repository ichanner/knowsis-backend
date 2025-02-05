export default interface ICourseworkProgress {
  user_id: string;
  document_id: string;
  course_id: string;
  module_id: string;
  progress: number;
  last_interaction: number;
}