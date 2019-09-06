class SISSchool
{
    private _id: string;
    private _alphaCode: string;

    private _createdAt: string;
    private _updatedAt: string;
    private _deletedAt: string;
    private _deleted: boolean;

    public constructor(timestamp: string, alphaCode: string)
    {
        this.setID();

        this._alphaCode = alphaCode;

        this._createdAt = timestamp;
        this._updatedAt = timestamp;
        this._deletedAt = null;
        this._deleted   = false;
    }

    private setID()
    {
        this._id = '';
    }

    get id(): string
    {
        return this._id;
    }

    // Alias for alphaCode
    get schoolCode(): string
    {
        return this._alphaCode;
    }

    get createdAt(): string
    {
        return this._createdAt;
    }

    get updatedAt(): string
    {
        return this._updatedAt;
    }

    get deletedAt(): string
    {
        return this._deletedAt;
    }

    get deleted(): boolean
    {
        return this._deleted;
    }

    public toJSON(): string
    {
        let jsonObject = {
            id: this._id,
            alphaCode: this._alphaCode,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
            deletedAt: this._deletedAt,
            deleted: this._deleted
        }

        return JSON.stringify(jsonObject);
    }
}
