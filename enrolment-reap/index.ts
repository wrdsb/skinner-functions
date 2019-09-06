import { AzureFunction, Context } from "@azure/functions";
import { CosmosClient } from "@azure/cosmos";

const enrolmentReap: AzureFunction = async function (context: Context, triggerMessage: string): Promise<void> {
    const execution_timestamp = (new Date()).toJSON();  // format: 2012-04-23T18:25:43.511Z
    const reapID = context.bindings.triggerMessage.id;

    const cosmosEndpoint = process.env['cosmosEndpoint'];
    const cosmosKey = process.env['cosmosKey'];
    const cosmosDatabase = process.env['cosmosDatabase'];
    const cosmosContainer = 'enrolments';

    const cosmosClient = new CosmosClient({endpoint: cosmosEndpoint, auth: {masterKey: cosmosKey}});

    const querySpec = {
        query: `SELECT * FROM c WHERE c.id = ${reapID}`
    }
    const queryOptions  = {
        maxItemCount: -1,
        enableCrossPartitionQuery: true
    }

    let old_records = await cosmosClient.database(cosmosDatabase).container(cosmosContainer).items.query(querySpec, queryOptions);
    let old_record = old_records[0];
    let deleted_record = await cosmosClient.database(cosmosDatabase).container(cosmosContainer).item(old_record.id).delete(old_record);
    
    let callbackMessage = await createEvent(old_record);
    context.bindings.callbackMessage = JSON.stringify(callbackMessage);

    context.log(JSON.stringify(callbackMessage));
    context.done(null, callbackMessage);

    async function createEvent(old_record)
    {
        context.log('createEvent');

        let event = {
            id: 'skinner-functions-' + context.executionContext.functionName +'-'+ context.executionContext.invocationId,
            eventType: 'Skinner.Enrolment.Reap',
            eventTime: execution_timestamp,
            //subject: ,
            data: {
                event_type: 'function_invocation',
                app: 'wrdsb-skinner',
                function_name: context.executionContext.functionName,
                invocation_id: context.executionContext.invocationId,
                data: {
                    old_record: old_record
                },
                timestamp: execution_timestamp
            },
            dataVersion: '1'
        };
    
        return event;
    }
};

export default enrolmentReap;
