class SISStudent
{
    private _id: string;

    private _number: string;
    private _firstName: string;
    private _lastName: string;
    private _email: string;
    
    private _createdAt: string;
    private _updatedAt: string;
    private _deletedAt: string;
    private _deleted: boolean;

    public constructor(timestamp: string, number: string, firstName: string, lastName: string, email: string)
    {
        this.setID();

        this._number    = number;
        this._firstName = firstName;
        this._lastName  = lastName;
        this._email     = email;

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

    get number(): string
    {
        return this._number;
    }
    
    get firstName(): string
    {
        return this._firstName;
    }
    
    get lastName(): string
    {
        return this._lastName;
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
