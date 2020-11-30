// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

class TaskModuleResponseFactory {
    static createResponse(taskModuleInfoOrString) {    
        return {
            task: {
                type: 'continue',
                value: taskModuleInfoOrString
            }
        };
    }

    static toTaskModuleResponse(taskInfo) {        
        //console.log(taskInfo) //below is the output for custom form button
        // {
        //     fallbackUrl: 'https://28af64b2b30d.ngrok.io/CustomForm.html',     
        //     url: 'https://28af64b2b30d.ngrok.io/CustomForm.html',
        //     height: 450,
        //     width: 510,
        //     title: 'Custom Form'
        //   }        
        return TaskModuleResponseFactory.createResponse(taskInfo);
    }
}

module.exports.TaskModuleResponseFactory = TaskModuleResponseFactory;
