export class BalancerParser {
    public value1: number = 0;
    public value2: number = 0;
    public value3: number = 0;

    public parse(data: Uint8Array) {
        //console.log(data);
        for (let i = 0; i < data.length; ++i) {
            const ch = data[i];
            this.parseNext(ch);
        }
    }

    protected stage: number = 0;
    protected minus: boolean = false;
    protected num: number = 0;
    protected numIdx: number = 0;

    public parseNext(ch: number) {
        switch (this.stage) {
        case 0: 
            if (ch === 36) {// $
                this.stage = 1;
                //console.log("$");
            }
            break;
        case 1: 
            if (ch === 77) {// M
                this.stage = 2;
                //console.log("M");
            }
            break;
        case 2:
            if (ch === 44) {// ,
                //console.log(",");
                this.minus = false;
                this.num = 0;
                this.numIdx = 0;
 
                this.stage = 3;
            }
            break;
        case 3:
            if (ch === 44) {// ,
                //console.log(",");
                if (this.numIdx >= 3) {
                    this.stage = 0;
                    console.log(this.value1, this.value2, this.value3);
                    break;
                }

                if (this.minus === true) {
                    this.num = -this.num;
                }

                switch (this.numIdx) {
                case 0: this.value1 = this.num; break;
                case 1: this.value2 = this.num; break;
                case 2: this.value3 = this.num; break;
                }

                this.minus = false;
                this.num = 0;
                ++this.numIdx;
            }
            else if (ch === 45) { // -
                //console.log("-");
                this.minus = true;
            }
            else if (ch >= 48 && ch <= 57) { // 0 - 9
                this.num *= 10;
                this.num += ch - 48;
                //console.log(this.num);
            }
            else {
                this.stage = 0;
                break;
            }

            break;
        }
    }
}