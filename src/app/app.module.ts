import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatButtonModule} from '@angular/material/button';
import { MatCheckboxModule} from '@angular/material/checkbox';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { WorkspaceComponent } from './workspace/workspace.component';
import { ModalTaskComponent } from './modal-task/modal-task.component';
import { MatDialogModule} from '@angular/material';
import {MatFormFieldModule} from '@angular/material';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material';
import { FormsModule } from '@angular/forms';

import { from } from 'rxjs';


@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    WorkspaceComponent,
    ModalTaskComponent,
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule
  
  ],
  exports: [
    MatButtonModule,
    ],
  providers: [
   ],
  entryComponents:[
    ModalTaskComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
