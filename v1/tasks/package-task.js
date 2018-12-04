/**
* @Author: fiyc
* @Date : 2018-12-04 16:06
* @FileName : package-task.js
* @Description : 
    - package.json 文件生成任务
*/

let path = require('path');

let run = function (param) {
    param = JSON.parse(JSON.stringify(param));
    let result = {
        success: true,
        data: {
            templatePath: path.join(__dirname, '..', 'templates', 'package-task-template.txt'),
            savePath: path.join(process.cwd(), 'src', 'package.json'),
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

    result.data.param = {
        name: param.name,
        author: param.author
    };
    return result;
}

module.exports = {
    run
};