import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const jobCreate: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const execution_timestamp = (new Date()).toJSON();  // format: 2012-04-23T18:25:43.511Z

    const body = req.body;
    const jobType = req.body.job_type;

    if (jobType) {
        switch (jobType) {
            case "Skinner.View.GClassroom.Process":
                context.bindings.viewGClassroomProcessTrigger = createSkinnerViewGClassroomProcessJob();

                context.res = {
                    status: 202,
                    body: "Accepted. Queued Skinner.View.GClassroom.Process job."
                };

                break;

            case "Skinner.Class.Differences.Reconcile":
                context.bindings.sisClassesReconcileTrigger = createSkinnerClassDifferencesReconcileJob();

                context.res = {
                    status: 202,
                    body: "Accepted. Queued Skinner.Class.Differences.Reconcile job."
                };

                break;
    
            case "Skinner.Enrolment.Differences.Reconcile.Alpha":
                context.bindings.sisEnrolmentsReconcileTrigger = createSkinnerEnrolmentDifferencesReconcileAlphaJob(body.alpha);

                context.res = {
                    status: 202,
                    body: "Accepted. Queued Skinner.Enrolment.Differences.Reconcile.Alpha job."
                };

                break;

            case "Skinner.Enrolment.Differences.Reconcile.All":
                context.bindings.sisEnrolmentsReconcileTrigger = createSkinnerEnrolmentDifferencesReconcileAllJob();

                context.res = {
                    status: 202,
                    body: "Accepted. Queued Skinner.Enrolment.Differences.Reconcile.All job."
                };

                break;

            default:
                context.res = {
                    status: 422,
                    body: "Unprocessable Entity. Cannot find the specified job_type."
                };

                break;
        }
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a valid job_type in the request body."
        };
    }

    function createSkinnerViewGClassroomProcessJob(): string
    {
        let triggerMessage = {};

        return JSON.stringify(triggerMessage);
    }

    function createSkinnerClassDifferencesReconcileJob(): string
    {
        let triggerMessage = {};

        return JSON.stringify(triggerMessage);
    }

    function createSkinnerEnrolmentDifferencesReconcileAlphaJob(alpha: string): string
    {
        let triggerMessage = {
            alpha: alpha
        };

        return JSON.stringify(triggerMessage);
    }

    function createSkinnerEnrolmentDifferencesReconcileAllJob(): string[]
    {
        let triggerMessages = [];

        for (let i = 0; i < 26; i++) {
            let triggerMessage = {
                alpha: (i+10).toString(36)
            };

            triggerMessages.push(JSON.stringify(triggerMessage));
        }

        return triggerMessages;
    }
};

export default jobCreate;
