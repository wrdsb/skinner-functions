import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const viewGClassroomRawProcess: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const execution_timestamp = (new Date()).toJSON();  // format: 2012-04-23T18:25:43.511Z

    const rows = context.bindings.viewRaw;

    let classesObject = {};
    let classesArray = [];
    let enrolmentsObject = {};
    let enrolmentsArray = [];
    let studentsObject = {};
    let studentsArray = [];
    let teachersObject = {};
    let teachersArray = [];

    rows.forEach(function(row) {
        let sanitized_class_code = row.CLASS_CODE.replace('/', '-');

        // Extract the 'class' object from the row
        let classObject = {
            id:             row.SCHOOL_CODE + '-' + sanitized_class_code,
            school_code:    row.SCHOOL_CODE,
            class_code:     row.CLASS_CODE,
            teacher_ein:    row.TEACHER_EIN ? row.TEACHER_EIN : '',
            teacher_email:  row.TEACHER_EMAIL ? row.TEACHER_EMAIL : ''
        };

        // Extract the 'enrolment' object from the row
        let enrolmentObject = {
            id:                 row.SCHOOL_CODE + '-' + sanitized_class_code + '-' + row.STUDENT_NO,
            school_code:        row.SCHOOL_CODE,
            class_code:         row.CLASS_CODE,
            student_number:     row.STUDENT_NO,
            student_first_name: row.STUDENT_FIRST_NAME,
            student_last_name:  row.STUDENT_LAST_NAME,
            student_email:      row.STUDENT_EMAIL,
            teacher_ein:        row.TEACHER_EIN ? row.TEACHER_EIN : '',
            teacher_email:      row.TEACHER_EMAIL ? row.TEACHER_EMAIL : ''
        };

        // Extract the 'student' object from the row
        let studentObject = {
            id:                 row.STUDENT_NO,
            student_number:     row.STUDENT_NO,
            student_email:      row.STUDENT_EMAIL,
            student_first_name: row.STUDENT_FIRST_NAME,
            student_last_name:  row.STUDENT_LAST_NAME,
            school_code:        row.SCHOOL_CODE,
            student_oyap:       row.OYAP
        };

        // Extract the 'teacher' object from the row
        let teacherObject = {
            id:                 row.TEACHER_EIN ? row.TEACHER_EIN : '0',
            teacher_ein:        row.TEACHER_EIN ? row.TEACHER_EIN : '0',
            teacher_email:      row.TEACHER_EMAIL ? row.TEACHER_EMAIL : '0',
            school_code:        row.SCHOOL_CODE
        };
        
        // Add/overwrite individual objects from this row to their collection objects
        classesObject[classObject.id]        = classObject;
        enrolmentsObject[enrolmentObject.id] = enrolmentObject;
        studentsObject[studentObject.id]     = studentObject;
        teachersObject[teacherObject.id]     = teacherObject;
    });

    // Add each class from classesObject to classesArray
    Object.getOwnPropertyNames(classesObject).forEach(function (classID) {
        classesArray.push(classesObject[classID]);
    });    

    // Add each enrolment from enrolmentsObject to enrolmentsArray
    Object.getOwnPropertyNames(enrolmentsObject).forEach(function (enrolmentID) {
        enrolmentsArray.push(enrolmentsObject[enrolmentID]);
    });

    // Add each student from studentsObject to studentsArray
    Object.getOwnPropertyNames(studentsObject).forEach(function (studentID) {
        studentsArray.push(studentsObject[studentID]);
    });    

    // Add each teacher from teachersObject to teachersArray
    Object.getOwnPropertyNames(teachersObject).forEach(function (teacherID) {
        teachersArray.push(teachersObject[teacherID]);
    });    

    // Write out arrays and objects to blobs
    context.bindings.classesNowArray = JSON.stringify(classesArray);
    context.bindings.classesNowObject = JSON.stringify(classesObject);

    context.bindings.enrolmentsNowArray = JSON.stringify(enrolmentsArray);
    context.bindings.enrolmentsNowObject = JSON.stringify(enrolmentsObject);

    context.bindings.studentsNowArray = JSON.stringify(studentsArray);
    context.bindings.studentsNowObject = JSON.stringify(studentsObject);

    context.bindings.teachersNowArray = JSON.stringify(teachersArray);
    context.bindings.teachersNowObject = JSON.stringify(teachersObject);

    context.res = {
        status: 200,
        body: "SUCCESS: ca.wrdsb.skinner.trillium.views.gclassroom.blob.process"
    };
    context.done();
};

export default viewGClassroomRawProcess;