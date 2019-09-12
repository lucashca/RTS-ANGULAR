import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {MAT_DIALOG_DATA} from "@angular/material";
import {Task} from "../class/task"


@Component({
  selector: 'app-modal-task',
  templateUrl: './modal-task.component.html',
  styleUrls: ['./modal-task.component.css']
})
export class ModalTaskComponent implements OnInit {

  constructor(public myDialogRef:MatDialogRef<ModalTaskComponent>, @Inject(MAT_DIALOG_DATA) public task:Task) { }

  


  ngOnInit() {
  }

  onCancel(){
    this.myDialogRef.close(null)
    console.log(this.task)
  }
  onConfirm(){
    this.task.valid = true;
    this.myDialogRef.close(this.task)
    console.log(this.task)
  }
}
