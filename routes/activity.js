'use strict';
var util = require('util');

// Deps
const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
//const SFClient = require(Path.join(__dirname, '..', 'lib', 'sfmc-client.js'));
var http = require('https');

//-----------------------------
const SFClient = require('../utils/sfmc-client');
//const { v1: Uuidv1 } = require('uuid');   //for unique id
//----------------------------------------
exports.logExecuteData = [];

function logData(req) {
    exports.logExecuteData.push({
        body: req.body,
        headers: req.headers,
        trailers: req.trailers,
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        route: req.route,
        cookies: req.cookies,
        ip: req.ip,
        path: req.path, 
        host: req.host,
        fresh: req.fresh,
        stale: req.stale,
        protocol: req.protocol,
        secure: req.secure,
        originalUrl: req.originalUrl
    });
    console.log("body: " + util.inspect(req.body));
    console.log("headers: " + req.headers);
    console.log("trailers: " + req.trailers);
    console.log("method: " + req.method);
    console.log("url: " + req.url);
    console.log("params: " + util.inspect(req.params));
    console.log("query: " + util.inspect(req.query));
    console.log("route: " + req.route);
    console.log("cookies: " + req.cookies);
    console.log("ip: " + req.ip);
    console.log("path: " + req.path);
    console.log("host: " + req.host);
    console.log("fresh: " + req.fresh);
    console.log("stale: " + req.stale);
    console.log("protocol: " + req.protocol);
    console.log("secure: " + req.secure);
    console.log("originalUrl: " + req.originalUrl);
}

/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function (req, res) {

    console.log("5 -- For Edit");	
    console.log("4");	
    console.log("3");	
    console.log("2");	
    console.log("1");	
    //console.log("Edited: "+req.body.inArguments[0]);    
    
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.send(200, 'Edit');
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function (req, res) {
    
    console.log("5 -- For Save");	
    console.log("4");	
    console.log("3");	
    console.log("2");	
    console.log("1");	
    //console.log("Saved: "+req.body.inArguments[0]);
    
    // Data from the req and put it in an array accessible to the main app.
    console.log( req.body );
    logData(req);
    res.send(200, 'Save');
};

/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function (req, res) {

    console.log("5 -- For Execute");	
    console.log("4");	
    console.log("3");	
   console.log("2");	
    console.log("1");	
    //console.log("Executed: "+req.body.inArguments[0]);
    
    var requestBody = req.body.inArguments[0];

    const accountSid = requestBody.accountSid;
    const authToken = requestBody.authToken;
    const to = requestBody.to;
    const from = requestBody.messagingService;
    const body = requestBody.body;;

    const client = require('twilio')(accountSid, authToken); 
     
    client.messages 
          .create({ 
             body: body,
             from: '+18782066477',
             to: to,
             provideFeedback:true
           }) 
          .then( (message) => {
            console.log('Response:'+JSON.stringify(message))
               try
               {
                   
                    SFClient.saveData(process.env.DATA_EXTENSION_EXTERNAL_KEY, [
                      {
                        keys: {
                          to: message.to,
                        },
                        values: {
                           
                          accountSid: message.accountSid,
                          body: message.body,
                          from: message.from,
                          uri: message.uri,
                        },
                      }
                    ]);
               }
                catch(err)   
               {
                   console.log(err);
               }
               })
          .done();
    //to save in data extension

    // var messagebird = require('messagebird')('XZjkDi18UTDVwU7PNXwsXtI2b');
    // function sendMessageBirdSMS() {
    //   var params = {
    //     'originator': 'TestMessage',
    //     'recipients': [
    //       '+917375040450'
    //     ],
    //     'body': 'This is a test message from messagebird'
    //   };
    
    //   messagebird.messages.create(params, function (err, response) {
    //     if (err) {
    //       return console.log(err);
    //     }
    //     console.log(response);
    //   });
    // }

    // sendMessageBirdSMS();
    // console.log('Message sent');
    
    // WeChatAPI
    // const dispatchWeChatEvent = (wechat, direction = 'inbound') => {
    //   var options = {
    //     uri: `https://api.nexmo.com/beta/conversations/${conversationId}/events`,
    //     method: 'POST',
    //     headers: {
    //       Authorization: 'Bearer ' + jwt,
    //       Accept: 'application/json',
    //       'Content-Type': 'application/json'
    //     },
    //     json: {
    //       type: 'custom:wechat:message',
    //       body: {
    //         to: wechat.getTo(),
    //         from: wechat.getFrom(),
    //         content: wechat.getContent(),
    //         direction
    //       }
    //     }
    //   };
    
    //   request(options, (error, response, body) => {
    //     if (!error && response.statusCode == 200) {
    //       console.log('successfully sent WeChat message'); 
    //     }
    //   });
    // };


    
    //-----------------------------------------

    // FOR TESTING
    logData(req);
    res.send(200, 'Publish');

    // Used to decode JWT
    // JWT(req.body, process.env.jwtSecret, (err, decoded) => {

    //     // verification error -> unauthorized request
    //     if (err) {
    //         console.error(err);
    //         return res.status(401).end();
    //     }

    //     if (decoded && decoded.inArguments && decoded.inArguments.length > 0) {
            
    //         // decoded in arguments
    //         var decodedArgs = decoded.inArguments[0];
            
    //         logData(req);
    //         res.send(200, 'Execute');
    //     } else {
    //         console.error('inArguments invalid.');
    //         return res.status(400).end();
    //     }
    // });
};


/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function (req, res) {

    console.log("5 -- For Publish");	
    console.log("4");	
    console.log("3");	
    console.log("2");	
    console.log("1");	
    //console.log("Published: "+req.body.inArguments[0]);        
    
    // Data from the req and put it in an array accessible to the main app.
    console.log( req.body );
    logData(req);
    res.send(200, 'Publish');
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function (req, res) {

   console.log("5 -- For Validate");	
    console.log("4");	
    console.log("3");	
   console.log("2");	
   console.log("1");	
    //console.log("Validated: "+req.body.inArguments[0]);       
    
    // Data from the req and put it in an array accessible to the main app.
   console.log( req.body );
    logData(req);
    res.send(200, 'Validate');
};
