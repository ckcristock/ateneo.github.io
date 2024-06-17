import { environment } from '../../../environments/environment';
import { Person } from '../interfaces/person.interface';
import { Menu, MenuInterface } from '../interfaces/menu';
import { Board } from '../interfaces/board.interface';
import { Task } from '../interfaces/task.interface';

const base_url = environment.base_url;

export class User {
  constructor(
    public id: string,
    public usuario: string,
    public change_password: boolean,
    public person: Person,
    public menu: MenuInterface,
    public board: Board,
    public task: Task,
    public password?: string,
  ) {}

}
