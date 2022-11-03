function computeLoop(val,min,max){
    if (val > max) return min;
    if (val < min) return max;
    return val;
}

function* gen(arrayRef){
    let i = 0;
    while (true) {
        i = computeLoop(i + (yield arrayRef[i]), 0, arrayRef.length - 1)//super primitive function, isn't it ?
        //i = computeLoop(i + (yield arrayRef[i] ??(i = computeLoop(1, 0, arrayRef.length - 1), arrayRef[0])), 0, arrayRef.length - 1) this one should handle array updates properly 
    };
}

class PseudoComponent{
    constructor(){}
    static timeout = 2000;
    intervalRef = null;// keep track of pause status by "intervalRef === null"... y, unsafe but who cares ?
    get isPaused(){return this.intervalRef === null;}//ok, smth like this should be ok
    set currentPhoto(val){console.log(val);};// this should be just field
    photos = ["p1","p2","p3"];//its even posible to extend amout of photo in runtime (should be);
    generator = gen(this.photos);
    #changeTimeout = null;
    stop(){
        if (this.intervalRef !== null) clearInterval(this.intervalRef);
        this.intervalRef = null;
    }
    start(timeout = PseudoComponent.timeout){
        if (this.intervalRef === null)
        this.intervalRef = setInterval(()=>{
            this.currentPhoto = this.generator.next(1).value;
            if (this.#changeTimeout !== null) {
                this.stop();this.start(this.#changeTimeout);
                this.#changeTimeout = null;
            }
            //some sort of rerender coll or something, idk?
        }, timeout);
    }
    nextPhoto(){
        this.currentPhoto = this.generator.next(1).value;
    }
    prevPhoto(){
        this.currentPhoto = this.generator.next(-1).value;
    }
    set timeout(value){
        this.#changeTimeout = value;
    }
}

const instance = new PseudoComponent();
instance.start();