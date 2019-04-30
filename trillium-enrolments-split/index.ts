import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const trilliumEnrolmentsSplit: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const execution_timestamp = (new Date()).toJSON();  // format: 2012-04-23T18:25:43.511Z
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const enrolments = context.bindings.enrolmentsNowArray;

    let enrolmentsNowObject = {};
    let enrolmentsNowArrays = {};

    for (let i = 0; i < alphabet.length; i++) {
        let nextLetter = alphabet.charAt(i);
        
        enrolmentsNowObject[nextLetter] = {};
        enrolmentsNowArrays[nextLetter] = [];
    }

    enrolments.forEach(function(enrolment) {
        enrolmentsNowObject[enrolment.school_code.charAt(0)][enrolment.id] = enrolment;
    });

    for (let i = 0; i < alphabet.length; i++) {
        let letter = alphabet.charAt(i);

        Object.getOwnPropertyNames(enrolmentsNowObject[letter]).forEach(function (enrolmentID) {
            enrolmentsNowArrays[letter].push(enrolmentsNowObject[letter][enrolmentID]);
        });

        // Write out arrays and objects to blobs
        context.bindings['enrolmentsNowArray'+letter] = JSON.stringify(enrolmentsNowArrays[letter]);
        context.bindings['enrolmentsNowObject'+letter] = JSON.stringify(enrolmentsNowObject[letter]);
    }

    context.res = {
        status: 200,
        body: "SUCCESS: ca.wrdsb.skinner.trillium.enrolments.split"
    };
    context.done();
};

export default trilliumEnrolmentsSplit;