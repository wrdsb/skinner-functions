import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { isEqual } from "lodash";

const trilliumEnrolmentesDifferencesCalculate: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const execution_timestamp = (new Date()).toJSON();  // format: 2012-04-23T18:25:43.511Z

    // give our bindings more human-readable names
    const records_previous = context.bindings.recordsPrevious;
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

    let results = await findCreatesAndUpdates(calculation);
    results = await findDeletes(results);

    context.bindings.recordsDifferences = JSON.stringify(results.differences);

    context.res = {
        status: 200,
        body: JSON.stringify(results.differences)
    };

    context.done(null, results.differences);


    async function findCreatesAndUpdates(calculation) {
        let records_previous = calculation.records_previous;
        let records_now = calculation.records_now;

        // loop through all records in records_now, each of which is a property of records_now, named for the record's record_id
        Object.getOwnPropertyNames(records_now).forEach(function (record_id) {
            // context.log('Processing record_id ' + record_id);
            let new_record = records_now[record_id];      // get the full person record from records_now
            let old_record = records_previous[record_id]; // get the corresponding record in records_previous
    
            // if we found a corresponding record in records_previous, look for changes
            if (old_record) {
                // context.log('Found existing record for record_id ' + record_id);

                // Compare old and new records using Lodash _.isEqual, which performs a deep comparison
                let records_equal = isEqual(old_record, new_record);
    
                // if record changed, add changes to total diff
                if (!records_equal) {
                    // context.log('Found changed record for record_id ' + record_id);
                    calculation.differences.updated_records.push({
                        previous: old_record,
                        now: new_record
                    });
                } else {
                    // context.log('No changes found for record_id ' + record_id);
                }
    
                // remove old_record from records_previous to leave us with a diff. See find_deletes().
                delete calculation.records_previous[record_id];
    
            // if we don't find a corresponding record in records_previous, they're new
            } else {
                // context.log('Found new record for record_id ' + record_id);
                calculation.differences.created_records.push(new_record);
            }
        });
        return calculation;
    }

    async function findDeletes(calculation) {
        let records_previous = calculation.records_previous;

        // if we have any old records remaining, they didn't match a new record, so they must be deletes
        Object.getOwnPropertyNames(records_previous).forEach(function (record_id) {
            // context.log('Found deleted record for record_id ' + record_id);
            calculation.differences.deleted_records.push(records_previous[record_id]);
        });

        return calculation;
    }

    async function createEvents(differences) {
        // array for the events being returned
        let events = [];

        differences.created_records.forEach(function (record) {
            let event = {
                id: 'skinner-functions-' + context.executionContext.functionName +'-'+ context.executionContext.invocationId,
                eventType: 'Skinner.Enrolment.Create',
                eventTime: execution_timestamp,
                //subject: ,
                data: {
                    event_type: 'function_invocation',
                    app: 'wrdsb-skinner',
                    function_name: context.executionContext.functionName,
                    invocation_id: context.executionContext.invocationId,
                    data: {
                        payload: record
                    },
                    timestamp: execution_timestamp
                },
                dataVersion: '1'
            };
            events.push(JSON.stringify(event));
        });

        differences.updated_records.forEach(function (record) {
            let event = {
                id: 'skinner-functions-' + context.executionContext.functionName +'-'+ context.executionContext.invocationId,
                eventType: 'Skinner.Enrolment.Update',
                eventTime: execution_timestamp,
                //subject: ,
                data: {
                    event_type: 'function_invocation',
                    app: 'wrdsb-skinner',
                    function_name: context.executionContext.functionName,
                    invocation_id: context.executionContext.invocationId,
                    data: {
                        payload: record
                    },
                    timestamp: execution_timestamp
                },
                dataVersion: '1'
            };
            events.push(JSON.stringify(event));
        });

        differences.deleted_records.forEach(function (record) {
            let event = {
                id: 'skinner-functions-' + context.executionContext.functionName +'-'+ context.executionContext.invocationId,
                eventType: 'Skinner.Enrolment.Delete',
                eventTime: execution_timestamp,
                //subject: ,
                data: {
                    event_type: 'function_invocation',
                    app: 'wrdsb-skinner',
                    function_name: context.executionContext.functionName,
                    invocation_id: context.executionContext.invocationId,
                    data: {
                        payload: record
                    },
                    timestamp: execution_timestamp
                },
                dataVersion: '1'
            };
            events.push(JSON.stringify(event));
        });

        let event = {
            id: 'skinner-functions-' + context.executionContext.functionName +'-'+ context.executionContext.invocationId,
            eventType: 'Skinner.Enrolment.Differences.Calculate',
            eventTime: execution_timestamp,
            //subject: ,
            data: {
                event_type: 'function_invocation',
                app: 'wrdsb-skinner',
                function_name: context.executionContext.functionName,
                invocation_id: context.executionContext.invocationId,
                data: {
                    blob: {
                        path: 'trillium/enrolmentes-differences.json',
                        connection: 'wrdsbskinner_STORAGE'
                    }
                },
                timestamp: execution_timestamp
            },
            dataVersion: '1'
        };
        events.push(JSON.stringify(event));

        return events;
    }
};

export default trilliumEnrolmentesDifferencesCalculate;