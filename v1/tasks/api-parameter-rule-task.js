/**
* @Author: fiyc
* @Date : 2018-12-04 18:15
* @FileName : api-parameter-rule-task.js
* @Description : 
    - 接口校验规则生成任务
*/

let path = require('path');

let run = function (param) {
    param = JSON.parse(JSON.stringify(param));
    let result = {
        success: true,
        data: {
            templatePath: path.join(__dirname, '..', 'templates', 'api-parameter-rule-template.txt'),
            savePath: path.join(process.cwd(), 'src', 'controller', 'api-parameter-rule.js'),
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
    
    for(let table of param.tables){
        table.tableAliasHigh = (table.tableAlias || "").toUpperCase();
        table.tableAliasLow = (table.tableAlias || "").toLowerCase();
    }

    result.data.param = param;
    return result;
}

module.exports = {
    run
};