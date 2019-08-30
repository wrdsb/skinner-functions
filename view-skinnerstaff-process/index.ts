import { AzureFunction, Context } from "@azure/functions"

const viewSkinnerStaffProcess: AzureFunction = async function (context: Context, triggerMessage: string): Promise<void> {
    const execution_timestamp = (new Date()).toJSON();  // format: 2012-04-23T18:25:43.511Z

    const panamaBlob = context.bindings.panamaBlob;

    const rows = panamaBlob;

    let staffArray = [];
    let staffObject = {};

    rows.forEach(function(row) {
        let ein          = row.STAFF_NO;
        let school_code  = row.SCHOOL_CODE;
        let school_year  = row.SCHOOL_YEAR;
        let staff_type   = row.STAFF_TYPE;
        let status       = row.STATUS;

        // Extract the 'class' object from the row
        let staff = {
            id:             ein,
            ein:            ein,
            school_code:    school_code,
            school_year:    school_year,
            staff_type:     staff_type,
            status:         status
        };

        staffArray.push(staff);
        staffObject[staff.id] = staff;
    });

    // Write out Skinner's local copy of Panama's raw data
    context.bindings.viewRaw = JSON.stringify(panamaBlob);

    // Write out arrays and objects to blobs
    context.bindings.staffNowArray = JSON.stringify(staffArray);
    context.bindings.staffNowObject = JSON.stringify(staffObject);

    let callbackMessage = {
        id: 'skinner-functions-' + context.executionContext.functionName +'-'+ context.executionContext.invocationId,
        eventType: 'Skinner.View.SkinnerStaff.Process',
        eventTime: execution_timestamp,
        //subject: ,
        data: {
            event_type: 'function_invocation',
            app: 'wrdsb-skinner',
            function_name: context.executionContext.functionName,
            invocation_id: context.executionContext.invocationId,
            data: {},
            timestamp: execution_timestamp
        },
        dataVersion: '1'
    };

    context.bindings.callbackMessage = JSON.stringify(callbackMessage.data);

    context.bindings.triggerSISStaffReconcile = JSON.stringify(callbackMessage;

    context.log(JSON.stringify(callbackMessage));
    context.done(null, callbackMessage);
};

export default viewSkinnerStaffProcess;