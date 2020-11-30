// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { TeamsActivityHandler, MessageFactory, CardFactory } = require('botbuilder');
const { TaskModuleUIConstants } = require('../models/TaskModuleUIConstants');
//const { TaskModuleIds } = require('../models/taskmoduleids');
const { TaskModuleResponseFactory } = require('../models/taskmoduleresponsefactory');
const ACData = require("adaptivecards-templating");

const Actions = [    
    TaskModuleUIConstants.TimezoneConverter    
];

class TeamsTaskModuleBot extends TeamsActivityHandler {
    constructor() {
        super();

        this.baseUrl = process.env.BaseUrl;

        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {            
            console.log(context.activity.text)
            var incomingTextMsg = context.activity.text;
            if (incomingTextMsg === "Show Time"){
                console.log("in")
            // This displays an AdaptiveCard
            // When the button is clicked, `handleTeamsTaskModuleFetch`
            // is called.
            const reply = MessageFactory.list([
                //this.getTaskModuleHeroCardOptions(),
                this.getTaskModuleAdaptiveCardOptions()
            ]);
            await context.sendActivity(reply);

            // By calling next() you ensure that the next BotHandler is run.
            await next();

            }else{
                await context.sendActivity("Please Type: Show Time")
            }
            
        });
    };

    handleTeamsTaskModuleFetch(context, taskModuleRequest) {
        // Called when the user selects an options from the displayed HeroCard or
        // AdaptiveCard.  The result is the action to perform.        
        
        const cardTaskFetchValue = taskModuleRequest.data.buttonID;
        var taskInfo = {}; // TaskModuleTaskInfo

        taskInfo.url = taskInfo.fallbackUrl = this.baseUrl + '/' + 'CustomForm' + '.html';
        this.setTaskInfo(taskInfo, TaskModuleUIConstants.TimezoneConverter);        

        return TaskModuleResponseFactory.toTaskModuleResponse(taskInfo);
    }

    async handleTeamsTaskModuleSubmit(context, taskModuleRequest) {        
        console.log(taskModuleRequest) //output is below; tha value in customerInfo is appended to data
        //microsoftTeams.tasks.submitTask(customerInfo, "012ebe53-ea73-48c5-af9e-d1eb3ac95ad2");

        // {
        //     data: { name: 'manu', email: 'manu@123.com', favoriteBook: 'book' },
        //     context: { theme: 'default' }
        //   }
        
        // Called when data is being returned from the selected option (see `handleTeamsTaskModuleFetch').

        // Echo the users input back.  In a production bot, this is where you'd add behavior in
        // response to the input.
        await context.sendActivity(MessageFactory.text('Converted Time: ' + JSON.stringify(taskModuleRequest.data)));

        // Return TaskModuleResponse
        return {
            // TaskModuleMessageResponse
            task: {
                type: 'message',
                value: 'Thank you for using Time Converter'
            }
        };
    }

    setTaskInfo(taskInfo, uiSettings) {
        taskInfo.height = uiSettings.height;
        taskInfo.width = uiSettings.width;
        taskInfo.title = uiSettings.title;
    }

    

    getTaskModuleAdaptiveCardOptions() {                
        const templatePayload = {
            "type": "AdaptiveCard",
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "version": "1.0",
            "body": [
                {
                    "type": "Container",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "Time Converter - Adaptive Card",
                            "wrap": true,
                            "weight": 'bolder',
                            "size": "4"
                        }
                    ]
                },
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "width": "stretch",
                            "separator": true,
                            "horizontalAlignment": "Center",
                            "style": "default",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": "Current Local Time ",
                                    "weight": "2",
                                    "wrap": true
                                }
                            ]
                        },
                        {
                            "type": "Column",
                            "width": "stretch",
                            "style": "default",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "text": "${time_h}:${time_m}",
                                    "weight": "2",
                                    "wrap": true
                                }
                            ]
                        }
                    ]
                }
            ],
            actions: Actions.map((cardType) => {
                return {
                    type: 'Action.Submit',
                    title: cardType.buttonTitle,
                    data: { msteams: { type: 'task/fetch' }, buttonID: cardType.id }
                };
            })
        }

        const template = new ACData.Template(templatePayload);

        let d = new Date();
        let h = d.getHours();
        let m = d.getMinutes();
        const cardPayload = template.expand({
            $root: {
               time_h: h,
               time_m: m
            }
         });

        

        return CardFactory.adaptiveCard(cardPayload);
    }
}

module.exports.TeamsTaskModuleBot = TeamsTaskModuleBot;
