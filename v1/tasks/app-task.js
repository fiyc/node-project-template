/**
* @Author: fiyc
* @Date : 2018-12-04 16:06
* @FileName : app-task.js
* @Description : 
    - app.json 项目信息模块生成任务
*/

let path = require('path');

let run = function (param) {
    param = JSON.parse(JSON.stringify(param));
    let result = {
        success: true,
        data: {
            templatePath: path.join(__dirname, '..', 'templates', 'app-task-template.txt'),
            savePath: path.join(process.cwd(), 'app.json'),
            param: {}
        }
    };

    if (!param) {
        result.success = false;
        return result;
    }

    if (!param.author) {
        param.author = 'nobody';
    }

    result.data.param = param;
    return result;
}

module.exports = {
    run
};