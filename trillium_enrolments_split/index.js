module.exports = function (context, data) {
    var execution_timestamp = (new Date()).toJSON();  // format: 2012-04-23T18:25:43.511Z

    var enrolments = context.bindings.enrolmentsNowArray;

    var enrolmentsNowObject = {};
    var enrolmentsNowArrayA = [];
    var enrolmentsNowArrayB = [];

    var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for(var i = 0; i < alphabet.length; i++) {
        var nextLetter = alphabet.charAt(i);
        enrolmentsNowObject[nextLetter] = {};
    }

    enrolments.forEach(function(enrolment) {
        switch (enrolment.school_code.charAt(0)) {
            case 'A':
                enrolmentsNowObject['A'][enrolment.id] = enrolment;
                break;
            case 'B':
                enrolmentsNowObject['B'][enrolment.id] = enrolment;
                break;
            default:
                break;
        }
    });

    Object.getOwnPropertyNames(enrolmentsNowObject['A']).forEach(function (enrolmentID) {
        enrolmentsNowArrayA.push(enrolmentsNowObject['A'][enrolmentID]);
    });
    Object.getOwnPropertyNames(enrolmentsNowObject['B']).forEach(function (enrolmentID) {
        enrolmentsNowArrayB.push(enrolmentsNowObject['B'][enrolmentID]);
    });

    // Write out arrays and objects to blobs
    context.bindings.enrolmentsNowArrayA = JSON.stringify(enrolmentsNowArrayA);
    context.bindings.enrolmentsNowObjectA = JSON.stringify(enrolmentsNowObject['A']);

    context.bindings.enrolmentsNowArrayB = JSON.stringify(enrolmentsNowArrayB);
    context.bindings.enrolmentsNowObjectB = JSON.stringify(enrolmentsNowObject['B']);

    var event_type = "ca.wrdsb.skinner.trillium.enrolments.split";
    var event = {
        eventID: `${event_type}-${context.executionContext.invocationId}`,
        eventType: event_type,
        source: "/trillium/enrolments/split",
        schemaURL: "ca.wrdsb.skinner.trillium.enrolments.split.json",
        extensions: {
            app: 'wrdsb-skinner',
            label: "skinner splits trillium_enrolments blob",
            tags: [
                "skinner",
                "trillium",
                "trillium_enrolments",
                "split"
            ]
        },
        data: {
            function_name: context.executionContext.functionName,
            invocation_id: context.executionContext.invocationId,
            result: {
                blobs: [
                    {
                        path: "trillium/enrolments-now-array-a.json",
                        connection: "wrdsbskinner_STORAGE",
                    },
                    {
                        path: "trillium/enrolments-now-object-a.json",
                        connection: "wrdsbskinner_STORAGE",
                    },
                    {
                        path: "trillium/enrolments-now-array-b.json",
                        connection: "wrdsbskinner_STORAGE",
                    },
                    {
                        path: "trillium/enrolments-now-object-b.json",
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

    //context.bindings.flynnGrid = event;
    context.res = {
        status: 200,
        body: event
    };
    context.done();
};
    