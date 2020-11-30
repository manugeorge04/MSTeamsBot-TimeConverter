// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { UISettings } = require('./uisettings');
//const { TaskModuleIds } = require('./taskmoduleids');

const TaskModuleUIConstants = {    
    TimezoneConverter : new UISettings(330, 350, 'Timezone Converter', 'CustomForm', 'Timezone Converter')    
};

module.exports.TaskModuleUIConstants = TaskModuleUIConstants;
