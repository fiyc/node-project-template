/**
* @Author: fiyc
* @Date : 2018-07-26 10:29
* @FileName : base.js
* @Description : 
    - controller使用公共模块
*/


/**
 * 返回结果, 包含对跨域的支持
 * @param {*} req 
 * @param {*} res 
 * @param {*} data  
 */
let send = function (req, res, data) {
    if (req.query.callback) {
        res.jsonp(data);
    } else {
        res.json(data);
    }
}

/**
 * 统一返回器构造
 */

 let init = function(req, res){
    /**
     * 返回错误信息
     * @param {*} msg 
     */
    let error = function(code){
        // let data = r.error(msg);
        let message = res.__(code);
        if(!message){
            message = code;
        }


        let response = {
            success: false,
            data: {
                errorCode: code,
                errorMessage:  message
            }
        };
        send(req, res, response);        
    }

    /**
     * 返回成功信息
     * @param {*} msg 
     * @param {*} data 
     */
    let success = function(msg, data){
        // let resData = r.success(msg, data);
        let response = {
            success: true,
            data: data
        };
        send(req, res, response);
    }

    /**
     * 直接发送返回内容
     * @param {*} response 
     */
    let common = function(data){
        let response = {
            success: true,
            data: {}
        };
        
        if(data.success){
            response.data = data.data;
        }else{
            response.success = false;
            let message = res.__(data.message);
            if(!message){
                message = data.message;
            }

            response.data.errorCode = data.message;
            response.data.errorMessage = message;
        }

        send(req, res, response);
    }

    return {
        error,
        success,
        common
    };
}

/**
 * controller 中对于异常情况下的统一处理
 * @param {*} req 
 * @param {*} res 
 * @param {*} data 
 */
let errorCallback = function(req, res, next){
    init(req, res).error("error_000");
}

module.exports = {
    r: init,
    errorCallback
}