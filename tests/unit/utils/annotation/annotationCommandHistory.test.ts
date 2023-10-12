import { CommandHistory } from '~/lib/utils/annotation/annotationCommandHistory';
import { IAnnotationCommand } from "~/lib/utils/annotation/iAnnotationCommand";
import { describe, it, expect, beforeEach } from 'vitest';
import { mock } from 'vitest-mock-extended';

describe('CommandHistory', () => {
  let commandHistory: CommandHistory;
  let mockCommand: IAnnotationCommand;

  beforeEach(() => {
    commandHistory = new CommandHistory();
    mockCommand = mock<IAnnotationCommand>();
  });

  it('Execute a command', async () => {
    await commandHistory.execute(mockCommand);

    expect(mockCommand.execute).toHaveBeenCalled();
  });

  it('Undo a command', async () => {
    await commandHistory.execute(mockCommand);

    const undoIsEmpty = await commandHistory.undo();

    expect(mockCommand.undo).toHaveBeenCalled();
    expect(undoIsEmpty).toBe(true);
  });

  it('Redo a command after undoing', async () => {
    await commandHistory.execute(mockCommand);

    await commandHistory.undo();
    const redoIsEmpty = await commandHistory.redo();

    expect(mockCommand.execute).toHaveBeenCalledTimes(2);
    expect(mockCommand.undo).toHaveBeenCalledTimes(1);
    expect(redoIsEmpty).toBe(true);
  });

  it('Should not redo if no command was previously undone', async () => {
    await commandHistory.execute(mockCommand);
    const isEmpty = await commandHistory.redo();

    expect(mockCommand.execute).toHaveBeenCalledTimes(1);
    expect(isEmpty).toBe(true);
  });

  it('Should not undo if no command was previously executed', async () => {
    const isEmpty = await commandHistory.undo();

    expect(mockCommand.undo).not.toHaveBeenCalled();
    expect(isEmpty).toBe(true);
  });

  it('Should not redo if no command was previously executed', async () => {
    const isEmpty = await commandHistory.redo();

    expect(mockCommand.execute).not.toHaveBeenCalled();
    expect(isEmpty).toBe(true);
  });

  it('Should reset and not allow undo or redo', () => {
    commandHistory.reset();

    expect(commandHistory.undo()).resolves.toBe(true);
    expect(commandHistory.redo()).resolves.toBe(true);
    expect(mockCommand.undo).not.toHaveBeenCalled();
    expect(mockCommand.execute).not.toHaveBeenCalled();
  });
});
