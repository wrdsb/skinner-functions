import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const blobReplaceContents: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log(context.bindings);

    context.bindings.outBlob = context.bindings.inBlob;
    context.done(null, "Blob contents replaced.");
};

export default blobReplaceContents;