export class Task {

    
    constructor(
        public name:string,
        public valid:boolean,
        public period?:number,
        public runtime?:number,
        public dep?:number,
        public maxJitter?:number,
        public minRange?:number,
        public maxRange?:number,
        )
    {}
 

}

