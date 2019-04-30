module.exports = function (context, data) {
    var execution_timestamp = (new Date()).toJSON();  // format: 2012-04-23T18:25:43.511Z

    var inBlob = context.bindings.inBlob;
    context.bindings.outBlob = JSON.stringify(inBlob);

    var event_type = "ca.wrdsb.skinner.trillium.views.gclassroom.blob.copy";
    var event = {
        eventID: `${event_type}-${context.executionContext.invocationId}`,
        eventType: event_type,
        source: "/trillium/view/gclassroom/copy",
        schemaURL: "ca.wrdsb.skinner.trillium.views.gclassroom.blob.copy.json",
        extensions: {
            app: 'wrdsb-skinner',
            label: "skinner copies trillium_view_gclassroom blob",
            tags: [
                "skinner",
                "trillium",
                "trillium_view",
                "trillium_view_gclassroom",
                "copy"
            ]
        },
        data: {
            function_name: context.executionContext.functionName,
            invocation_id: context.executionContext.invocationId,
            result: {
                blobs: [
                    {
                        path: "trillium/view-gclassroom-raw.json",
                        connection: "wrdsbskinner_STORAGE"
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
