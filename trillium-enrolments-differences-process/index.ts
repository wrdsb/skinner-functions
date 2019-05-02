import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const trilliumEnrolmentsDifferencesProcess: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const execution_timestamp = (new Date()).toJSON();  // format: 2012-04-23T18:25:43.511Z

    // give our bindings more human-readable names
    const differences = context.bindings.recordsDifferences;

    let creates = await processCreates(differences);
    let updates = await processUpdates(differences);
    let deletes = await processDeletes(differences);

    context.bindings.queueCreates = creates;
    context.bindings.queueUpdates = updates;
    context.bindings.queueDeletes = deletes;

    async function processCreates(differences) {
        // array for the results being returned
        let messages = [];

        differences.created_records.forEach(function (record) {
            let message = record;
            messages.push(JSON.stringify(message));
        });

        return messages;
    }

    async function processUpdates(differences) {
        // array for the results being returned
        let messages = [];

        differences.updated_records.forEach(function (record) {
            let message = record;
            messages.push(JSON.stringify(message));
        });

        return messages;
    }

    async function processDeletes(differences) {
        // array for the results being returned
        let messages = [];

        differences.deleted_records.forEach(function (record) {
            let message = record;
            messages.push(JSON.stringify(message));
        });

        return messages;
    }
};

export default trilliumEnrolmentsDifferencesProcess;