import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Todo } from 'src/app/services/todo/model/todo';
import { TodoService } from 'src/app/services/todo/todo.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.scss']
})
export class ToDoComponent implements OnInit {

  fGroup: FormGroup;
  dataSource: Observable<Todo[]>;

  constructor(
    private formBuilder: FormBuilder,
    private todoService: TodoService,
  ) {
    this.refreshList();
  }

  ngOnInit() {
    this.fetchData();
    this.fGroup = this.formBuilder.group({
      task: ['', [Validators.required]]
    });
  }

  add() {
    this.fGroup.markAllAsTouched();

    if (this.validSubmit()) {
      const date = new Date()
      this.todoService.insert({
        id: uuidv4(),
        created_at: date,
        updated_at: date,
        done: false,
        description: this.fGroup.value.task
      });
      this.fGroup.reset();
      this.fetchData();
    }
  }

  validSubmit(): boolean {
    if (this.fGroup.valid) {
      return true;
    } else {
      return false;
    }
  }

  changeStatus(e: any) {
    this.todoService.update(e.target.value).subscribe(result => {
      this.fetchData();
    });
  }

  async fetchData() {
    this.dataSource = await this.todoService.getAll();
  }

  refreshList() {
    this.todoService.todoInsertedInApi.subscribe(result => {
      if (result) {
        this.fetchData();
      }
    })
  }
}
