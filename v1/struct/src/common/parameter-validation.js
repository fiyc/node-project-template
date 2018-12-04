/**
* @Author: fiyc
* @Date : 2018-11-07 17:15
* @FileName : parameter-validation.js
* @Description : 
    - 参数校验模块
    - 根据输入实体与对应规则做匹配, 返回匹配结果
    - 支持校验规则
        - message 总信息提示
        - required 必填
        - number 是数字
        - string 是字符串
        - array 是集合
        - object 是结构体
        - max 数字最大值
        - min 数字最小值
        - maxlength 字符串最大长度
        - minlength 字符串最小长度
        - maxsize 集合最大长度
        - minsize 集合最小长度
        - regex 正则表达式
        - sub 集合或者结构体子项规则


    - example
    {
        id: {
            message: “无效的id”,
            required: true,
            number: true
            max: 10
            min: 1
        }
    }
*/
let response = function(success, message){
    let result = {};
    if(success){
        result.success = true;
    }else{
        result.success = false;
    }

    if(message){
        result.message = message;
    }

    return result;
}

let validate = function(rule, object){
    if(!rule || typeof rule !== "object"){
        return response(true);
    }

    for(let field in rule){
        let fieldRule = rule[field];
        let fieldValue = object[field];

        let validResult = checkField(fieldRule, fieldValue);
        if(!validResult.success){
            return validResult;
        }
    }

    return response(true);
}

let checkField = function(fieldRule, fieldValue){
    if(!fieldRule || typeof fieldRule !== "object"){
        return response(true);
    }

    let message = fieldRule['message'] || "";
    for(let ruleKey in fieldRule){
        if(ruleKey === "message" || ruleKey === "sub"){
            continue;
        }

        if(!ruleHandler[ruleKey]){
            continue;
        }
        
        let isValid = ruleHandler[ruleKey](fieldRule[ruleKey], fieldValue);
        if(!isValid){
            return response(false, message);
        }

        if(ruleKey === "object" && fieldRule["sub"] && fieldValue){
            let checkRe = validate(fieldRule["sub"], fieldValue);
            if(!checkRe.success){
                return checkRe;
            }
        }

        if(ruleKey === "array" && fieldRule["sub"] && fieldValue){
            for(let itemValue of fieldValue){
                let checkRe = validate(fieldRule["sub"], itemValue);
                if(!checkRe.success){
                    return checkRe;
                }
            }
        }

    }

    return response(true);
}


let ruleHandler = {
    required: function(ruleValue, fieldValue){
        if(ruleValue === null || ruleValue === undefined){
            return true;
        }

        if(fieldValue === null || fieldValue === undefined){
            return false;
        }

        return true;
    },
    number: function(ruleValue, fieldValue){
        if(ruleValue === null || ruleValue === undefined){
            return true;
        }

        if(fieldValue === null || fieldValue === undefined){
            return true;
        }

        if(fieldValue === ""){
            return false;
        }

        let tryNumber = Number(fieldValue);
        if(Number.isNaN(tryNumber)){
            return false;
        }

        return true;
    },
    string: function(ruleValue, fieldValue){
        if(ruleValue === null || ruleValue === undefined){
            return true;
        }

        if(fieldValue === null || fieldValue === undefined){
            return true;
        }

        return typeof fieldValue === "string";
    },
    array: function(ruleValue, fieldValue){
        if(ruleValue === null || ruleValue === undefined){
            return true;
        }

        if(fieldValue === null || fieldValue === undefined){
            return true;
        }

        return Array.isArray(fieldValue); 
    },
    object: function(ruleValue, fieldValue){
        if(ruleValue === null || ruleValue === undefined){
            return true;
        }

        if(fieldValue === null || fieldValue === undefined){
            return true;
        }

        return typeof fieldValue === "object";
    },
    max: function(ruleValue, fieldValue){
        if(ruleValue === null || ruleValue === undefined){
            return true;
        }

        if(fieldValue === null || fieldValue === undefined){
            return true;
        }

        let tryMax = Number(ruleValue);
        if(Number.isNaN(tryMax)){
            return true;
        }

        let tryNumber = Number(fieldValue);
        if(Number.isNaN(tryNumber)){
            return false;
        }

        return tryNumber <= tryMax;
    },
    min: function(ruleValue, fieldValue){
        if(ruleValue === null || ruleValue === undefined){
            return true;
        }

        if(fieldValue === null || fieldValue === undefined){
            return true;
        }

        let tryMin = Number(ruleValue);
        if(Number.isNaN(tryMin)){
            return true;
        }

        let tryNumber = Number(fieldValue);
        if(Number.isNaN(tryNumber)){
            return false;
        }

        return tryNumber >= tryMin;
    },
    maxlength: function(ruleValue, fieldValue){
        if(ruleValue === null || ruleValue === undefined){
            return true;
        }

        if(fieldValue === null || fieldValue === undefined){
            return true;
        }

        let tryMaxLength = Number(ruleValue);
        if(Number.isNaN(tryMaxLength)){
            return true;
        }

        return fieldValue.length <= tryMaxLength;
    },
    minlength: function(ruleValue, fieldValue){
        if(ruleValue === null || ruleValue === undefined){
            return true;
        }

        if(fieldValue === null || fieldValue === undefined){
            return true;
        }

        let tryMinLength = Number(ruleValue);
        if(Number.isNaN(tryMinLength)){
            return true;
        }

        return fieldValue.length >= tryMinLength;
    },
    maxsize: function(ruleValue, fieldValue){
        if(ruleValue === null || ruleValue === undefined){
            return true;
        }

        if(fieldValue === null || fieldValue === undefined){
            return true;
        }

        let tryMaxLength = Number(ruleValue);
        if(Number.isNaN(tryMaxLength)){
            return true;
        }

        let arrayLength = Array.isArray(fieldValue) ? fieldValue.length : 0;

        return arrayLength <= tryMaxLength;
    },
    minsize: function(ruleValue, fieldValue){
        if(ruleValue === null || ruleValue === undefined){
            return true;
        }

        if(fieldValue === null || fieldValue === undefined){
            return true;
        }

        let tryMinLength = Number(ruleValue);
        if(Number.isNaN(tryMinLength)){
            return true;
        }

        let arrayLength = Array.isArray(fieldValue) ? fieldValue.length : 0;

        return arrayLength >= tryMinLength;
    },
    regex: function(ruleValue, fieldValue){
        if(ruleValue === null || ruleValue === undefined){
            return true;
        }

        if(fieldValue === null || fieldValue === undefined){
            return true;
        }

        let reg = new RegExp(ruleValue);
        return reg.test(fieldValue);
    },
};

module.exports = validate;

