export interface Note {
  id: string;
  id_dossier: string;
  titre: string;
  contenu: string;
  created_at: string;
  updated_at: string;
}
export interface CreateNoteDto {
  id_dossier: string;
  titre: string;
  contenu: string;
}
export interface UpdateNoteDto extends Partial<CreateNoteDto> {}