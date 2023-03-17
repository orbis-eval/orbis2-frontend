

export class EventListenerUtils {
    static listenKeyboard(event: KeyboardEvent, submit: () => void, cancel: () => void) {
        if (event.key === 'Enter') {
            submit();
        }
        if (event.key === 'Escape') {
            cancel();
        }
    }
}