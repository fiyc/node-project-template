/**
* @Author: fiyc
* @Date : 2018-12-04 16:04
* @FileName : each-data-task.js
* @Description : 
    - 每个表文件数据链接模块生成任务
*/

let path = require('path');

let run = function (param) {
    param = JSON.parse(JSON.stringify(param));
    let result = {
        success: true,
        data: []
    };

    if (!param) {
        result.success = false;
        return result;
    }

    let now = new Date().Format('yyyy-MM-dd hh:mm:ss');
    for(let table of param.tables){
        table.tableAliasHigh = (table.tableAlias || "").toUpperCase();
        table.tableAliasLow = (table.tableAlias || "").toLowerCase();
        table.author = param.author || "nobody";
        table.time = now;

        table.primaryName = table.columns[0].columnName;
        for(let field of table.columns){
            if(field.isPrimary){
                table.primaryName = field.columnName;
                break;
            }
        }

        result.data.push({
            templatePath: path.join(__dirname, '..', 'templates', 'each-data-task-template.txt'),
            savePath: path.join(process.cwd(), 'src', 'modules', `${table.tableAliasLow}-data.js`),
            param: table
        });
    }

    return result;
}

module.exports = {
    run
};