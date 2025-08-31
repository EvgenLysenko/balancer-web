export class CsvParser
{
    startPos: number = 0;
    hasNext: boolean = true;
    buf: Uint8Array = new Uint8Array(0);
    size: number = 0;

    public parseStart(buf: Uint8Array, size: number, startPos: number) {
        this.buf = buf;
        this.size = size;
        this.startPos = startPos;
        this.hasNext = true;
    }

    public parseString(): string {
        const defaultValue = "";

        if (!this.hasNext)
            return defaultValue;

        if (this.startPos >= this.size) {
            this.hasNext = false;
            return defaultValue;
        }

        let i = this.startPos;
        let value: string = "";
        for (; i < this.size; ++i) {
            const ch = this.buf[i];
            if (ch === 0x2C) { // ,
                this.hasNext = true;
                this.startPos = i + 1;
                break;
            }
            else if (ch === 0x2A) { // *
                this.hasNext = false;
                this.startPos = i + 1;
                break;
            }
            else {
                value += ch;
            }
        }

        return value;
    }

    public parseNumber(defaultValue: number): number {
        if (!this.hasNext)
            return defaultValue;

        if (this.startPos >= this.size) {
            this.hasNext = false;
            return defaultValue;
        }

        let i = this.startPos;
        let value = 0;
        let minus = false;
        for (; i < this.size; ++i) {
            const ch = this.buf[i];
            if (ch === 0x2C) { // ,
                this.hasNext = true;
                this.startPos = i + 1;
                break;
            }

            if (ch >= 0x30 && ch <= 0x39) { // 0 - 9
                value *= 10;
                value += ch - 0x30;
            }
            else if (ch === 0x2D) { // -
                minus = true;
            }
            else {
                break;
            }
        }

        if (minus)
            value = -value;
        //console.log(rpm);

        for (; i < this.size; ++i) {
            const ch = this.buf[i];
            if (ch === 0x2C) { // ,
                this.hasNext = true;
                this.startPos = i + 1;
                return value;
            }
        }

        if (i >= this.size) {
            this.hasNext = false;
        }

        return value;
    }
}