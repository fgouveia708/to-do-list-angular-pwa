import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-to-do',
  templateUrl: './to-do.component.html',
  styleUrls: ['./to-do.component.scss']
})
export class ToDoComponent implements OnInit {

  fGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }


  ngOnInit() {
    this.fGroup = this.formBuilder.group({
      task: ['', [Validators.required]]
    });
  }

  add() {
    this.fGroup.markAllAsTouched();

    if (this.validSubmit()) {
      console.log(this.fGroup.value);
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
    if (e.target.checked) {
      console.log(e.target.value);
    }
  }
}
