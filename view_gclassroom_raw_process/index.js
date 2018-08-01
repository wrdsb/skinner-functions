module.exports = function (context, data) {
    var execution_timestamp = (new Date()).toJSON();  // format: 2012-04-23T18:25:43.511Z

    var rows = context.bindings.viewRaw;

    var classesObject = {};
    var classesArray = [];
    var enrolmentsObject = {};
    var enrolmentsArray = [];

    rows.forEach(function(row) {
        // Extract the 'class' object from the row
        var classObject = {
            id:             row.SCHOOL_CODE + '-' + row.CLASS_CODE,
            school_code:    row.SCHOOL_CODE,
            class_code:     row.CLASS_CODE,
            teacher_ein:    row.TEACHER_EIN ? row.TEACHER_EIN : '',
            teacher_email:  row.TEACHER_EMAIL ? row.TEACHER_EMAIL : ''
        };

        // Extract the 'enrolment' object from the row
        var enrolmentObject = {
            id:                 row.SCHOOL_CODE + '-' + row.CLASS_CODE + '-' + row.STUDENT_NO,
            school_code:        row.SCHOOL_CODE,
            class_code:         row.CLASS_CODE,
            student_number:     row.STUDENT_NO,
            student_first_name: row.STUDENT_FIRST_NAME,
            student_last_name:  row.STUDENT_LAST_NAME,
            student_email:      row.STUDENT_EMAIL,
            teacher_ein:        row.TEACHER_EIN ? row.TEACHER_EIN : '',
            teacher_email:      row.TEACHER_EMAIL ? row.TEACHER_EMAIL : ''
        };

        // Append classes and enrolments from this row to their collection arrays
        classesArray.push(classObject);
        enrolmentsArray.push(enrolmentObject);

        // Add/overwrite classes and enrolments from this row to their collection objects
        classesObject[classObject.id]        = classObject;
        enrolmentsObject[enrolmentObject.id] = enrolmentObject;
    });

    // Write out arrays and objects to blobs
    context.bindings.classesNowArray = JSON.stringify(classesArray);
    context.bindings.classesNowObject = JSON.stringify(classesObject);

    context.bindings.enrolmentsNowArray = JSON.stringify(enrolmentsArray);
    context.bindings.enrolmentsNowObject = JSON.stringify(enrolmentsObject);

    var event_type = "ca.wrdsb.skinner.trillium.views.gclassroom.blob.process";
    var event = {
        eventID: `${event_type}-${context.executionContext.invocationId}`,
        eventType: event_type,
        source: "/trillium/view/gclassroom/process",
        schemaURL: "ca.wrdsb.skinner.trillium.views.gclassroom.blob.process.json",
        extensions: {
            app: 'wrdsb-skinner',
            label: "skinner processes trillium_view_gclassroom blob",
            tags: [
                "skinner",
                "trillium",
                "trillium_view",
                "trillium_view_gclassroom",
                "process"
            ]
        },
        data: {
            function_name: context.executionContext.functionName,
            invocation_id: context.executionContext.invocationId,
            result: {
                blobs: [
                    {
                        path: "trillium/classes-now-array.json",
                        connection: "wrdsbskinner_STORAGE",
                    },
                    {
                        path: "trillium/classes-now-object.json",
                        connection: "wrdsbskinner_STORAGE",
                    },
                    {
                        path: "trillium/enrolments-now-array.json",
                        connection: "wrdsbskinner_STORAGE",
                    },
                    {
                        path: "trillium/enrolments-now-object.json",
                        connection: "wrdsbskinner_STORAGE",
                    }
                ]
            },
        },
        eventTime: execution_timestamp,
        eventTypeVersion: "0.1",
        cloudEventsVersion: "0.1",
        contentType: "application/json"
    };

    context.bindings.flynnGrid = event;
    context.res = {
        status: 200,
        body: event
    };
    context.done();
};
    