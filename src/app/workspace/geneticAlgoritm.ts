import { ArrayType } from '@angular/compiler';


export class GeneticAlgoritm{
    population = [];

    constructor(
        public dataSet:any[],
        public populationSize:number,
        public mutationRate:number,
        ){
            this.createPopulation();
        }

        createPopulation(){
            for(var i = 0;i < this.populationSize;i++){
               
                this.population[i] = this.dataSet.map(x => x);
                this.shurffle(this.population[i],10);
            }
        
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

        public getPopulation(){
            return this.population;
        }




}