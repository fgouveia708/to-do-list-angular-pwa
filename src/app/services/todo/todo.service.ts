import { Injectable, Injector } from '@angular/core';
import { BaseService } from '../base/base.service';
import { Todo } from './model/todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService extends BaseService<Todo> {

  constructor(
    protected injector: Injector
  ) {
    super(injector, 'todo', 'http://localhost:9000/api/todo');
  }
}
