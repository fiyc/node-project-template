/**
* @Author: fiyc
* @Date : 2018-07-31 15:29
* @FileName : ws-module.js
* @Description : 
    - websocket模块
    - 负责向客户端推送消息
*/

let r = require('../common/r');
let sf = require('../common/safe-function');
let expressWS = require('express-ws');

let wsInstance;
let actions = {
    /**
     * express-ws初始化
     */
    init: function(app){
        wsInstance = expressWS(app);
        app.ws('/', actions.hi);
    },

    /**
     * 路由绑定函数
     */
    hi: function(ws, req){
        ws.on('message', function(msg){
            let response = r.success('i got it.');
            response = JSON.stringify(response);
            ws.send(response);
        });
    },

    /**
     * 向所有连接的客户端发送信息
     * @param topic 发送主题
     * @param data 发送内容
     */
    broadcast: function(topic, data){
        let clients = wsInstance.getWss().clients;

        let msg = r.success(`${topic} 主题触发`, {
            topic: topic,
            content : data
        });

        msg = JSON.stringify(msg);

        if(clients && clients.size > 0){
            clients.forEach(c => {
                c.send(msg);
            });
        }
    }
};

actions = sf.convertSafeFn(actions);
module.exports = actions;