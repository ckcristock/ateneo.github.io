export interface History {
  id: string;
  user_id: string;
  agendamiento_id: string;
  description: string;
  image: string;
  icon: string;
  created_at: Date;
  usuario: {
    id: string;
    usuario: string;
    person_id: string;
    image: string;
    person: {
      id: string;
      identifier: string;
      full_name: string;
      first_surname: string;
      first_name: string;
    };
  };
}
