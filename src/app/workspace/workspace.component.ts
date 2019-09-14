import { AfterViewChecked,ViewChild,ElementRef,Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import { from } from 'rxjs';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { ModalTaskComponent } from '../modal-task/modal-task.component';
import { Task } from '../class/task';
import {formatDate} from '@angular/common';
import { GeneticAlgoritm } from './geneticAlgoritm';


@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})

export class WorkspaceComponent implements OnInit,AfterViewChecked {
 
  @ViewChild('scrollConsole',{static: false}) private myScrollContainer: ElementRef;


  ga:GeneticAlgoritm;

  tasks = [];
  tasksValidation = true;
  msgValidation = '';
  taskCount = 0;
  animal: string;
  name: string;
  log = [];
  
  smallerCycle:number;
  largerCycle:number;
  
  totalJitter = 0;
  tasksCombination = [];
  subTasks = [];

  bestTaskCombinatioForLargerCycle = []
  bestLargerCycle = null;

  validCombinations = false;
  population = 1000;
  combinations = [];
  combinationTimeline = [];
  timeLine = []
  
  bestJitter = -1
  bestCombination = [];
  populationSize = 1;
  
  constructor(public dialog:MatDialog) { }


  setTestDataset(){
    this.tasks.push(new Task('B0',true,true,100,5,1,2,20,20))
   // this.tasks.push(new Task('B1',true,100,5,1,2,20,20))
    this.tasks.push(new Task('T1',true,false,20,5,1,2,18,22))
    this.tasks.push(new Task('T2',true,false,25,8,1,2,24,26))
    this.tasks.push(new Task('T3',true,false,50,5,1,2,48,51))
    this.tasks.push(new Task('T4',true,false,50,4,1,2,50,50))
    this.tasks.push(new Task('T5',true,false,100,10,2,2,95,105))
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
    let t = new Task(tName,false,false); 
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

  
  
  printPeriods(task){
    let msg = ''
    for(let t of task){
      msg += t.period+', '
    }
    console.log(msg)

  }

/*
  getAllTagsForCombination(){
    let schedulesTasks = [];
    let cont = 0;
    for(let j in this.tasks){
      let t = this.tasks[j];
      let repeats =  this.largerCycle/t.period;
      let repeatsOfRepeats = Math.round(t.runtime/this.smallerCycle);
      if(repeatsOfRepeats == 0){
        repeatsOfRepeats = 1;
      }
      for(let i = 1; i <= repeats; i++ ){
        for(let k = 1; k <= repeatsOfRepeats; k++){
          
           let itemSchedule = {
            taskTypeId:j,
            taskName:t.name,
            lastTask:false,
            idleTime:0
          }
          cont++;
          schedulesTasks.push(itemSchedule);
        }
      }
    }
    this.tasksCombination ={combination:schedulesTasks,valid:this.verifyCombinations(schedulesTasks)}
  }

*/
  getAllTaskInCycle(tasks,smallerCycle,largerCycle){
    let elements = [];

    for(let i in tasks){
      let t = tasks[i];
      let repeats =  largerCycle/t.period;
     
      for(let j= 1; j <= repeats; j++ ){
          elements.push(i);
      }
      
    }
    return elements;
  }

  getSubTaskInCycle(tasks,tasksId,smallerCycle){

    let elements = [];
    this.timeLine = [];
    this.combinationTimeline = [];
    let cont = 0;
    for(let id of tasksId){
      let t = tasks[id];
      let repeatsOfRepeats = Math.round(t.runtime/smallerCycle);
      if(repeatsOfRepeats == 0){
        repeatsOfRepeats = 1;
      }
      
      this.combinationTimeline.push(cont*this.smallerCycle);
  

      for(let k = 1; k <= repeatsOfRepeats; k++){
        elements.push(id);
     
        this.timeLine.push(cont*this.smallerCycle)
        cont++;
      }

    }
    
    return(elements);

    
  }

  setIdleTime(tasks){
    let newTasks = []
    for(let t of tasks){
      let task = this.tasks[t.taskTypeId]
      let nt = t;
      let idleTime = 0;
      if(task.runtime % this.smallerCycle){
        idleTime = this.smallerCycle - (task.runtime % this.smallerCycle);
      }
      
      nt.idleTime = idleTime;  
      newTasks.push(nt)
    }
    return newTasks;
  }

  getIdleTime(t){

    let idleTime = 0;
    if(t.runtime % this.smallerCycle){
      idleTime = this.smallerCycle - (t.runtime % this.smallerCycle);
    }
  
  }

  verifyCombinations(tasks,tasksid,smallerCycle,largerCycle){

   let res1 = this.varifyMaxJitter(tasks,tasksid,smallerCycle,largerCycle);
  
   return res1;
  }
 
 varifyMaxJitter(tasks,tasksId,smallerCycle,largerCycle){
   this.totalJitter = 0;
    for(let id in tasks){
      let t = tasks[id];
      let oldTime = 0;
      let cont = 0;
      let fistTaskTime = 0;
      let it = 0;
      let maxPeriod = t.period + smallerCycle;
      let deltaT = 0;
      
      for(let j in tasksId){
        let i = tasksId[j];
        let timeLine = this.combinationTimeline[j];
        

        if(id == i){

          if(it == 0){
            fistTaskTime = timeLine;
            it = 1;
          }
          deltaT = timeLine - oldTime;
            let jitter = 0;
          if(!t.blanck && (largerCycle/t.period) > 1 && timeLine>0){
            jitter = deltaT - t.period
            if(jitter < 0) {jitter =0;}

            this.totalJitter += Math.abs(t.period - deltaT) 
          }
          //console.log("Task "+t.name+' Id '+id+" Max Period " + maxPeriod + " Delata T - " + deltaT+ " Timeline - " + timeLine + " old Start "+oldTime+" Jitter "+jitter)

          if(maxPeriod < deltaT){
         
            return false;
          }
          oldTime = timeLine 
        }
      }
      let nextPeriod = largerCycle + fistTaskTime;
      deltaT = nextPeriod - oldTime;
      //console.log("Task "+t.name+' Id '+id+" Max Period " + maxPeriod + " Delata T - " + deltaT+ " Timeline - " + nextPeriod + " old Start "+oldTime)
      if(maxPeriod < deltaT){
        return false;
      }

    }
 
    return true;    
  
  } 

  verifySequence(arr){
    for(let i of arr){
      if(i+1 <= arr.length - 1){
        let actual = arr[i];
        let next = arr[i+1];
        if(actual.id == next.id){
          return false;
        }
      }
    }
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
      this.addLog("Larger Cycle is "+this.bestLargerCycle,"","log-ok")
 
     
      /*
         console.log(this.ga.getPopulation())
      */
    }
    
  }



