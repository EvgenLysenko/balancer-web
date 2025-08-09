export default class ErrorUtils {
    public static handleDefault(tag: string, error: any) {
        if (error instanceof Error)
            console.error(tag, error);
        else
            console.error(tag + ": an unknown error!", error);
    }
}