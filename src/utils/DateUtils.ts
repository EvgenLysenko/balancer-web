export default class DateUtils {

	public static formatDate(date: Date): string {
		return DateUtils.dateString(date);
	}

	public static formatTimeUTime(time: number): string {
		const date:Date = new Date(time);

		return date.getMonth() + " " + date.getDate() + ", " + date.getFullYear();
	}

	private static monthsNames: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	private static monthsNumbers: string[] = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

	public static getMonthName(month: number): string {
		return ((DateUtils.monthsNames[month]));
	}

	private static dateString(date: Date): string {
		return DateUtils.monthsNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
	}

	public static dateFormatTimeShort(date: Date): string {
		const HH:string = date.getHours() < 10 ? "0" + date.getHours() : date.getHours().toString();
		const MI:string = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes().toString();

		return HH + ":" + MI;
	}

	public static timeFormatTimeShort(timeMilliseconds: number): string {
		return DateUtils.dateFormatTimeShort(new Date(timeMilliseconds));
	}

	public static dateFormatTime(date: Date): string {
		const HH:string = date.getHours() < 10 ? "0" + date.getHours() : date.getHours().toString();
		const MI:string = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes().toString();
		const SS:string = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds().toString();

		return HH + ":" + MI + ":" + SS;
	}

	public static dateToDayMonthString(date: Date): string {
		return date.getDate() + ((DateUtils.monthsNames[date.getMonth()])).toUpperCase();
	}

	public static formatDateRange(doa: Date, dod: Date): string {
		//if (DateUtils.instance == null) {
		//	DateUtils.instance = new DateUtils ();
		//}
		if ((doa != null) && (dod != null)) {
			if (doa.getFullYear() !== dod.getFullYear())
				return DateUtils.dateString(doa) + " - " + DateUtils.dateString(dod);
			if (doa.getMonth() !== dod.getMonth())
				return DateUtils.monthsNames[doa.getMonth()] + " " + doa.getDate() + " - " + DateUtils.monthsNames[dod.getMonth()] + " " + dod.getDate() + " " + doa.getFullYear();
			if (doa.getDate() !== dod.getDate())
				return DateUtils.monthsNames[doa.getMonth()] + " " + doa.getDate() + " - " + dod.getDate() + " " + doa.getFullYear();
			return DateUtils.dateString(doa);
		}
		if (doa != null)
			return DateUtils.dateString(doa);
		if (dod != null)
			return DateUtils.dateString(dod);
		return "";
	}

	public static parseDate(d: string): Date | null {
		//if (DateUtils.instance == null) {
		//	DateUtils.instance = new DateUtils ();
		//}
		let date: Date | null = null;
		//const i:number = d.indexOf(" ");
		let l: any[] = d.split(" ");
		d = l[0];

		try {
			if (date == null) Date.parse(d);
		} catch (e) {
		}

		/* TODO remap
        try {
            if (date == null) date = DateUtil.parseRFC822(d);
        } catch (e) {}

        try {
            if (date == null) date = DateUtil.parseW3CDTF(d);
        } catch (e) {}
        // TODO remap */
		try {
			if (date == null) {
				l = d.split("/");
				if (l.length > 2)
					date = new Date(l[2], l[0] - 1, l[1]);
			}
		} catch (e) {
		}

		return date;
	}

	private static isObservingDTS(): boolean {
		//const winter: Date = new Date(2011, 1, 1); // after daylight savings time ends
		const summer: Date = new Date(2011, 7, 1); // during daylight savings time
		const now: Date = new Date();

		//const winterOffset: number = winter.getTimezoneOffset();
		const summerOffset: number = summer.getTimezoneOffset();
		const nowOffset: number = now.getTimezoneOffset();

		if ((nowOffset === summerOffset)) {//} && (nowOffset != winterOffset)) {
			return true;
		} else {
			return false;
		}
	}

	public static buildTimeZoneDesignation(date: Date): string {
		if (!date) {
			return "";
		}
		const dts: boolean = DateUtils.isObservingDTS();
		let timeZoneAsString: string = "GMT";
		let timeZoneOffset: number;

		//const f:number = date.getTimezoneOffset() ;
		// timezoneoffset is the number that needs to be added to the local time to get to GMT, so
		// a positive number would actually be GMT -X hours
		if (date.getTimezoneOffset() / 60 > 0 && date.getTimezoneOffset() / 60 <= 14) {
			timeZoneOffset = (dts) ? (date.getTimezoneOffset() / 60) : (date.getTimezoneOffset() / 60 - 1);
			timeZoneAsString += "-0" + timeZoneOffset.toString();
		} else if (date.getTimezoneOffset() < 0 && date.getTimezoneOffset() / 60 >= -14) {
			timeZoneOffset = (dts) ? (date.getTimezoneOffset() / 60) : (date.getTimezoneOffset() / 60 + 1);
			timeZoneAsString += "+0" + (-1 * timeZoneOffset).toString();
		} else {
			timeZoneAsString += "+00";
		}

		// add zeros to match standard format
		//	timeZoneAsString += "00";
		return timeZoneAsString;
	}
}
