import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TodoRequest } from './model/todo-request';
import { TodoResponse } from './model/todo-response';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private ENDPOINT = "http://localhost:9000";

  constructor(
    private http: HttpClient
  ) { }

  insert(request: TodoRequest) {
    return this.http.post(this.ENDPOINT + '/api/todo', request);
  }

  update(id: string) {
    return this.http.patch(this.ENDPOINT + '/api/todo', { id });
  }

  getAll(){
    return this.http.get<TodoResponse[]>(this.ENDPOINT + '/api/todo');
  }
}
