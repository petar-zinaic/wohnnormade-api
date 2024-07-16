export default class BaseAssembler<Record> {
    protected _record: Record;

    constructor(record: Record){
        this._record = record;
    }
}
