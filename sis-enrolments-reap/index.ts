import { AzureFunction, Context } from "@azure/functions";
import { CosmosClient } from "@azure/cosmos";

const sisEnrolmentsReap: AzureFunction = async function (context: Context, triggerMessage: string): Promise<void> {
    const execution_timestamp = (new Date()).toJSON();  // format: 2012-04-23T18:25:43.511Z
    const reapDate = context.bindings.triggerMessage.date;

    const cosmosEndpoint = process.env['cosmosEndpoint'];
    const cosmosKey = process.env['cosmosKey'];
    const cosmosDatabase = process.env['cosmosDatabase'];
    const cosmosContainer = 'enrolments';

    const cosmosClient = new CosmosClient({endpoint: cosmosEndpoint, auth: {masterKey: cosmosKey}});

    // fetch current records from Cosmos
    const records_to_reap = await getCosmosItems(cosmosClient, cosmosDatabase, cosmosContainer, reapDate).catch(err => {
        context.log(err);
    });

    let reaps = await queueReaps(records_to_reap);
    let totalReaps = reaps.length;

    let callbackMessage = await createEvent(reapDate, totalReaps);

    context.bindings.queueDeletes = reaps;

    context.bindings.logCalculation = JSON.stringify(records_to_reap);

    context.bindings.callbackMessage = JSON.stringify(callbackMessage);

    context.log(JSON.stringify(callbackMessage));
    context.done(null, callbackMessage);

    async function queueReaps(records)
    {
        context.log('queueReaps');

        // array for the results being returned
        let messages = [];

        records.forEach(function (record) {
            let message = record;
            messages.push(JSON.stringify(message));
        });

        return messages;
    }

    async function createEvent(date, totalDeletes)
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
                    total_differences: totalDeletes,
                    blob: {
                        path: `trillium/enrolments-reap-${date}.json`,
                        connection: 'wrdsbskinner_STORAGE'
                    }
                },
                timestamp: execution_timestamp
            },
            dataVersion: '1'
        };

        return event;
    }

    async function getCosmosItems(cosmosClient, cosmosDatabase, cosmosContainer, date)
    {
        context.log('getCosmosItems');

        let records_previous = [];

        const querySpec = {
            query: `SELECT c.id FROM c WHERE STARTSWITH(c.deleted_at, '${date}') AND c.deleted = true`
        }
        const queryOptions  = {
            maxItemCount: -1,
            enableCrossPartitionQuery: true
        }

        const queryIterator = await cosmosClient.database(cosmosDatabase).container(cosmosContainer).items.query(querySpec, queryOptions);
        
        while (queryIterator.hasMoreResults()) {
            const results = await queryIterator.executeNext();

            records_previous = await consolidateCosmosItems(results.result, records_previous);

            if (results === undefined) {
                // no more results
                break;
            }   
        }

        return records_previous;
    }

    async function consolidateCosmosItems(items: any[], consolidatedArray: any[])
    {
        items.forEach(function(item) {
            consolidatedArray.push(item);
        });

        return consolidatedArray;
    }
};

export default sisEnrolmentsReap;
