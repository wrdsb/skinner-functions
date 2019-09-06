class SISClass
{
    private _id: string;

    private _schoolCode: string;

    private _classCode: string;

    private _teacherEIN: string;
    private _teacherEmail: string;

    private _createdAt: string;
    private _updatedAt: string;
    private _deletedAt: string;
    private _deleted: boolean;

    public constructor(timestamp: string, classCode: string, sisSchool: SISSchool, sisTeacher: SISTeacher)
    {
        this.setID();

        this._schoolCode = sisSchool.schoolCode;

        this._classCode  = classCode;

        this._teacherEIN   = sisTeacher.ein;
        this._teacherEmail = sisTeacher.email;

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

    get schoolCode(): string
    {
        return this._schoolCode;
    }

    get classCode(): string
    {
        return this._classCode;
    }

    get teacherEIN(): string
    {
        return this._teacherEIN;
    }

    get teacherEmail(): string
    {
        return this._teacherEmail;
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
