export class EventHandler {
    private _events = [];

    public Add(action: () => void) {
        this._events.push(action);
    }

    public Invoke(clear: boolean = false) {
        for (var index = 0; index < this._events.length; index++) {
            this._events[index]();
        }
        if (clear)
            this.Clear();
    }

    public Clear() {
        this._events = [];
    }
}