export class BalancerParser
{
    public static chartSize = 255;

    public time: number = 0;
    public value1: number = 0;
    public value2: number = 0;
    public value3: number = 0;
    public rpm: number = 0;

    protected buf: Uint8Array = new Uint8Array(BalancerParser.chartSize);
    protected bufSize: number = 0;

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

    public chartX: number[] = Array.from({ length: BalancerParser.chartSize }, (value, index) => index);
    public chartY: number[] = new Array<number>(BalancerParser.chartSize);
    public chartRequested: boolean = false;
    public chartReceivedIdx: number = 0;
    protected chartUpdatedTime: Date = new Date();

    public chartGetX(): number[] {
        return this.chartX;
    }

    public chartGetY(): number[] {
        return this.chartY;
    }

    public chartRequest() {
        this.chartRequested = true;
        this.chartReceivedIdx = 0;
    }

    public getChartReceivedIdx(): number {
        return this.chartReceivedIdx;
    }

    public getChartUpdateTime(): Date {
        return this.chartUpdatedTime;
    }

    public parseNext(ch: number) {
        if (ch === 36) {
            this.bufSize = 1;
            this.buf[0] = ch;
        }
        else if (ch === 0xA || ch === 0xD || ch === 0x0) {
            if (this.bufSize > 0) {
                this.parseSentence(this.buf, this.bufSize);
                this.bufSize = 0;
            }
        }
        else {
            if (this.bufSize < this.buf.length) {
                this.buf[this.bufSize] = ch;
                this.bufSize++;
            }
            else {
                this.parseSentence(this.buf, this.bufSize);
                this.bufSize = 0;
            }
        }

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
            //else if (ch === 0x42) { // B
            //    this.stage = 21;
            //}
            else {
                this.stage = 0;
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
            else {
                this.stage = 0;
            }

            break;
        case 3:
            if (ch === 44) {// ,
                //console.log(",");
                if (this.numIdx >= 4) {
                    this.stage = 0;
                    //console.log(this.value1, this.value2, this.value3);
                    break;
                }

                if (this.minus === true) {
                    this.num = -this.num;
                }

                switch (this.numIdx) {
                case 0: this.time = this.num; break;
                case 1: this.value1 = this.num; break;
                case 2: this.value2 = this.num; break;
                case 3: this.value3 = this.num; break;
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

        case 21:
            if (ch === 0x41) {// A
                this.stage = 22;
                //console.log("A");
            }
            else {
                this.stage = 0;
            }
            break;

        case 22:
            if (ch === 0x4C) {// L
                this.stage = 23;
                //console.log("L");
            }
            else {
                this.stage = 0;
            }
            break;

        case 23:
            if (ch === 0x2C) {// ,
                this.stage = 24;
                //console.log(",");
            }
            else {
                this.stage = 0;
            }
            break;

        case 24:
            if (ch === 0x2C) {// ,
                this.stage = 24;
                //console.log(",");
            }
            else {
                this.stage = 0;
            }
            break;

        default:
            this.stage = 0;
            break;
        }
    }

    public static checkStartWith(buf: Uint8Array, size: number, text: string): boolean {
        for (let i = 0; i < size && i < text.length; ++i) {
            //console.log(text.charCodeAt(i), buf[i]);
            if (text.charCodeAt(i) !== buf[i]) {
                return false;
            }
        }

        return true;
    }

    //protected encoder = new TextEncoder();
    //const uint8Array: Uint8Array = encoder.encode(myString);
    protected decoder = new TextDecoder('utf-8'); // Specify the encoding, e.g., 'utf-8'


    protected parseSentence(buf: Uint8Array, size: number)
    {
        //const str = this.decoder.decode(buf);
        //console.log(str);

        if (BalancerParser.checkStartWith(buf, size, "$M,")) {
            //const str = this.decoder.decode(buf);
            //console.log(str);
        }
        else if (BalancerParser.checkStartWith(buf, size, "$BAL,CHART,VAL,")) {
            //const str = this.decoder.decode(buf);
            //console.log(str);
            let i = 15;
            let idx = 0;
            for (; i < size; ++i) {
                const ch = buf[i];
                if (ch === 0x2C) // ,
                    break;

                if (ch >= 0x30 && ch <= 0x39) { // 0 - 9
                    idx *= 10;
                    idx += ch - 0x30;
                }
                else {
                    break;
                }
            }

            let value = 0;
            let minus = false;
            for (++i; i < size; ++i) {
                const ch = buf[i];
                if (ch === 0x2C) { // ,
                    if (idx >= 0 && idx < this.chartX.length) {
                        if (minus)
                            value = -value;
        
                        this.chartY[idx] = value;
                        this.chartUpdatedTime = new Date();

                        minus = false;
                        value = 0;
                        ++idx;
                    }
                }
                else if (ch === 0x2D) { // -
                    minus = true;
                }
                else if (ch >= 0x30 && ch <= 0x39) { // 0 - 9
                    value *= 10;
                    value += ch - 0x30;
                }
                else {
                    break;
                }
            }

            if (idx >= 0 && idx < this.chartX.length) {
                if (minus)
                    value = -value;

                this.chartY[idx] = value;
                this.chartUpdatedTime = new Date();
            }

            //console.log(idx, value);
        }
        else if (BalancerParser.checkStartWith(buf, size, "$BAL,RPM,")) {
            //const str = this.decoder.decode(buf);
            //console.log(str);
            
            let i = 9;
            let rpm = 0;
            let minus = false;
            for (; i < size; ++i) {
                const ch = buf[i];
                if (ch === 0x2C) // ,
                    break;

                if (ch >= 0x30 && ch <= 0x39) { // 0 - 9
                    rpm *= 10;
                    rpm += ch - 0x30;
                }
                else if (ch === 0x2D) { // -
                    minus = true;
                }
                else {
                    break;
                }
            }

            if (minus)
                rpm = -rpm;
            //console.log(rpm);

            this.rpm = rpm;
            console.log(this.rpm);
       }
        //console.log(buf, size);
    }
}