import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const viewGClassroomBlobCopy: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const execution_timestamp = (new Date()).toJSON();  // format: 2012-04-23T18:25:43.511Z

    const inBlob = context.bindings.inBlob;
    context.bindings.outBlob = JSON.stringify(inBlob);

    context.res = {
        status: 200,
        body: "SUCCESS: ca.wrdsb.skinner.trillium.views.gclassroom.blob.copy"
    };
    context.done();
};

export default viewGClassroomBlobCopy;