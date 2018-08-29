module.exports = function (context, data) {
    var execution_timestamp = (new Date()).toJSON();  // format: 2012-04-23T18:25:43.511Z

    var enrolments = context.bindings.enrolmentsNowArray;

    var enrolmentsNowObject = {};
    var enrolmentsNowArrays = {};

    var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (var i = 0; i < alphabet.length; i++) {
        var nextLetter = alphabet.charAt(i);
        
        enrolmentsNowObject[nextLetter] = {};
        enrolmentsNowArrays[nextLetter] = [];
    }

    enrolments.forEach(function(enrolment) {
        enrolmentsNowObject[enrolment.school_code.charAt(0)][enrolment.id] = enrolment;
    });

    for (var i = 0; i < alphabet.length; i++) {
        var letter = alphabet.charAt(i);

        Object.getOwnPropertyNames(enrolmentsNowObject[letter]).forEach(function (enrolmentID) {
            enrolmentsNowArrays[letter].push(enrolmentsNowObject[letter][enrolmentID]);
        });

        // Write out arrays and objects to blobs
        context.bindings['enrolmentsNowArray'+letter] = JSON.stringify(enrolmentsNowArrays[letter]);
        context.bindings['enrolmentsNowObject'+letter] = JSON.stringify(enrolmentsNowObject[letter]);
    }

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
                    },
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
    