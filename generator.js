function computeLoop(val,min,max){
    if (val > max) return min;
    if (val < min) return max;
    return val;
}

function* gen(arrayRef,onProc){
    let i = 0;
    while (true) {
        onProc();
        i = computeLoop(i + (yield arrayRef[i]), 0, arrayRef.length - 1)//super primitive function, isn't it ?
    };
}

class PseudoComponent{
    constructor(){}
    static timeout = 2000;
    intervalRef = null;// keep track of pause status by "intervalRef === null"... y, unsafe but who cares ?
    set currentPhoto(val){console.log(val);};// this should be just field
    photos = ["p1","p2","p3"];//its even posible to extend amout of photo in runtime (should be);
    generator = gen(this.photos,()=>{
        if (this.#changeTimeout !== null) {
            this.stop();this.start(this.#changeTimeout);
            this.#changeTimeout = null;
        }
    });
    #changeTimeout = null;
    stop(){
        if (this.intervalRef !== null) clearInterval(this.intervalRef);
        this.intervalRef = null;
    }
    start(timeout = PseudoComponent.timeout){
        if (this.intervalRef === null)
        this.intervalRef = setInterval(()=>{
            this.currentPhoto = this.generator.next(1).value;
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