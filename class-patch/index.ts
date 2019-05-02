import { AzureFunction, Context } from "@azure/functions"

const trilliumClassPatch: AzureFunction = async function (context: Context, queueMessage: string): Promise<void> {
    const execution_timestamp = (new Date()).toJSON();  // format: 2012-04-23T18:25:43.511Z

    let old_record = context.bindings.recordIn;
    let patch = JSON.parse(queueMessage);
    let new_record;

    if (old_record) {
        // Merge request object into current record
        new_record = Object.assign(old_record, patch);
    } else {
        new_record = patch;
        new_record.created_at = execution_timestamp;
    }
    
    new_record.updated_at = execution_timestamp;

    // patching a record implicitly undeletes it
    new_record.deleted_at = null;
    new_record.deleted = false;

    // We use the Enrolment's school_code, class_code, and student_number as the Cosmos DB record's id
    new_record.id = new_record.school_code + '-' + new_record.class_code;
    new_record.id = new_record.id.replace('/', '-');

    // Simply write data to database, regardless of what might already be there
    context.bindings.recordOut = new_record;

    let event = {
        id: 'skinner-functions-' + context.executionContext.functionName +'-'+ context.executionContext.invocationId,
        eventType: 'Skinner.Class.Patch',
        eventTime: execution_timestamp,
        //subject: ,
        data: {
            event_type: 'function_invocation',
            app: 'wrdsb-skinner',
            function_name: context.executionContext.functionName,
            invocation_id: context.executionContext.invocationId,
            data: {
                old_record: old_record,
                new_record: new_record
            },
            timestamp: execution_timestamp
        },
        dataVersion: '1'
    };

    context.res = {
        status: 200,
        body: event
    };

    context.log(JSON.stringify(event));
    context.done(null, JSON.stringify(event));
};

export default trilliumClassPatch;