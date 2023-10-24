export class TextSpan {
    public readonly surfaceForm: string;
    public readonly start: number;
    public readonly end: number;

    constructor(surfaceForm: string, start: number, end: number) {
        this.surfaceForm = surfaceForm;
        this.start = start;
        this.end = end;
    }
}