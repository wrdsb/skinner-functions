import { AzureFunction, Context } from "@azure/functions"

const viewGClassroomProcess: AzureFunction = async function (context: Context, triggerMessage: string): Promise<void> {
    const execution_timestamp = (new Date()).toJSON();  // format: 2012-04-23T18:25:43.511Z
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const panamaBlob = context.bindings.panamaBlob;

    const rows = panamaBlob;

    let classesObject = {};
    let classesArray = [];
    let enrolmentsObject = {};
    let enrolmentsArray = [];
    let studentsObject = {};
    let studentsArray = [];
    let teachersObject = {};
    let teachersArray = [];

    let enrolmentsSortedObject = {};
    let enrolmentsSortedArrays = {};

    for (let i = 0; i < alphabet.length; i++) {
        let nextLetter = alphabet.charAt(i);
        
        enrolmentsSortedObject[nextLetter] = {};
        enrolmentsSortedArrays[nextLetter] = [];
    }

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

    enrolmentsArray.forEach(function(enrolment) {
        enrolmentsSortedObject[enrolment.school_code.charAt(0)][enrolment.id] = enrolment;
    });

    for (let i = 0; i < alphabet.length; i++) {
        let letter = alphabet.charAt(i);

        Object.getOwnPropertyNames(enrolmentsSortedObject[letter]).forEach(function (enrolmentID) {
            enrolmentsSortedArrays[letter].push(enrolmentsSortedObject[letter][enrolmentID]);
        });

        // Write out arrays and objects to blobs
        context.bindings['enrolmentsNowArray'+letter] = JSON.stringify(enrolmentsSortedArrays[letter]);
        context.bindings['enrolmentsSortedObject'+letter] = JSON.stringify(enrolmentsSortedObject[letter]);
    }

    // Write out Skinner's local copy of Panama's raw data
    context.bindings.viewRaw = JSON.stringify(panamaBlob);

    // Write out arrays and objects to blobs
    context.bindings.classesNowArray = JSON.stringify(classesArray);
    context.bindings.classesNowObject = JSON.stringify(classesObject);

    context.bindings.enrolmentsNowArray = JSON.stringify(enrolmentsArray);
    context.bindings.enrolmentsSortedObject = JSON.stringify(enrolmentsObject);

    context.bindings.studentsNowArray = JSON.stringify(studentsArray);
    context.bindings.studentsNowObject = JSON.stringify(studentsObject);

    context.bindings.teachersNowArray = JSON.stringify(teachersArray);
    context.bindings.teachersNowObject = JSON.stringify(teachersObject);

    let callbackMessage = {
        id: 'skinner-functions-' + context.executionContext.functionName +'-'+ context.executionContext.invocationId,
        eventType: 'Skinner.View.GClassroom.Process',
        eventTime: execution_timestamp,
        //subject: ,
        data: {
            event_type: 'function_invocation',
            app: 'wrdsb-skinner',
            function_name: context.executionContext.functionName,
            invocation_id: context.executionContext.invocationId,
            data: {
            },
            timestamp: execution_timestamp
        },
        dataVersion: '1'
    };

    context.bindings.callbackMessage = JSON.stringify(callbackMessage);

    context.log(JSON.stringify(callbackMessage));
    context.done(null, callbackMessage);
};

export default viewGClassroomProcess;