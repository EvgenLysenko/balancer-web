import { Balancer } from "./Balancer";
import { CsvParser } from "./CsvParser";

export interface IDriveState {
    isIdle: boolean;
    rpm: number;
    angle: number;
}

const isSameNumbers = (num1: number, num2: number): boolean => {
    return num1 === num2 || (isNaN(num1) && isNaN(num2));
}

export class BalancerParser implements IDriveState
{
    public constructor(balancer: Balancer) {
        this.balancer = balancer;
    }

    protected readonly balancer: Balancer;
    public static chartSize = 255;

    public isIdle: boolean = false;
    public rpm: number = NaN;
    public angle: number = NaN;

    parser: CsvParser = new CsvParser();

    protected buf: Uint8Array = new Uint8Array(BalancerParser.chartSize);
    protected bufSize: number = 0;

    public parse(data: Uint8Array) {
        //console.log(data);
        for (let i = 0; i < data.length; ++i) {
            const ch = data[i];
            this.parseNext(ch);
        }
    }

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
        if (ch === 36) {// $
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

    protected decoder = new TextDecoder('utf-8'); // Specify the encoding, e.g., 'utf-8'
    protected encoder = new TextEncoder();

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
            this.parser.parseStart(buf, size, 15);
            let idx = this.parser.parseNumber(NaN);
            let value = this.parser.parseNumber(NaN);

            if (idx >= 0 && idx < this.chartX.length) {
                this.chartY[idx] = value;
                this.chartUpdatedTime = new Date();
            }

            //console.log(idx, value);
        }
        else if (BalancerParser.checkStartWith(buf, size, "$BAL,RPM,")) {
            //const str = this.decoder.decode(buf);
            //console.log(str);
            this.parser.parseStart(buf, size, 9);
            this.rpm = this.parser.parseNumber(NaN);
            console.log(this.rpm);
        }
        else if (BalancerParser.checkStartWith(buf, size, "$BAL,DR,")) {
            this.parser.parseStart(buf, size, 8);
            this.parseDriveState();
        }
        else if (BalancerParser.checkStartWith(buf, size, "$BAL,RES,")) {
            this.parser.parseStart(buf, size, 9);
            this.parseBalanceResult();
        }
        //console.log(buf, size);
    }

    // "$BAL,DR,"
    protected parseDriveState() {
        this.isIdle = this.parser.parseNumber(0) === 1;
        this.angle = this.parser.parseNumber(NaN);
        this.rpm = this.parser.parseNumber(NaN);
    }

    // "$BAL,RES,"
    public parseBalanceResult() {
        this.balancer.disbalance.angle = this.parser.parseNumber(NaN);
        this.balancer.disbalance.value = this.parser.parseNumber(NaN);
    }

    public testDriveState(text: string, isIdle: boolean, angle: number, rpm: number) {
        const buf: Uint8Array = this.encoder.encode(text);
        this.parser.parseStart(buf, buf.length, 8);
        this.parseDriveState();
        console.log("TEST: " + text, this.isIdle, this.angle, this.rpm,
            this.isIdle === isIdle && isSameNumbers(this.angle, angle) && isSameNumbers(this.rpm, rpm) ? "OK" : "FAILED" );
    }

    public test()
    {
        this.testDriveState("$BAL,DR,1,-234,12345", true, -234, 12345);
        this.testDriveState("$BAL,DR,0,-234,12345*AA", false, -234, 12345);
        this.testDriveState("$BAL,DR,1,-234,12345,,,*AA", true, -234, 12345);
        this.testDriveState("$BAL,DR,0,-234", false, -234, NaN);
        this.testDriveState("$BAL,DR,1,-234,", true, -234, NaN);
        this.testDriveState("$BAL,DR,0,-234*AA", false, -234, NaN);

        const buf = this.encoder.encode("$BAL,RES,-234,1234567890*AA");
        this.parser.parseStart(buf, buf.length, 9);
        this.parseBalanceResult();
        console.log("TEST: $BAL,RES,-234,1234567890*AA", this.balancer.disbalance.angle, this.balancer.disbalance.value);
    }
}