  run(){
      this.getBestLargerCycle()
    
  }

shurffle(arr,num){
            for( var i = 0; i < num; i++){
                var j = Math.floor(Math.random()*arr.length);
                var k = Math.floor(Math.random()*arr.length);
                this.swap(arr,j,k);
            }
        
        }
        
        swap(a, i, j) {
            var temp = a[i];
            a[i] = a[j];
            a[j] = temp;
        }

        
        resolveAfterXMiliSeconds(x) {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve(x);
            }, x);
          });
        }

  async getBestCombinationForSchedule(){

    this.tasksCombination = this.getAllTaskInCycle(this.tasks,this.smallerCycle,this.largerCycle);
    this.subTasks = this.getSubTaskInCycle(this.tasks,this.tasksCombination,this.smallerCycle);
    this.addLog("Iniciando ...","",'log-info');
   
    this.bestJitter - 1;
    for(let i = 0; i < this.populationSize; i++){
      await this.resolveAfterXMiliSeconds(0);
      this.shurffle(this.tasksCombination,50)  
      let percent = (i/this.populationSize)*100;
     let msg = i+"/"+this.populationSize+ " " + percent.toFixed(2) +"% - Combination - " + this.tasksCombination;
     this.changeTopLog(msg,'','log-info');
     this.subTasks = this.getSubTaskInCycle(this.tasks,this.tasksCombination,this.smallerCycle);
     this.validCombinations =  this.verifyCombinations(this.tasks,this.tasksCombination,this.smallerCycle,this.largerCycle);
   
     if(this.validCombinations){
       console.log("entrou" + this.bestJitter + " total jitter "+ this.totalJitter)

       if(this.bestJitter < 0 || this.bestJitter > this.totalJitter){
         console.log("entrou tb")
         this.bestJitter = this.totalJitter;
         this.validCombinations = false;
         this.bestCombination = this.getSubTaskInCycle(this.tasks,this.tasksCombination,this.smallerCycle);
         console.log(this.bestCombination)
       }
     }
      /*
      await setTimeout(()=>{

          this.shurffle(this.tasksCombination,10)  
           let percent = (i/this.populationSize)*100;
          let msg = i+"/"+this.populationSize+ " " + percent.toFixed(2) +"% - Combination - " + this.tasksCombination;
          this.changeTopLog(msg,'','log-info');
          this.subTasks = this.getSubTaskInCycle(this.tasks,this.tasksCombination,this.smallerCycle);
          this.validCombinations =  this.verifyCombinations(this.tasks,this.tasksCombination,this.smallerCycle,this.largerCycle);
        
          if(this.validCombinations){
            console.log("entrou" + this.bestJitter + " total jitter "+ this.totalJitter)

            if(this.bestJitter < 0 || this.bestJitter > this.totalJitter){
              console.log("entrou tb")
              this.bestJitter = this.totalJitter;
              this.validCombinations = false;
              this.bestCombination = this.getSubTaskInCycle(this.tasks,this.tasksCombination,this.smallerCycle);
              console.log(this.bestCombination)
            }
          }


    },1000);  

   */

    }
    this.addLog("Verificando combiações","",'log-info');
    
    this.addLog(this.tasksCombination,'','log-info');
  

    /*

    this.tasksCombination = this.getAllTaskInCycle(this.tasks,this.smallerCycle,this.largerCycle);
    this.subTasks = this.getSubTaskInCycle(this.tasks,this.tasksCombination,this.smallerCycle);
    this.ga = new GeneticAlgoritm(this.tasksCombination,this.populationSize,0.01);
    let combinations = this.ga.getPopulation();

    this.addLog("Verificando combiações","",'log-info');
    this.addLog(this.tasksCombination,'','log-info');

    let it = 0;
    for(let c of combinations){
      if(this.validCombinations){
        break;
      }

      if(!this.validCombinations){
        this.tasksCombination = c;
        it++;
  
        let percent = (it/combinations.length)*100;
        let msg = it+"/"+combinations.length+ " " + percent.toFixed(2) +"% - Combination - " + c;

        this.changeTopLog(msg,'','log-info');
        this.subTasks = this.getSubTaskInCycle(this.tasks,this.tasksCombination,this.smallerCycle);
        this.validCombinations =  this.verifyCombinations(this.tasks,this.tasksCombination,this.smallerCycle,this.largerCycle);
      
      }
      /*
      setTimeout(()=>{
        
        
      },10)  
      */
    
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
        

        this.tasks = this.bestTaskCombinatioForLargerCycle.map(x => Object.assign({}, x));

        
        this.verifyTasks()
        this.getBestCombinationForSchedule()
        return;
      }
    }
    this.mixLargerCycle(task,nextId,nextIteration)
    setTimeout(() =>{
    
    }, 0);
   
  }



}
