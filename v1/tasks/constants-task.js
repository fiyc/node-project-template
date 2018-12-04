/**
* @Author: fiyc
* @Date : 2018-12-04 16:04
* @FileName : constants-task.js
* @Description : 
    - 静态值模块生成任务
*/

let path = require('path');

let run = function (param) {
    param = JSON.parse(JSON.stringify(param));
    let result = {
        success: true,
        data: {
            templatePath: path.join(__dirname, '..', 'templates', 'constants-task-template.txt'),
            savePath: path.join(process.cwd(), 'src', 'modules', 'constants.js'),
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

    param.time = new Date().Format('yyyy-MM-dd hh:mm:ss');
    
    result.data.param = param;
    return result;
}

module.exports = {
    run
};