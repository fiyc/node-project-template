/**
* @Author: fiyc
* @Date : 2018-07-24 15:08
* @FileName : safe-function.js
* @Description : 
    - 异常处理函数封装
*/



let F = function (fn, context, errorHander) {
    if (fn.constructor.name === 'Function') {
        return function () {
            try {
                context = context || this;
                return fn.apply(context, arguments);
            } catch (err) {
                arguments[arguments.length] = err.message;
                arguments.length += 1;
                console.error(err);
                if(errorHander && typeof errorHander === 'function'){
                    return errorHander.apply(null, arguments);
                }
            }
        }
    } else if (fn.constructor.name === 'AsyncFunction'){
        return async function () {
            context = context || this;
            return fn.apply(context, arguments).catch(function (err) {
                arguments[arguments.length] = err.message;
                arguments.length += 1;
                console.error(err);
                if (errorHander && typeof errorHander === 'function') {
                    return errorHander.apply(null, arguments);
                }
            });
        }
    }
}

/**
 * 为目标对象下的所有函数进行异常处理装饰
 * @param {*} Object 
 * @param {*} errorHander 
 */
let convertSafeFn = function(obj, errorHander){
    if(!obj){
        return;
    }

    for(let key in obj){
        let item = obj[key];

        if(typeof item === 'function'){
            obj[key] = F(item, null, errorHander);
        }
    }

    return obj;
}

module.exports = {
    F,
    convertSafeFn
};