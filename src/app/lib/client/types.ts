export interface NoteData {
  id: string;
  user_id: string;
  parent_id: string;

  title: string;
  content: string;

  created_at: Date;
  updated_at: Date;

  is_published: boolean;

  child_notes: NoteData[];
  child_count: number;
}
