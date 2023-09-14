import {IAnnotationCommand} from "~/lib/utils/annotation/iAnnotationCommand";

export class CommandHistory {
    private undoStack: IAnnotationCommand[] = [];
    private redoStack: IAnnotationCommand[] = [];

    reset() {
        this.undoStack = [];
        this.redoStack = [];
    }

    async execute(command: IAnnotationCommand) {
        await command.execute();
        this.undoStack.push(command);
        this.redoStack = [];
    }

    async undo() {
        const command = this.undoStack.pop();
        if (command) {
            await command.undo();
            this.redoStack.push(command);
        }
    }

    async redo() {
        const command = this.redoStack.pop();
        if (command) {
            await command.execute();
            this.undoStack.push(command);
        }
    }
}