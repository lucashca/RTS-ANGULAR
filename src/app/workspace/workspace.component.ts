import { AfterViewChecked,ViewChild,ElementRef,Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import { from } from 'rxjs';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { ModalTaskComponent } from '../modal-task/modal-task.component';
import { Task } from '../class/task';
import {formatDate} from '@angular/common';


@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})

export class WorkspaceComponent implements OnInit,AfterViewChecked {
 
  @ViewChild('scrollConsole',{static: false}) private myScrollContainer: ElementRef;

  tasks = [];
  tasksValidation = true;
  msgValidation = '';
  taskCount = 0;
  animal: string;
  name: string;
  log = [];
  
  smallerCycle:number;
  largerCycle:number;


  bestTaskCombinatioForLargerCycle = []
  bestLargerCycle = null;



  
  
  constructor(public dialog:MatDialog) { }


  setTestDataset(){
    this.tasks.push(new Task('T1',true,18,5,1,2,18,22))
    this.tasks.push(new Task('T1',true,25,5,1,2,24,26))
    this.tasks.push(new Task('T1',true,50,5,1,2,48,51))
    this.tasks.push(new Task('T1',true,50,5,1,2,50,50))
    this.tasks.push(new Task('T1',true,100,5,1,2,95,105))
    /*
    this.tasks.push(new Task('T1',true,20,5,1,2,1,3))
    this.tasks.push(new Task('T1',true,25,5,1,2,1,3))
    this.tasks.push(new Task('T1',true,50,5,1,2,1,3))
    this.tasks.push(new Task('T1',true,50,5,1,2,1,3))
    this.tasks.push(new Task('T1',true,100,5,1,2,1,3))
    */

  }

  ngOnInit() {
    this.setTestDataset()
    this.verifyTasks()
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();        
  }
  addTask(){
    this.taskCount++;
    let tName = 'T'+this.taskCount
    let t = new Task(tName,false); 
    this.tasks.push(t);
    this.addLog('Task '+tName+' has ben created.','addTask()','log-info')
    this.verifyTasks();
   
  }
  
  getLargerCycle(tasks){
    let lc = tasks[0].period;
    for(let t of tasks){
      lc = this.mmc(lc,t.period)
    }
    return lc;
  }

  getSmallerCycle(tasks){
    let sc = tasks[0].period;
    for(let t of tasks){
      sc = this.mdc(sc,t.period)
    }
    this.addLog("Smaller Cycle is "+sc,"","log-ok")
    return sc;
    
  }
  mmc(a,b){
    return a * (b / this.mdc(a, b));
  }
 
  mdc(a,b){
    while(b!=0){
      let r = a % b;
      a = b;
      b = r;
    }
    return a;
  }

  scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
}

  addLog(msg,cmd,logClass){
  

    let data = formatDate(new Date(), 'dd/mm/yy, hh:mm:ss a', 'en');
    let dataLog = { 
      date:data,
      msg:msg,
      cmd:cmd,
      logClass:logClass
    }
    this.log.push(dataLog)
    this.scrollToBottom(); 
  }

  changeTopLog(msg,cmd,logClass){
    let dataLog = { 
      date:formatDate(new Date(), 'dd/mm/yy, hh:mm:ss a', 'en'),
      msg:msg,
      cmd:cmd,
      logClass:logClass
    }

    this.log.pop();
    this.log.push(dataLog)
   
    this.scrollToBottom(); 
  }

  openDialog(id){
    this.addLog('Task '+this.tasks[id].name+' in edit mode.','editTask()','log-info')  
    let dialogRef = this.dialog.open(ModalTaskComponent,{
      width:'35%',
      height:'55%',
      data:this.tasks[id],
    });
    dialogRef.afterClosed().subscribe(result =>{
      if(result){
        this.addLog('Task '+result.name+' is valid.','confirmChangeTask()','log-ok')
        this.tasks[id] = result;   
      }else{
        this.addLog('Task '+this.tasks[id].name+' still the same.','cancelChangeTask()','log-info')  
      }
      this.verifyTasks();
    });
    
  }

  getBestLargerCycle(){
    let newTasks = this.tasks.slice();
    
    for(let i in newTasks){
      
      newTasks[i].period = newTasks[i].minRange;
    }
   let lc = this.getLargerCycle(newTasks);

    this.addLog('Looking for a better longer cycle','getBBestLargerCycle()','log-info');
    this.addLog('Better Larger Cycle: '+this.bestLargerCycle,'getBBestLargerCycle()','log-ok');
    
    this.addLog('Iteration :1 - Larger Cycle: '+lc,'getBBestLargerCycle()','log-info');
    

    if(lc < this.bestLargerCycle){

     this.bestLargerCycle = lc;
      this.bestTaskCombinatioForLargerCycle = this.tasks.map(x => Object.assign({}, x));
      this.addLog('Better Larger Cycle: '+this.bestLargerCycle,'getBBestLargerCycle()','log-ok');
    
    }

    //this.printPeriods(newTasks);
    this.mixLargerCycle(newTasks,this.tasks.length - 1,2)
  
  }
  
  printPeriods(task){
    let msg = ''
    for(let t of task){
      msg += t.period+', '
    }
    console.log(msg)

  }
  mixLargerCycle(task,id,iteration){
    
    let p = task[id].period
    let min =   task[id].minRange
    let max =   task[id].maxRange

    let nextId:number; 
    let nextIteration:number;

    if(id < task.length - 1){
      nextId = task.length-1;
      nextIteration = iteration;
    }else if(id == task.length - 1){
      nextId = id;
      nextIteration = iteration + 1;
    }

    if(p+1 <= max){
      task[id].period = task[id].period + 1;
      let lc = this.getLargerCycle(task);
      let msg = 'Iteration :'+iteration+' - Larger Cycle: '+lc;
      this.changeTopLog(msg,'mixLargerCycle()','log-info');
      if(lc < this.bestLargerCycle){
        console.log("Entroui")
     
        this.bestLargerCycle = lc;
        this.bestTaskCombinatioForLargerCycle = this.tasks.map(x => Object.assign({}, x));
     
        this.addLog('Better Larger Cycle: '+this.bestLargerCycle,'getBBestLargerCycle()','log-ok');
        let msg = 'Iteration :'+iteration+' - Larger Cycle: '+lc;
        this.addLog(msg,'mixLargerCycle()','log-info');
       
      }
      //this.printPeriods(task);

    
    
    }else{
      task[id].period = task[id].minRange;
      nextId = id - 1;
      if(id == 0){
        console.log(this.bestTaskCombinatioForLargerCycle);

        this.tasks = this.bestTaskCombinatioForLargerCycle.map(x => Object.assign({}, x));

        console.log(this.tasks);
        this.verifyTasks()
        
        return;
      }
    }

    
  
    
  
    setTimeout(() =>{
      this.mixLargerCycle(task,nextId,nextIteration)
    }, 5);
   


  }

  verifyTasks(){
    this.tasksValidation = true;
    let msgValidation = 'The tasks'
    let cont = 0;
    for(let t of this.tasks){
      if(!t.valid){
        cont++;
        this.tasksValidation = false;
        if(cont == 1){
          msgValidation += ' '+t.name;
        }else{
          msgValidation += ', '+t.name;  
        }
      }
    }
    if(cont == 1){
      msgValidation += ' are not valid.';  
      this.addLog(msgValidation ,null,'log-error')
  
    }
    if(cont > 1){
      msgValidation += ' are not valids.';  
      this.addLog(msgValidation ,null,'log-error')
  
    }
    if(cont == 0){
      if(this.tasks.length > 0){
        msgValidation = 'All tasks are valids';  
      }else{
        msgValidation = 'All tasks are valid';    
      }
      this.addLog(msgValidation ,null,'log-ok')
      this.largerCycle =  this.getLargerCycle(this.tasks);
      this.smallerCycle =  this.getSmallerCycle(this.tasks);

      this.bestLargerCycle = this.largerCycle;

      this.bestTaskCombinatioForLargerCycle = this.tasks.map(x => Object.assign({}, x));
      console.log(this.bestTaskCombinatioForLargerCycle);

      this.addLog("Larger Cycle is "+this.bestLargerCycle,"","log-ok")
  
    }
    
  }

}
