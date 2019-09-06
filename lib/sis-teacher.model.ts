class SISTeacher
{
    private _id: string;

    private _ein: string;
    private _email: string;

    private _createdAt: string;
    private _updatedAt: string;
    private _deletedAt: string;
    private _deleted: boolean;

    public constructor(timestamp: string, ein: string, email: string)
    {
        this.setID();

        this._ein   = ein;
        this._email = email;

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

    get ein(): string
    {
        return this._ein;
    }
    
    get email(): string
    {
        return this._email;
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
}
