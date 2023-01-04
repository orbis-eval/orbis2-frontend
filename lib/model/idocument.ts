
interface IDocument {
    content: string;
    key: string;
    run_id: number;
    done: boolean;
    _id: number;
}

export default IDocument;