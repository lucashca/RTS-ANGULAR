export class Task {


    constructor(
        public name: string,
        public valid: boolean,
        public blanck: boolean,
        public period?: number,
        public runtime?: number,
        public dep?: number,
        public deadline?: number,
    ) { }


}

