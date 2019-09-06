class SISEnrolment
{
    private _id: string;

    private _schoolCode: string;

    private _classCode: string;

    private _studentNumber: string;
    private _studentFirstName: string;
    private _studentLastName: string;
    private _studentEmail: string;

    private _teacherEIN: string;
    private _teacherEmail: string;

    private _createdAt: string;
    private _updatedAt: string;
    private _deletedAt: string;
    private _deleted: boolean;

    public constructor(timestamp: string, sisClass: SISClass, sisStudent: SISStudent, sisTeacher: SISTeacher)
    {
        this.setID();

        this._schoolCode = sisClass.schoolCode;
        this._classCode  = sisClass.classCode;

        this._studentNumber    = sisStudent.number;
        this._studentFirstName = sisStudent.firstName;
        this._studentLastName  = sisStudent.lastName;
        this._studentEmail     = sisStudent.email;

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

    get school_code(): string
    {
        return this._schoolCode;
    }

    get classCode(): string
    {
        return this._classCode;
    }
    
    get studentNumber(): string
    {
        return this._studentNumber;
    }
    
    get studentFirstName(): string
    {
        return this._studentFirstName;
    }
    
    get studentLastName(): string
    {
        return this._studentLastName;
    }
    
    get studentEmail(): string
    {
        return this._studentEmail;
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
