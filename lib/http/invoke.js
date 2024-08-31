var httpReq = require("request");
var Config = require("../../configuration");
const qs = require('querystring');
const axiosConfig = require("../../lib/http/axios").instance;
const axiosConfigrecognizer = require("../../lib/http/axios").recognizer;
const axiosConfigai_service =require("../../lib/http/axios").ai_serive;
const axiosConfigUser_service =require("../../lib/http/axios").user_service;
const axiosConfigsync =require("../../lib/http/axios").sync;
const axiosConfigtao_service =require("../../lib/http/axios").Tao_service
const axiosConfiguapservice =require("../../lib/http/axios").uapservice

const axios = require("axios");
const { exit } = require("process");
const { post } = require("request");
var qArray = [];
var q = {
  url: "http://localhost:3000/",
  client: "",
  query: {},
  docType: "",
  selector: ""
},
  options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: ""
  };
module.exports = {
  makeHTTPRequest: function (reqOptions, callback, errorCallback) {
    reqOptions.gzip = true;
    reqOptions.timeout = "1200000";
    httpReq = require("request");
    httpReq(reqOptions, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        if (body === "") {
          callback({ message: "no result found" });
        } else {
          var info = JSON.parse(body);
          callback(info);
        }
      } else {
        callback({ error: true, message: body != "" ? body : error }, null);
      }
    });
  },
  getSVCPostRequestJSON: function (
    req,
    res,
    cSession,
    url,
    client,
    method,
    selector,
    docType,
    callback,
    svcURL,
    errorCallback
  ) {
    try {
      console.log(req);
      var that = this;
      var requestJSON = [],
        query = cSession;
      var reqQuery = JSON.parse(JSON.stringify(q));
      options.url = svcURL;
      var reqOptions = JSON.parse(JSON.stringify(options));
      reqOptions.url = url;
      reqOptions.body = JSON.stringify(query);
      reqOptions.method = method;

      that.makeHTTPRequest(
        reqOptions,
        function (response) {
          if (!callback) {
            if (!response || response.statusCode !== 200) {
              that.sendErrorResponse(
                res,
                response.statusCode,
                response.statusMessage
              );
            } else {
              that.sendResponse(res, response);
            }
          } else {
            callback(response);
          }
        },
        errorCallback
      );
    } catch (error) {
      logs.log(
        logs.errorLevel.Error,
        "common.getPostRequestJSON : " + url + "\n" + error
      );
      if (errorCallback) {
        errorCallback(error);
      } else {
        throw error;
      }
    }
  },
  getPostRequestJSON: function (
    req,
    res,
    cSession,
    url,
    client,
    method,
    selector,
    docType,
    callback,
    svcURL,
    errorCallback
  ) {
    try {
      var that = this;
      var requestJSON = [],
        query = cSession.b;
      if (query.mid && !(query.mid instanceof Array)) {
        if (
          query.mid !== undefined &&
          query.mid !== null &&
          !query.mid._bsontype
        ) {
          query.mid = query.mid.replace(":", "");
        }
        if (
          query._id !== undefined &&
          query._id !== null &&
          !query._id._bsontype
        ) {
          query._id = query._id.replace(":", "");
        }
      }
      var reqQuery = JSON.parse(JSON.stringify(q));
      options.url = svcURL;
      var reqOptions = JSON.parse(JSON.stringify(options));
      (reqQuery.url = cSession.db);
      (reqQuery.client = client);
      (reqQuery.query = query);
      (reqQuery.database = cSession.database);
      (reqQuery.dbsource = cSession.b ? cSession.dbsource : null);
      (reqQuery.store = cSession.store);
      (reqQuery.docType = docType);
      (reqQuery.selector = selector);
      //reqQuery.res = JSON.stringify(res);
      reqOptions.url = url;
      reqOptions.body = JSON.stringify(reqQuery);
      reqOptions.method = method;

      that.makeHTTPRequest(
        reqOptions,
        function (response) {
          if (!callback) {
            if (!response || response.statusCode !== 200) {
              that.sendErrorResponse(
                res,
                response.statusCode,
                response.statusMessage
              );
            } else {
              that.sendResponse(res, response);
            }
          } else {
            callback(response);
          }
        },
        errorCallback
      );
    } catch (error) {
      logs.log(
        logs.errorLevel.Error,
        "common.getPostRequestJSON : " + url + "\n" + error
      );
      if (errorCallback) {
        errorCallback(error);
      } else {
        throw error;
      }
    }
  },
  getGetRequestJSON: function (
    req,
    res,
    cSession,
    url,
    client,
    method,
    selector,
    docType,
    callback,
    svcURL,
    errorCallback
  ) {
    try {
      var that = this;
      var requestJSON = [],
        query = cSession.q;
      if (
        query.mid !== undefined &&
        query.mid !== null &&
        !query.mid._bsontype
      ) {
        query.mid = query.mid.replace(":", "");
      }
      if (
        query._id !== undefined &&
        query._id !== null &&
        !query._id._bsontype
      ) {
        query._id = query._id.replace(":", "");
      }
      var reqQuery = JSON.parse(JSON.stringify(q));
      options.url = svcURL;
      var reqOptions = JSON.parse(JSON.stringify(options));
      (reqQuery.url = cSession.db);
      (reqQuery.client = client);
      (reqQuery.database = cSession.database);
      (reqQuery.dbsource = cSession.b ? cSession.b.dbsource : null);
      (reqQuery.query = query);
      (reqQuery.docType = docType);
      (reqQuery.selector = selector);
      reqOptions.url = url;
      reqOptions.body = JSON.stringify(reqQuery);
      reqOptions.method = method;
      that.makeHTTPRequest(
        reqOptions,
        function (data) {
          if (!data || (data.error && res)) {
            res.send(
              JSON.stringify({
                statusCode: 500,
                statusMessage: "Service not running"
              })
            );
          } else {
            callback(data);
          }
        },
        errorCallback
      );
    } catch (error) {
      logs.log(
        logs.errorLevel.Error,
        "common.getGetRequestJSON : " + url + "\n" + error
      );
      if (errorCallback) {
        errorCallback(error);
      } else {
        throw error;
      }
    }
  },
  makeHttpCall: async function (method, url, postParam) {
    switch (method) {
      case "get":
        return await this.makeGetCall(url);
        break;
      case "post":
        return await this.makePostCall(url, postParam);
        break;
      case "put":
        return await this.makePutCall(url, postParam);
        break;
      case "patch":
        return await this.makePatchCall(url, postParam);
        break;
      case "delete":
        return await this.makeDeleteCall(url);
        break;
    }
  },
  makeGetCall: async function (url) {
    let config = axiosConfig;
    // config["headers"] = {
    //   Authorization: postParam.headers
    // };
    return await axios.get(url, config);
  },
  makePostCall: async function (url, postParam) {
    let config = axiosConfig;
    config["headers"] = {
      authorization: postParam.authorization
    };
    return await axios.post(url, postParam, config);
  },
  makePutCall: async function (url, postParam) {
    let config = axiosConfig;
    return await axios.put(url, postParam, config);
  },
  makePatchCall: async function (url, postParam) {
    let config = axiosConfig;
    return await axios.patch(url, postParam, config);
  },
  makeDeleteCall: async function (url) {
    let config = axiosConfig;
    return await axios.delete(url, config);
  },
  makeHttpCallrecognizer: async function (method, url, postParam) {
    switch (method) {
      case "get":
        return await this.makeGetCallrecognizer(url);
        break;
      case "post":
        return await this.makePostCallrecognizer(url, postParam);
        break;
      case "put":
        return await this.makePutCallrecognizer(url, postParam);
        break;
      case "patch":
        return await this.makePatchCallrecognizer(url, postParam);
        break;
      case "delete":
        return await this.makeDeleteCallrecognizer(url);
        break;
    }
  },
  makeGetCallrecognizer: async function (url) {
    let config = axiosConfigrecognizer;
    return await axios.get(url, config);
  },
  makePostCallrecognizer: async function (url, postParam) {
    let config = axiosConfigrecognizer;
    // config["headers"] = {
    //   Authorization: postParam.headers
    // };
    return await axios.post(url, postParam, config);
  },
  makePutCallrecognizer: async function (url, postParam) {
    let config = axiosConfigrecognizer;
    return await axios.put(url, postParam, config);
  },
  makePatchCallrecognizer: async function (url, postParam) {
    let config = axiosConfigrecognizer;
    return await axios.patch(url, postParam, config);
  },
  makeDeleteCallrecognizer: async function (url) {
    let config = axiosConfigrecognizer;
    return await axios.delete(url, config);
  },
  makeHttpCallai_service: async function (method, url, postParam) {
    switch (method) {
      case "get":
        return await this.makeGetCallai_service(url);
        break;
      case "post":
        return await this.makePostCallai_service(url, postParam);
        break;
      case "put":
        return await this.makePutCallai_service(url, postParam);
        break;
      case "patch":
        return await this.makePatchCallai_service(url, postParam);
        break;
      case "delete":
        return await this.makeDeleteCallai_service(url);
        break;
    }
  },
  makeGetCallai_service: async function (url) {
    let config = axiosConfigai_service;
    return await axios.get(url, config);
  },
  makePostCallai_service: async function (url, postParam) {
    let config = axiosConfigai_service;
    // config["headers"] = {
    //   Authorization: postParam.headers
    // };
    return await axios.post(url, postParam, config);
  },
  makePutCallai_service: async function (url, postParam) {
    let config = axiosConfigai_service;
    return await axios.put(url, postParam, config);
  },
  makePatchCallai_service: async function (url, postParam) {
    let config = axiosConfigai_service;
    return await axios.patch(url, postParam, config);
  },
  makeDeleteCallai_service: async function (url) {
    let config = axiosConfigai_service;
    return await axios.delete(url, config);
  },
  makeHttpCallsync: async function (method, url, postParam) {
    switch (method) {
      case "get":
        return await this.makeGetCallsync(url);
        break;
      case "post":
        return await this.makePostCallsync(url, postParam);
        break;
      case "put":
        return await this.makePutCallsync(url, postParam);
        break;
      case "patch":
        return await this.makePatchCallsync(url, postParam);
        break;
      case "delete":
        return await this.makeDeleteCallsync(url);
        break;
    }
  },
  makeGetCallsync: async function (url) {
    let config = axiosConfigsync;
    return await axios.get(url, config);
  },
  makePostCallsync: async function (url, postParam) {
    let config = axiosConfigsync;
    // config["headers"] = {
    //   Authorization: postParam.headers
    // };
    return await axios.post(url, postParam, config);
  },
  makePutCallsync: async function (url, postParam) {
    let config = axiosConfigsync;
    return await axios.put(url, postParam, config);
  },
  makePatchCallsync: async function (url, postParam) {
    let config = axiosConfigsync;
    return await axios.patch(url, postParam, config);
  },
  makeDeleteCallsync: async function (url) {
    let config = axiosConfigsync;
    return await axios.delete(url, config);
  },
  makeHttpCallUser_service: async function (method, url, postParam) {
    switch (method) {
      case "get":
        return await this.makeGetCallUser_service(url);
        break;
      case "post":
        return await this.makePostCallUser_service(url, postParam);
        break;
      case "put":
        return await this.makePutCallUser_service(url, postParam);
        break;
      case "patch":
        return await this.makePatchCallUser_service(url, postParam);
        break;
      case "delete":
        return await this.makeDeleteCallUser_service(url);
        break;
    }
  },
  makeGetCallUser_service: async function (url) {
    let config = axiosConfigUser_service;
    return await axios.get(url, config);
  },
  makePostCallUser_service: async function (url, postParam) {
    let config = axiosConfigUser_service;
    // config["headers"] = {
    //   Authorization: postParam.headers
    // };
    return await axios.post(url, postParam, config);
  },
  makePutCallUser_service: async function (url, postParam) {
    let config = axiosConfigUser_service;
    return await axios.put(url, postParam, config);
  },
  makePatchCallUser_service: async function (url, postParam) {
    let config = axiosConfigUser_service;
    return await axios.patch(url, postParam, config);
  },
  makeDeleteCallUser_service: async function (url) {
    let config = axiosConfigUser_service;
    return await axios.delete(url, config);
  },
  makeHttpTao_service: async function (method, url, postParam) {
  switch (method) {
    case "get":
      return await this.makeGetCallTao_service(url);
      break;
    case "post":
      return await this. makePostCallTao_service(url, postParam);
      break;
    case "put":
      return await this. makePutCallTao_service(url, postParam);
      break;
    case "patch":
      return await this. makePatchCallTao_service(url, postParam);
      break;
    case "delete":
      return await this. makeDeleteCallTao_servicee(url);
      break;
    }
  },
  makeGetCallTao_service: async function (url) {
    let config = axiosConfigtao_service;
    return await axios.get(url, config);
  },
  makePostCallTao_service: async function (url, postParam) {
    let config = axiosConfigtao_service;
    return await axios.post(url, postParam, config);
  },
  makePutCallTao_service: async function (url, postParam) {
    let config = axiosConfigtao_service;
    return await axios.put(url, postParam, config);
  },
  makePatchCallTao_service: async function (url, postParam) {
    let config = axiosConfigtao_service;
    return await axios.patch(url, postParam, config);
  },
  makeDeleteCallTao_service: async function (url) {
    let config = axiosConfigtao_service;
    return await axios.delete(url, config);
  },
  //////////////////UAP CALL
  makeHttpUAP_service: async function (method, url, postParam) {
    switch (method) {
      case "get":
        return await this.makeGetCallUAP_service(url);
        break;
      case "post":
        return await this. makePostCallUAP_service(url, postParam);
        break;
      case "put":
        return await this. makePutCallUAP_service(url, postParam);
        break;
      case "patch":
        return await this. makePatchCallUAP_service(url, postParam);
        break;
      case "delete":
        return await this. makeDeleteCallUAP_servicee(url);
        break;
      }
    },
    makeGetCallUAP_service: async function (url) {
      let config = axiosConfiguapservice;
      return await axios.get(url, config);
    },
    makePostCallUAP_service: async function (url, postParam) {
      let config = axiosConfiguapservice;
      return await axios.post(url, postParam, config);
    },
    makePutCallUAP_service: async function (url, postParam) {
      let config = axiosConfiguapservice;
      return await axios.put(url, postParam, config);
    },
    makePatchCallUAP_service: async function (url, postParam) {
      let config = axiosConfiguapservice;
      return await axios.patch(url, postParam, config);
    },
    makeDeleteCallUAP_service: async function (url) {
      let config = axiosConfiguapservice;
      return await axios.delete(url, config);
    },
};
