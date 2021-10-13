import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { TodoResponse } from 'src/app/services/todo/model/todo-response';
import { TodoService } from 'src/app/services/todo/todo.service';

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.scss']
})
export class ToDoComponent implements OnInit {

  fGroup: FormGroup;
  dataSource: Observable<TodoResponse[]>;

  constructor(
    private formBuilder: FormBuilder,
    private todoService: TodoService
  ) { }


  ngOnInit() {
    this.fetchData();
    this.fGroup = this.formBuilder.group({
      task: ['', [Validators.required]]
    });
  }

  add() {
    this.fGroup.markAllAsTouched();

    if (this.validSubmit()) {
      this.todoService.insert({ description: this.fGroup.value.task }).subscribe(result => {
        console.log(result);
        this.fetchData();
      });
      this.fGroup.reset();
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

  fetchData() {
    this.dataSource = this.todoService.getAll();
  }
}
