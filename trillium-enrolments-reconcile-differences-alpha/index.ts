import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { isEqual } from "lodash";

const trilliumEnrolmentsReconcileDifferencesAlpha: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const execution_timestamp = (new Date()).toJSON();  // format: 2012-04-23T18:25:43.511Z
    const alpha = req.body.alpha;

    // give our bindings more human-readable names
    const records_previous = context.bindings.recordsPreviousIn;
    const records_now = context.bindings.recordsNow;

    // object to store our total diff as we build it
    let calculation = {
        records_previous: records_previous,
        records_now: records_now,
        differences: {
            created_records: [],
            updated_records: [],
            deleted_records: []
        }
    };

    calculation = await findCreatesAndUpdates(calculation);
    calculation = await findDeletes(calculation);

    let creates = await processCreates(calculation.differences.created_records);
    let updates = await processUpdates(calculation.differences.updated_records);
    let deletes = await processDeletes(calculation.differences.deleted_records);

    let totalDifferences = creates.length + updates.length + deletes.length;

    let callbackMessage = await createEvent(alpha, totalDifferences);

    context.bindings.queueCreates = creates;
    context.bindings.queueUpdates = updates;
    context.bindings.queueDeletes = deletes;

    context.bindings.recordsDifferences = calculation.differences;
    context.bindings.recordsPreviousOut = context.bindings.recordsNow;

    context.res = {
        status: 200,
        body: JSON.stringify(callbackMessage)
    };

    context.done(null, callbackMessage);

    async function findCreatesAndUpdates(calculation)
    {
        let records_previous = calculation.records_previous;
        let records_now = calculation.records_now;

        // loop through all records in records_now, looking for updates and creates
        Object.getOwnPropertyNames(records_now).forEach(function (record_id) {
            let new_record = records_now[record_id];      // get the full person record from records_now
            let old_record = records_previous[record_id]; // get the corresponding record in records_previous
    
            // if we found a corresponding record in records_previous, look for changes
            if (old_record) {
                // Compare old and new records using Lodash _.isEqual, which performs a deep comparison
                let records_equal = isEqual(old_record, new_record);
    
                // if record changed, record the change
                if (!records_equal) {
                    calculation.differences.updated_records.push({
                        previous: old_record,
                        now: new_record
                    });
                }
   
            // if we don't find a corresponding record in records_previous, they're new
            } else {
                calculation.differences.created_records.push(new_record);
            }
        });
        return calculation;
    }

    async function findDeletes(calculation)
    {
        let records_previous = calculation.records_previous;
        let records_now = calculation.records_now;

        // loop through all records in records_previous, looking for deletes
        Object.getOwnPropertyNames(records_previous).forEach(function (record_id) {
            let new_record = records_now[record_id];
    
            if (!new_record) {
                // the record was deleted
                calculation.differences.deleted_records.push(records_previous[record_id]);
            }
        });

        return calculation;
    }

    async function processCreates(created_records)
    {
        // array for the results being returned
        let messages = [];

        created_records.forEach(function (record) {
            let message = record;
            messages.push(JSON.stringify(message));
        });

        return messages;
    }

    async function processUpdates(updated_records)
    {
        // array for the results being returned
        let messages = [];

        updated_records.forEach(function (record) {
            let message = record;
            messages.push(JSON.stringify(message));
        });

        return messages;
    }

    async function processDeletes(deleted_records)
    {
        // array for the results being returned
        let messages = [];

        deleted_records.forEach(function (record) {
            let message = record;
            messages.push(JSON.stringify(message));
        });

        return messages;
    }

    async function createEvent(alpha, totalDifferences)
    {
        let event = {
            id: 'skinner-functions-' + context.executionContext.functionName +'-'+ context.executionContext.invocationId,
            eventType: 'Skinner.Enrolment.Differences.Reconcile.Alpha',
            eventTime: execution_timestamp,
            //subject: ,
            data: {
                event_type: 'function_invocation',
                app: 'wrdsb-skinner',
                function_name: context.executionContext.functionName,
                invocation_id: context.executionContext.invocationId,
                data: {
                    total_differences: totalDifferences,
                    blob: {
                        path: `trillium/enrolments-differences-${alpha}.json`,
                        connection: 'wrdsbskinner_STORAGE'
                    }
                },
                timestamp: execution_timestamp
            },
            dataVersion: '1'
        };

        return event;
    }
};

export default trilliumEnrolmentsReconcileDifferencesAlpha;