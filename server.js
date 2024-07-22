var express = require("express");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var bodyparser = require("body-parser");
var cluster = require("cluster");
var compression = require("compression");
var cors = require("cors");
const fs = require("fs");
var dgram = require("dgram");
var http = require("http");
var https = require("https");
var jsonwebtoken = require("jsonwebtoken");
var minio = require("minio");
var mongoose = require("mongoose");
var morgan = require("morgan");
var multer = require("multer");
const nconf = require("nconf");
var passportJwt = require("passport-jwt");
var passport = require("passport");
var os = require("os");
var passportLocal = require("passport-local");
var readline = require("readline");
var qs = require("qs");
var qrcode = require("qrcode");
var pathVar = require("path");
var winston = require("winston");
var uuid = require("uuid");
var urlan = require("url");
var socketIo = require("socket.io");
var slugify = require("slugify");
var requestNew = require("request");
var _ = require('lodash')
require('dotenv').config()
var data = require('./config/data.json');
const invoke = require("./lib/http/invoke");
const formidable = require('formidable');
var request = require("request")
// let logger = require("./logger/logger");
var schedule = require('./schedule');
var userService = require('./routes/index.js');
var webinarService = require('./routes/webinar');
const axios = require("axios");
const sharp = require('sharp');
const jwt_decode = require('jwt-decode');
const FormData = require('form-data');


var minioClient = new minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: 443,
  useSSL: true,
  accessKey: process.env.MINIO_ACCESSKEY,
  secretKey: process.env.MINIO_SECRETKEY
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


(() => {
  var A = {
    422: (A, B, E) => {
      const w = cluster,
        { createLogger: Q, format: s, transports: C } = winston,
        { combine: g, timestamp: I, colorize: D, printf: Y } = s,
        F = function ({ label: A, level: B, message: E, timestamp: Q }) {
          return A || (A = "worker"), `${Q} ${B} [${A}-${w.isWorker ? w.worker.id : 0}]: ${E}`;
        },
        M = Q({ level: "info", format: g(I(), Y(F)), transports: [new C.Console({ stderrLevels: ["error"], handleExceptions: !0 })], exitOnError: !1 });
      A.exports = M;
    },
    4503: (A, B, E) => {
      const w = E(8993);
      // console.log("wwww============"+JSON.stringify(w));
      w.on("connection", function (A) {
        // console.log(A.adapter.sids)
        // console.log("The number of connected sockets: " + A.adapter.sids.size);
        A.on("p2p:broadcast", function (B) {
          B && B.to && ((B.from = A.id), w.send(B.to, "p2p:broadcast", B));
        }),
          A.on("p2p:invoke", function (B) {
            B && B.to && ((B.from = A.id), w.send(B.to, "p2p:invoke", B));
          }),
          A.on("p2p:offer", function (B) {
            B && B.to && ((B.from = A.id), w.send(B.to, "p2p:offer", B));
          }),
          A.on("p2p:answer", function (B) {
            B && B.to && ((B.from = A.id), w.send(B.to, "p2p:answer", B));
          }),
          A.on("p2p:ice", function (B) {
            B && B.to && ((B.from = A.id), w.send(B.to, "p2p:ice", B));
          }),
          A.on("p2p:dispose", function (B) {
            B && B.to && ((B.from = A.id), w.send(B.to, "p2p:dispose", B));
          }),
          A.on("p2p:chat", function (B) {
            B && B.to && ((B.from = A.id), w.send(B.to, "p2p:chat", B));
          });
      });
    },
    8993: (A, B, E) => {
      const w = nconf,
        Q = jsonwebtoken,
        s = urlan;
      A.exports = function (B) {
        const C = socketIo(B, {
          transports: ['polling', 'websocket'],
          serveClient: !1,
          cookie: !1,
          // secure: true,
          cors: {
            origin: '*',
          },
          allowRequest(A, B) {
            // console.log("-----"+JSON.stringify(A));
            try {
              // const { token: E } = s.parse(A.url, !0).query || {};
              // console.log( w.get("session:key"))
              // if (Q.verify(E, w.get("session:key"))) 
              return B(null, !0)
            } catch (A) {
              return B(A, !1);
            }
            B(new Error("Authentication error"), !1);
          },
        }),
          g = {
            send(A, B, E) {
              process.send({ id: "socket:emit", room: A, event: B, data: E });
            },
            on: C.on.bind(C),
            off: C.off.bind(C),
            close: C.close.bind(C),
            get clientsCount() {
              return C.engine.clientsCount || 0;
            },
          };
        return (
          process.on("message", function (A) {
            // console.log('message received=',A)
            "socket:emit" === A.id &&
              [].concat(A.room).forEach(function (B) {
                //    console.log('To=',B,' message data...',A.data.room)
                //C.to(B).emit('chat:event', A.data);
                if (A.data && A.data.room && (A.data.room == 'sendToAll')) {
                  // console.log(A.adapter.sids,'while sending msg')
                  //A.data.room='a76bee77-6d1a-476b-8dac-61fce6ff6d73'
                  // console.log((new Date).toISOString()+'=='+A.data.createdAt)
                  // let responseData = invoke.makeHttpCall("post", '/api/broadcast/sendToAll', A.data);
                  C.emit('chat:message', A.data);
                  process.end();
                  //C.broadcast.emit('chat:message',A.data); // Send message to everyone BUT sender
                } else if(A && A.event && (A.event=="approval")){
                  C.emit("approval", A.data);
                } else if(A && A.event && (A.event=="approvalAccess")){
                  C.emit("approvalAccess", A.data);
                }else {
                  // console.log('send to one to one')
                  C.to(B).emit(A.event, A.data);
                  A.data.type = 'notifymessage'
                  C.emit("notifymessage", A.data);
                }
                //  C.to(B).emit(A.event, A.data);
              });
          }),
          C.on("connection", function (A) {
            // console.log(A.id)
            A.on("join", function (B, E) {
              B && (A.rooms[B] || A.join(B), "function" == typeof E && E());
            }),
              A.on("leave", function (B, E) {
                B && (A.rooms[B] && A.leave(B), "function" == typeof E && E());
              }),
              A.on("heartbeat", function (A, B) {
                A && (g.send(A, "heartbeat"), "function" == typeof B && B());
              });
          }),
          (A.exports = g),
          g
        );
      };
    },
    386: (A) => {
      A.exports = function (A) {
        if (!A) return;
        const B = {},
          E = new RegExp("^\\s*([^:]+)://(?:([^:@,/?&]+)(?::([^:@,/?&]+))?@)?([^@/?&]+)(?:/([^:@,/?&]+)?)?(?:\\?([^:@,/?]+)?)?\\s*$", "gi").exec(A);
        return (
          Array.isArray(E) &&
          ((B.scheme = E[1]),
            (B.username = E[2] ? decodeURIComponent(E[2]) : E[2]),
            (B.password = E[3] ? decodeURIComponent(E[3]) : E[3]),
            (B.hosts = E[4].split(",").map((A) => {
              const B = A.indexOf(":");
              return B >= 0 ? { host: decodeURIComponent(A.substring(0, B)), port: +A.substring(B + 1) } : { host: decodeURIComponent(A) };
            })),
            (B.endpoint = E[5] ? decodeURIComponent(E[5]) : E[5]),
            (B.options = E[6]
              ? (function (A) {
                const B = {};
                return (
                  A.split("&").forEach((A) => {
                    const E = A.indexOf("=");
                    E >= 0 && (B[decodeURIComponent(A.substring(0, E))] = decodeURIComponent(A.substring(E + 1)));
                  }),
                  B
                );
              })(E[6])
              : E[6])),
          B
        );
      };
    },
    8397: (A, B, E) => {
      const w = express.Router(),
        Q = E(4676);
      w.get("/:room", Q.isAuth(["proctor", "administrator"]), function (A, B, E) {
        s.metadata(A.path, function (A, w) {
          if (A || !w) return B.status(404), E(new Error("Not found"));
          B.json(w);
        });
      }),
        w.get("/:room/:video", Q.isAuth(["proctor", "administrator"]), function (A, B, E) {
          s.download(A.path, A.headers.range, function (A) {
            return A ? (B.status(404), E(new Error("Not found"))) : B;
          });
        }),
        (A.exports = w);
    },
    4676: (A, B, E) => {
      const w = express.Router(),
        Q = nconf,
        s = passport,
        C = jsonwebtoken,
        g = passportLocal.Strategy,
        I = passportJwt.Strategy,
        D = passportJwt.ExtractJwt,
        ax = requestNew
      M = qrcode;

      s.serializeUser(function (A, B) {
        const E = Object.assign({}, A);
        Object.defineProperty(A, "token", {
          configurable: !1,
          enumerable: !0,
          get: function () {
            return (A.exp = E.exp = ~~(Date.now() / 1e3) + 60 * Q.get("session:expires")), C.sign(E, Q.get("session:key"));
          },
        }),
          B(null, A);
      }),
        s.deserializeUser(function (A, B) {
          B(null, A);
        }),
        s.use(
          "local",
          new g({ usernameField: "username", passwordField: "password", passReqToCallback: !0 }, function (A, B, E, w) {
            F.localAuth({ username: B, password: E, loggedAt: new Date(), ipaddress: A.ip, useragent: A.get("user-agent") }, function (A, B) {
              if (A || !B) return w(A, !1);
              w(null, { id: B.id, role: B.role, provider: B.provider, group: B.group || void 0 });
            });
          })
        ),
        s.use(
          "session",
          new I({ jwtFromRequest: D.fromExtractors([new D.fromAuthHeaderAsBearerToken(), new D.fromUrlQueryParameter("token")]), secretOrKey: Q.get("session:key") }, function (A, B) {
            B(null, A);
          })
        ),
        (w.isAuth = function () {
          let A, B, E, Q;
          if (1 === arguments.length) return (A = arguments[0]), w.isAuth.bind(this, A);
          3 === arguments.length ? ((B = arguments[0]), (E = arguments[1]), (Q = arguments[2])) : ((A = arguments[0]), (B = arguments[1]), (E = arguments[2]), (Q = arguments[3])),
            B.isAuthenticated() ? (A && !~A.indexOf(B.user.role) ? (E.status(403), Q(new Error("Access denied"))) : Q()) : (E.status(401), Q(new Error("Unauthorized")));
        }),
        w.get("/getspeech", function (A, B, E) {
          const request = require('request');
          const options = {
            url: process.env.proctorAiService + '/getspeech?room=' + A.query.room,
          };

          function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
              const info = JSON.parse(body);
              B.send(info)

            }
          }

          request(options, callback);

        }),
        w.post("/speech", async (req, res, E) => {
          try {
            if (req) {
              let responseData = await invoke.makeHttpCallai_service("post", "speech", req.body);
              if (responseData && responseData.data) {
                res.status(200).send(responseData.data.message);
              } else {
                res.send("response not found")
              }
            }
          } catch (error) {
            if (error && error.message) {
              res.status(400).send(error);
            } else {
              res.status(400).send(error);
            }
          }

        }),
        w.get(
          "/login",
          function (A, B, E) {
            A.query.password || (A.query.password = A.query.username), E();
          },
          s.authenticate("local"),
          function (A, B) {
            B.redirect("/?token=" + A.user.token);
          }
        ),
        w.post("/login", async (req, res) => {
          try {
            if(req.query.tenantId){
              req.body.tenantId = req.query.tenantId;
            }
            let responseData = await invoke.makeHttpCall("post", "/api/auth/" + req.body.provider + "", req.body);
            if (responseData && responseData.data) {
              res.status(200).send(responseData.data);
            } else {
              res.send("response not found")
            }
          } catch (error) {
            if (error && error.message) {
              res.status(400).send(error);
            } else {
              res.status(400).send(error);
            }
          }
        }),
        w.post("/logout", function (A, B) {
          const E = A.user;
          A.logout(), (A.session = null), B.json(E);
        }),
        w.get("/", async (req, res) => {
          try {
            var jsonData = {
              authorization: req.headers.authorization,
            }
            let responseData = await invoke.makeHttpCall("post", "/api/auth", jsonData);
            if (responseData && responseData.data) {
              res.status(200).send(responseData.data);
            } else {
              res.status(200).send("Data not found");
            }
          } catch (error) {
            if (error && error.message) {
              res.status(401).send({ error: "Error: Unauthorized" });
            } else {
              res.status(401).send({ error: "Error: Unauthorized" });
            }
          }
        }),
        w.post("/qrcode", async function (req, res, E) {
          try {
            var jsonData = {
              authorization: req.headers.authorization,
              body: req.body
            }
            let responseData = await invoke.makeHttpCall("post", "/api/auth/qrcode", jsonData);
            if (responseData && responseData.data) {
              res.status(200).send(responseData.data);
            } else {
              res.status(200).send("Data not found");
            }
          } catch {
            if (error && error.message) {
              res.status(401).send({ error: "Error: Unauthorized" });
            } else {
              res.status(401).send({ error: "Error: Unauthorized" });
            }
          }
        }),
        w.get("/token", async (req, res, E) => {
          try {
            if (req.query && req.query.id) {
              let responseData = await invoke.makeHttpCall("get", "/api/auth/token?id=" + req.query.id + "");
              if (responseData && responseData.data) {
                res.status(200).send(responseData.data);
              } else {
                res.send("response not found")
              }
            }
          } catch (error) {
            if (error && error.message) {
              res.status(400).send(error);
            } else {
              res.status(400).send(error);
            }
          }
        }),
        w.post('/jwt', async (req, res) => {
          try {
            if (req && req.headers && req.headers.authorization) {
              const bowserDetails = req.get("user-agent");
              var jsonData = {
                authorization: req.headers,
                bowserDetails: bowserDetails
              }
              // console.log("requestBody====>>>   ",req.headers.authorization)
              let responseData = await invoke.makeHttpCallsync("post", '/api/auth/jwt', jsonData);
              if (responseData && responseData.data) {
                // console.log("ResponseToken====>>>   ",{body:req.headers.authorization,response:responseData.data})
                res.status(200).send(responseData.data);
              } else {
                res.send({ success: false, message: "response not found" })
              }
            } else {
              res.send("response not found")
            }
          } catch (error) {
            if (error && error.message) {
              res.status(400).send(error);
            } else {
              res.status(400).send(error);
            }
          }
        }),
        (A.exports = w);
    },
    3321: (A, B, E) => {
      const w = express.Router(),
        Q = E(4676),
        C = "blank";
      w.get("/", async (req, res, E) => {
        try {
          if (req.query.limit && req.query.filter) {
            let responseData = await invoke.makeHttpCall("get", "/api/blank?limit=" + req.query.limit + "&filter=" + req.query.filter + "");
            if (responseData && responseData.data) {
              res.status(200).send(responseData.data);
            } else {
              res.send("response not found")
            }
          } else if (req.query.limit) {
            let responseData = await invoke.makeHttpCall("get", "/api/blank?limit=" + req.query.limit + "");
            if (responseData && responseData.data) {
              res.status(200).send(responseData.data);
            } else {
              res.send("response not found")
            }
          }
        } catch (error) {
          if (error && error.message) {
            res.status(400).send(error);
          } else {
            res.status(400).send(error);
          }
        }
      }),
        w.get("/:id", Q.isAuth(["administrator"]), function (A, B, E) {
          const w = { model: C, filter: { id: A.params.id } };
          s.read(w, function (A, w) {
            if (A) return E(A);
            B.json(w);
          });
        }),
        w.post("/", Q.isAuth(["administrator"]), function (A, B, E) {
          const w = { model: C, data: A.body };
          s.create(w, function (A, w) {
            if (A) return E(A);
            B.json(w);
          });
        }),
        w.put("/:id", Q.isAuth(["administrator"]), function (A, B, E) {
          const w = { model: C, filter: { id: A.params.id }, upsert: A.query.upsert, data: A.body };
          s.update(w, function (A, w) {
            if (A) return E(A);
            B.json(w);
          });
        }),
        w.delete("/:id", Q.isAuth(["administrator"]), function (A, B, E) {
          const w = { model: C, filter: { id: A.params.id } };
          s.delete(w, function (A, w) {
            if (A) return E(A);
            B.json(w);
          });
        }),
        (A.exports = w);
    },
    8120: (A, B, E) => {
      const w = express.Router(),
        Q = E(4676),
        g = E(8993),
        I = "chat";
      w.get("/:roomId", async (req, res, E) => {
        try {
          if (req.params.roomId && req.query.limit && req.query.skip && req.query.filter && req.query.filter.type) {
            let responseData = await invoke.makeHttpCall("get", "/api/chat/" + req.params.roomId + "?limit=" + req.query.limit + "&skip=" + req.query.skip + "&filter[type]=" + req.query.filter.type +"");
            if (responseData && responseData.data) {
              res.status(200).send(responseData.data);
            } else {
              res.send("response not found")
            }
          } else if (req.params.roomId && req.query.limit && req.query.filter && req.query.filter.type) {
            let responseData = await invoke.makeHttpCall("get", "/api/chat/" + req.params.roomId + "?limit=" + req.query.limit + "&filter[type]=" + req.query.filter.type + "");
            if (responseData && responseData.data) {
              res.status(200).send(responseData.data);
            } else {
              res.send("response not found")
            }
          } else if (req.query && req.query.filter && req.query.filter.type) {
            let responseData = await invoke.makeHttpCall("get", "/api/chat/" + req.params.roomId + "?filter[type]=" + req.query.filter.type + "");
            if (responseData && responseData.data) {
              res.status(200).send(responseData.data);
            } else {
              res.send("response not found")
            }
          } else if (req.query && req.query.sort && req.query.sort.id) {
            let responseData = await invoke.makeHttpCall("get", "/api/chat/" + req.params.roomId + "?sort[id]=" + req.query.sort.id+"");
            if (responseData && responseData.data) {
              res.status(200).send(responseData.data);
            } else {
              res.send("response not found")
            }
          }
          else {
            res.send("response not found")
          }
        } catch (error) {
          if (error && error.message) {
            res.status(400).send(error);
          } else {
            res.status(400).send(error);
          }
        }
      }),
        w.get("/screen/:roomId/", async (req, res, E) => {
          try {
            let jsonData;
            if(req && req.headers && req.headers.authorization){
              jsonData = {
                authorization: req.headers.authorization
              }
            }
            let responseData = await invoke.makeHttpCallUser_service("post", "/api/chat/screen/" + req.params.roomId, jsonData);
            if (responseData && responseData.data) {
              res.status(200).send(responseData.data);
            } else {
              res.send({ success: false, message: "response not found" })
            }
          } catch (error) {
            if (error && error.message) {
              res.status(400).send(error);
            } else {
              res.status(400).send(error);
            }
          }
        }),
        w.get("/:room/:id", Q.isAuth, function (A, B, E) {
          const w = {
            model: I,
            filter: { id: A.params.id, room: A.params.room },
            populate: [
              { path: "user", select: "nickname role" },
              { path: "attach", select: "filename length mimetype" },
            ],
            single: !0,
          };
          s.read(w, function (A, w) {
            if (A) return E(A);
            B.json(w);
          });
        }),
        w.post("/reportlog", async (req, res, E) => {
          let responseData = await invoke.makeHttpCall("get", "/api/verifymobile/" + req.headers.authorization)
          let reportbody = {
            peak: req.body.peak,
            time: new Date(),
            room: responseData.data.id,
            authorization: req.headers.authorization
            // student:responseData.data.student
          }
          let report = await invoke.makeHttpCallUser_service("post", "/api/reportlog", reportbody);
          if (report && report.data){
            res.json({ success: true, message: 'Log inserted successfully' });
          } else {
            res.json({ success: false, message: 'Log inserted not successfully' });
          }
        }),
        w.post("/:roomId",upload.array('upload',16), async (req, res, E) => {
          try {
            if (req.body) {
              if(req.body.type == "event"){
                req.body.createdAtEvent = new Date();
              }
              if(req.files){
                req.body.metadata = JSON.parse(req.body.metadata);
                if(req.body.metadata && req.body.metadata.peak && (req.body.metadata.peak !="c3")){
                  req.body.metadata.metrics.c3 = 0;
                }
                let filenames = []
                for (const iterator of req.files) {
                  filenames.push(iterator.originalname)
                }
                req.body.filename = filenames
              }
              req.body.authorization = req.headers.authorization
              // if(req.body.type == "event"){
              //   console.log("chatBody=====>>>",JSON.stringify(req.body))
              // }
              let responseData = await invoke.makeHttpCall("post", "/api/chat/" + req.params.roomId, req.body);
              if (responseData && responseData.data) {
                // if(req.body.type == "event"){
                //   console.log("chatResponse=====>>>",new Date()+"     "+JSON.stringify(responseData.data))
                // }
                res.status(200).send(responseData.data);
                switch (responseData.data.type) {
                  case "message":
                    if (responseData.data.room == "sendToAll") {
                      responseData.data.tenantId = req.query.tenantId
                      let response = invoke.makeHttpCall("post", '/api/broadcast/sendToAll', responseData.data);
                    }
                    console.log('room id=',responseData.data.room)
                    console.log('room details=',responseData.data)
                    g.send(String(responseData.data.room), "chat:message", responseData.data);
                    let msgreport = {
                      message: responseData.data.message,
                      messagetime: responseData.data.createdAt,
                      room: responseData.data.room,
                      student: responseData.data.user.id,
                      role: responseData.data.user.role,
                      authorization: req.headers.authorization
                    }
                    let messagereport = await invoke.makeHttpCallUser_service("post", "/api/reportlog", msgreport)
                    break;
                  case "face":
                    g.send(String(responseData.data.room), "chat:face", responseData.data);
                    break;
                  case "event":
                    g.send(String(responseData.data.room), "chat:event", responseData.data);
                    if(req.files.length>0){
                      for (const iterator of req.files) {
                        minioClient.putObject("storage", iterator.originalname, iterator.buffer, iterator.size, async function (err3, etag) {
                          if (err3) {
                            return res.status(500).send(err3);
                          } else if (etag) {
                            // console.log("eventTag====>>>",req.params.roomId+"     "+JSON.stringify(etag))
                            // res.status(200).send(responseData.data);
                          }
                        })
                      }
                    }
                    if(responseData.data.violation.length >0){
                      for (const iterator of responseData.data.violation) {
                        let reportbody = {
                          peak: iterator.peak,
                          time: iterator.createdAt,
                          room: responseData.data.room,
                          student: responseData.data.user.id,
                          authorization: req.headers.authorization
                        }
                        let report = await invoke.makeHttpCallUser_service("post", "/api/reportlog", reportbody);
                      }
                    }
                    break;
                }
              } else {
                res.send("response not found")
              }
            }
          } catch (error) {
            if (error && error.message) {
              res.status(400).send(error);
            } else {
              res.status(400).send(error);
            }
          }
        }),
        w.put("/:roomId/:chatId", async (req, res, E) => {
          try {
            var jsonData = {
              authorization: req.headers.authorization,
              body: req.body
            }
            let responseData = await invoke.makeHttpCall("post", '/api/chat/' + req.params.roomId + '/' + req.params.chatId, jsonData);
            if (responseData && responseData.data) {
              res.status(200).send(responseData.data);
            } else {
              res.send({ success: false, message: "response not found" })
            }
          } catch (error) {
            if (error && error.message) {
              res.status(400).send(error);
            } else {
              res.status(400).send(error);
            }
          }
        }),
        w.delete("/:room/:id", Q.isAuth(["proctor", "administrator"]), function (A, B, E) {
          const w = { model: I, filter: { id: A.params.id, room: A.params.room, user: A.user.id } };
          "administrator" === A.user.role && delete w.filter.user,
            s.delete(w, function (A, w) {
              if (A) return E(A);
              B.json(w);
            });
        }),
        (A.exports = w);
    },
    5898: (A, B, E) => {
      const w = express,
        Q = nconf,
        s = w.Router(),
        C = jsonwebtoken,
        { v4: g } = uuid;
      // I = E(2466);
      s.get("/", async (req, res, E) => {
        try {
          let responseData = await invoke.makeHttpCall("get", '/api/check');
          if (responseData && responseData.data) {
            res.redirect(`/?redirect=${encodeURIComponent("/check")}&token=${responseData.data}`);;
          } else {
            res.send({ success: false, message: "response not found" })
          }
        } catch (error) {
          if (error && error.message) {
            res.status(400).send(error);
          } else {
            res.status(400).send(error);
          }
        }
      });
      (A.exports = s);
    },
    2779: (A, B, E) => {
      const w = express,
        Q = nconf,
        s = w.Router(),
        C = E(4676),
        // g = E(2466),
        I = "config";
      // console.log(I);
      s.get("/sdk", function (A, B) {
        B.json(Q.get("sdk") || {});
      }),
        s.get("/", C.isAuth(["administrator"]), function (A, B, E) {
          const w = {
            model: I,
            filter: g.parse(A.query.filter) || {},
            skip: A.query.start,
            limit: A.query.count || A.query.limit,
            count: !A.query.continue || "0" === A.query.start,
            sort: A.query.sort || { _id: 1 },
            single: !1,
          };
          if ("string" == typeof w.filter) {
            const A = new RegExp(w.filter, "i");
            w.filter = { $or: [{ _id: A }, { value: A }] };
          } else "object" != typeof w.filter && (w.filter = {});
          "administrator" !== A.user.role && (w.filter.id = new RegExp("^sdk.")),
            g.read(w, function (A, Q) {
              if (A) return E(A);
              B.json({ data: Array.isArray(Q) ? Q : Q.data, pos: parseInt(w.skip || 0), total_count: Q.total });
            });
        }),
        s.get("/:id", C.isAuth(["administrator"]), function (A, B, E) {
          const w = { model: I, filter: { id: A.params.id } };
          g.read(w, function (A, w) {
            if (A) return E(A);
            B.json(w);
          });
        }),
        s.post("/", C.isAuth(["administrator"]), function (A, B, E) {
          const w = { model: I, data: A.body };
          g.create(w, function (A, w) {
            if (A) return E(A);
            B.json(w);
          });
        }),
        s.put("/:id", C.isAuth(["administrator"]), function (A, B, E) {
          const w = { model: I, filter: { id: A.params.id }, upsert: A.query.upsert, data: A.body };
          g.update(w, function (A, w) {
            if (A) return E(A);
            B.json(w);
          });
        }),
        s.delete("/:id", C.isAuth(["administrator"]), function (A, B, E) {
          const w = { model: I, filter: { id: A.params.id } };
          g.delete(w, function (A, w) {
            if (A) return E(A);
            B.json(w);
          });
        }),
        (A.exports = s);
    },
    8813: (A, B, E) => {
      const w = express.Router(),
        Q = fs,
        s = os,
        C = pathVar,
        g = readline,
        I = multer,
        D = nconf,
        // Y = E(2466),
        F = E(4676),
        M = I({
          dest: s.tmpdir(),
          limits: { fileSize: 1024 * D.get("upload:limit") * 1024, files: 1 },
          onFileSizeLimit: function (A) {
            Q.unlink(C.resolve(A.path)), (A.failed = !0);
          },
        }).single("upload");
      function R(A, B) {
        const E = "string" == typeof B ? B.split(".") : B;
        let w = E.reduce(function (A, B, w) {
          if (Array.isArray(A)) {
            const B = E.splice(w);
            return A.map(function (A) {
              return "object" != typeof A ? A : R(A, B.slice());
            }).join(", ");
          }
          return (A || {})[B];
        }, A);
        return w && "function" == typeof w.toJSON && (w = w.toJSON()), w;
      }
      w.get("/:model", async (req, res, E) => {
        try {
          let jsonData = {
            query: req.query,
            authorization: req.headers.authorization
          }
          let responseData = await invoke.makeHttpCallsync("put", '/api/csv/' + req.params.model + '', jsonData);
          if (responseData && responseData.data) {
            let s = new Date().toJSON().substring(0, 19).replace(/:/g, "-").replace("T", "_");
            res.header("Content-Disposition", `attachment; filename="${req.params.model}_${s}.csv"`);
            if(req.query.UI && req.query.UI == "newui"){
              res.status(200).send(responseData.data.message);
            }
            res.status(200).send(responseData.data.message.join("\n"));
          } else {
            res.send({ success: false, message: "response not found" })
          }
        } catch (error) {
          if (error && error.message) {
            res.status(400).send(error);
          } else {
            res.status(400).send(error);
          }
        }
      }),
        w.post("/:model", async (req, res, E) => {
          try {
            const form = new formidable.IncomingForm();
            form.parse(req, async function (err, fields, files) {
              const myfile = files.upload;
              let D = readline.createInterface({ input: fs.createReadStream(myfile.filepath), crlfDelay: 1 / 0 });
              let data = await getData(D)
              let jsonData = {
                model: req.params.model,
                data: data.message,
                upsert: !0,
                authorization: req.headers.authorization
              }
              let responseData = await invoke.makeHttpCallsync("post", '/api/csv/' + req.params.model + '', jsonData);
              if (responseData && responseData.data) {
                res.status(200).send(responseData.data);
              } else {
                res.send({ success: false, message: "response not found" })
              }
            })
          } catch (error) {
            if (error && error.message) {
              res.status(400).send(error);
            } else {
              res.status(400).send(error);
            }
          }
        }),
        (A.exports = w);

    },
    3310: (A, B, E) => {
      const w = express.Router();
      w.use("/archive", E(8397)),
        w.use("/auth", E(4676)),
        w.use("/blank", E(3321)),
        w.use("/chat", E(8120)),
        w.use("/check", E(5898)),
        w.use("/config", E(2779)),
        w.use("/csv", E(8813)),
        w.use("/jobs", E(4917)),
        w.use("/report", E(5942)),
        w.use("/rest", E(5931)),
        w.use("/room", E(6855)),
        w.use("/stat", E(256)),
        w.use("/media", E(2566)),
        w.use("/status", E(285)),
        w.use("/storage", E(4067)),
        w.use("/suggest", E(5121)),
        w.use("/user", E(9327)),
        w.use("/generateProctorToken", E(9328)),
        w.use("/state", E(9000)),
        (A.exports = w);
    },
    4917: (A, B, E) => {
      const w = express.Router(),
        Q = mongoose,
        s = E(4676);
      // C = E(4769);
      w.get("/", s.isAuth(["administrator"]), function (A, B, E) {
        C.jobs({})
          .then(function (A) {
            B.json(
              A.map(function (A) {
                let B = A.attrs;
                return (B.id = B._id), delete B._id, B;
              })
            );
          })
          .catch(E);
      }),
        w.put("/:job", s.isAuth(["administrator"]), function (A, B, E) {
          let w = Q.Types.ObjectId(A.params.job);
          C.jobs(w)
            .then(function (A) {
              if (!A.length) return E();
              const w = A[0];
              (w.attrs.nextRunAt = new Date(Date.now() + 1e4)), (w.attrs.lastFinishedAt = null), (w.attrs.lastRunAt = null), (w.attrs.lockedAt = null), w.save(), B.json(w.attrs);
            })
            .catch(E);
        }),
        (A.exports = w);
    },
    5942: (A, B, E) => {
      const w = express,
        Q = nconf,
        s = w.Router(),
        C = jsonwebtoken,
        { v4: g } = uuid;
      s.get("/:room", function (A, B, E) {
        I.read({ model: "room", filter: { id: A.params.room, student: { $ne: null } }, select: { stoppedAt: 1, addons: 1, pdf: 1 } }, function (w, s) {
          if (w) return E(w);
          if (!s) return B.status(404), E(new Error("Not found"));
          let I = (A.user || {}).token || "";
          const D = (s && s.addons) || [];
          if ((!I && D.indexOf("shared") > -1 && (I = C.sign({ id: g(), nickname: "Proctor", role: "proctor" }, Q.get("session:key"))), "pdf" === A.query.format)) {
            const E = ["token=" + I];
            A.query.download && E.push("download=1"), B.redirect(`/api/storage/${s.pdf}?${E.join("&")}`);
          } else {
            const E = s.stoppedAt ? "/report?id=" + A.params.room : "/vision?id=" + A.params.room;
            B.redirect(`/?redirect=${encodeURIComponent(E)}&token=${I}`);
          }
        });
      }),
        (A.exports = s);
    },
    5931: (A, B, E) => {
      const w = express.Router(),
        Q = nconf,
        s = cors;
      function D(A, B) {
        const E = A.split("/"),
          w = B.split("/"),
          Q = {};
        for (let A = 0; A < w.length; A++)
          if (/^:/.test(E[A])) {
            Q[E[A].slice(1)] = w[A];
          }
        return Q;
      }
      w.all(
        "/:provider/*",
        function (A, B, E) {
          const w = Q.get("rest:" + A.params.provider);
          if (!w) return B.status(404).end();
          for (const E in w.headers) if (A.headers[E] !== w.headers[E]) return B.status(403).end();
          s(w.cors)(A, B, E);
        },
        function (A, B, E) {
          const w = Q.get("rest:" + A.params.provider);
          if (!w) return B.status(404).end();
          for (const Q in w.api) {
            const s = w.api[Q],
              Y = "/" + A.params.provider + s.path;
            if (!new RegExp(Y.replace(/:[^/:]+/g, "[^/:]+")).test(A.path)) continue;
            const F = D(Y, A.path);
            switch (s.method) {
              case "GET":
                if ("storage" === Q)
                  I.findById(F.id, function (w, Q) {
                    return w
                      ? E(w)
                      : Q
                        ? (A.query.download && B.header("Content-Disposition", 'attachment; filename="' + Q.filename + '"'),
                          void Q.getFile(function (A, w) {
                            if (A) return E(A);
                            w.pipe(B);
                          }))
                        : B.status(404).end();
                  });
                else {
                  const w = {
                    model: Q,
                    filter: (!0 === s.filter ? A.query.filter : s.filter) || {},
                    skip: !0 === s.skip ? A.query.skip : s.skip,
                    limit: !0 === s.limit ? A.query.limit : s.limit,
                    sort: !0 === s.sort ? A.query.sort : s.sort,
                    select: !0 === s.select ? A.query.select : s.select,
                    populate: !0 === s.populate ? A.query.populate : s.populate,
                    count: !0 === s.count ? A.query.count : s.count,
                    single: !0 === s.single ? A.query.single : s.single,
                    search: !0 === s.search ? A.query.search : s.search,
                  };
                  for (const A in F) w.filter[A] = F[A];
                  g.read(w, function (A, Q) {
                    if (A) return E(A);
                    if ((Q || (Q = {}), !w.count && !Array.isArray(Q))) return B.json(C(s.response, Q) || Q);
                    const g = w.count ? Q.data : Q;
                    for (let A = 0; A < g.length; A++) g[A] = C(s.response, g[A]) || g[A];
                    B.json(Q);
                  });
                }
                break;
              case "POST": {
                const w = { model: Q, data: C(s.request, A.body) || A.body };
                g.create(w, function (A, w) {
                  if (A) return E(A);
                  B.json(C(s.response, w) || w);
                });
                break;
              }
              case "PUT": {
                const w = { model: Q, filter: {}, data: C(s.request, A.body) || A.body };
                for (const A in F) w.filter[A] = F[A];
                g.update(w, function (A, w) {
                  if (A) return E(A);
                  B.json(C(s.response, w) || w);
                });
                break;
              }
              case "DELETE": {
                const A = { model: Q, filter: {} };
                for (const B in F) A.filter[B] = F[B];
                g.delete(A, function (A, w) {
                  if (A) return E(A);
                  B.json(C(s.response, w) || w);
                });
                break;
              }
              default:
                B.status(404).end();
            }
            break;
          }
        }
      ),
        (A.exports = w);
    },
    6855: (A, B, E) => {
      const w = express,
        Q = nconf,
        s = w.Router(),
        C = E(4676),
        I = E(8993);
      s.get("/fetch", async (req, res, E) => {
        try {
          var jsonData = {
            authorization: req.headers.authorization
          }
          // console.log(JSON.parse(jsonData),'fetch api auth')
          let responseData = await invoke.makeHttpCall("post", "/api/room/fetch", jsonData);
          if (responseData && responseData.data) {
            res.status(200).send(responseData.data);
          } else {
            res.send("response not found")
          }
        } catch (error) {
          if (error && error.message) {
            res.status(400).send(error);
          } else {
            res.status(400).send(error);
          }
        }
      }),
        s.post("/start", async (req, res, E) => {
          try {
            /**
             * const c = { user: A.user.id, room: A.query.id, ipaddress: A.ip, useragent: A.get("user-agent"), seb: A.headers["X-SafeExamBrowser-ConfigKeyHash"] && A.headers["X-SafeExamBrowser-RequestHash"] };
                        Y.start(c, function (w, Q) {
                            if (w) return E(w);
                            g.start({ user: A.user, room: Q }, function () {
                                B.json(Q);
                                const A = Q.getMemberIDs();
                                A.length && I.send(A, "room:start", Q);
                            });
                        });
             */
            var jsonData = {
              authorization: req.headers.authorization,
              // ipAddress: req.body.ipaddress
            }
            let responseData = await invoke.makeHttpCall("post", "/api/room/start?id=" + req.query.id+"&status="+req.query.status, jsonData);
            if (responseData && responseData.data) {
              res.status(200).send(responseData.data);
              let memberId=[]
              memberId=responseData.data.members
              let A=memberId.push(responseData.data.student)
              memberId.length && I.send(memberId, "room:start", responseData.data);
              let reportbody = {
                starttime: responseData.data.startedAt,
                room: responseData.data.id,
                student: responseData.data.student,
                authorization: req.headers.authorization
              }
              let report = await invoke.makeHttpCallUser_service("post", "/api/reportlog", reportbody)
            } else {
              res.send({ success: false, message: "response not found" })
            }
          } catch (error) {
            if (error && error.message) {
              res.status(400).send(error);
            } else {
              res.status(400).send(error);
            }
          }
        }),
        s.post("/approvecandidate", async (req, res, E) => {
          try {
            var jsonData = {
              authorization: req.headers.authorization,
              "roomid":req.body.roomId,
              "status":req.body.status,
              "verified":req.body.verified,
              "rejectLog":req.body.rejectLog
            }
            let responseData = await invoke.makeHttpCall("post", "approvecandidate" , jsonData);
            console.log(responseData.data,'response .................')
            if (responseData && responseData.data) {
              if(responseData&&responseData.data.success){
                let memberId=[]
                memberId=responseData.data.data.members
                console.log(memberId,'member id ')
                let A=memberId.push(responseData.data.data.student)
                console.log(A,'mermber id after')
                memberId.length && I.send(memberId, "approval", responseData.data.data);
              
                res.status(200).send({success:true,message: responseData.data.data});
              }else{
                res.status(200).send({success:false,message:'Candidate approved failed.'});
              }
            } else {
              res.send({ success: false, message: "response not found" })
            }
          } catch (error) {
            console.log(error)
            if (error && error.message) {
              res.status(400).send(error);
            } else {
              res.status(400).send(error);
            }
          }
        }),
        s.post("/fetchuserwithroom", async (req, res, E) => {
          try {
            var jsonData = {
              authorization: req.headers.authorization,
              "roomid":req.body.roomId
            }
            let responseData = await invoke.makeHttpCall("post", "fetchuserwithroom" , jsonData);
            if (responseData && responseData.data) {
              res.status(200).send(responseData.data);
            } else {
              res.send({ success: false, message: "response not found" })
            }
          } catch (error) {
            if (error && error.message) {
              res.status(400).send(error);
            } else {
              res.status(400).send(error);
            }
          }
        }),
        s.post("/stop", async (req, res, E) => {
          try {
            let responseData = await invoke.makeHttpCall("post", '/api/stop/' + req.query.id, req.headers);
            if (responseData && responseData.data) {
              res.status(200).send(responseData.data);
              let memberId=[]
              memberId=responseData.data.members
              console.log(memberId,'member id')
              let A=memberId.push(responseData.data.student)
              console.log(memberId,'member id after push')
              memberId.length && I.send(memberId, "room:stop", responseData.data);
            } else {
              res.send("response not found")
            }
          } catch (error) {
            if (error && error.message) {
              res.status(400).send(error);
            } else {
              res.status(400).send(error);
            }
          }
        }),
        s.post("/submit", async (req, res, E) => {
          try {
            if (req.body) {
              req.body.authorization = req.headers.authorization;
              let responseData = await invoke.makeHttpCall("post", '/api/room/submit?id=' + req.query.id, req.body);
              if (responseData && responseData.data) {
                res.status(200).send(responseData.data);
                // let memberId=[]
                // memberId=responseData.data.members
                // console.log(memberId,'member id ')
                // let A=memberId.push(responseData.data.student)
                // console.log(A,'member id after',responseData.data)
                // memberId.length && I.send(memberId, "room:stop", responseData.data);
                // let reportbody = {
                //   submittime: responseData.data.stoppedAt,
                //   room: responseData.data.id,
                //   student: responseData.data.student.id,
                //   status: responseData.data.status,
                //   comment: responseData.data.comment,
                //   authorization: req.headers.authorization
                // }
                // console.log("==========>>>>>>>>",responseData.data.status)
                if(responseData.data.status == "stopped"){
                  let payload={
                    Delivery_Id:responseData?.data?.rdfRef.concat(responseData?.data?.deliveryId),
                    email:responseData?.data?.student?.nickname
                  }
                  console.log(JSON.stringify(payload),'payload for report engine')
                  let taoTerminateTest = await invoke.makeHttpTao_service("post", "userBatchCloserapi", payload)
                  console.log(taoTerminateTest.data,'stop api call to report engine')
                }
                // console.log(payload,'payload...............')
                let report = await invoke.makeHttpCallUser_service("post", "/api/reportlog", reportbody)
                
                
              } else {
                res.send({ success: false, message: "response not found" })
              }
            } else {
              res.send("response not found")
            }
          } catch (error) {
            if (error && error.message) {
              res.status(400).send(error);
            } else {
              res.status(400).send(error);
            }
          }
        }),
        s.post("/next", async (req, res, E) => {
          try {
            if (req && req.headers && req.headers.authorization) {
              if(req.body&&req.body.approve){
                req.body.approvalRequest=false
              }
              var jsonData = {
                authorization: req.headers.authorization,
                body:req.body
              }
              let responseData = await invoke.makeHttpCall("post", '/api/room/next?id=' + req.query.id + '', jsonData);
              if (responseData && responseData.data) {
                if(req && req.body && req.body.approve == true){
                  responseData.data.approve = req.body.approve
                  I.send(responseData.data.members, "approvalAccess", responseData.data)
                }
                res.status(200).send(responseData.data);
              } else {
                res.send({ success: false, message: "response not found" })
              }
            } else {
              res.send("response not found")
            }
          } catch (error) {
            if (error && error.message) {
              res.status(400).send(error);
            } else {
              res.status(400).send(error);
            }
          }
        }),
        s.get("/", async (req, res, E) => {
          try {
            var jsonData = {
              authorization: req.headers.authorization
            }
            if (req.query.limit && req.query.filter && req.query.start && req.query.count && req.query.continue && req.query.sort) {
              let responseData = await schedule.roomSearch(req);
              if (responseData && responseData.data) {
                res.status(200).send(responseData.data);
              } else {
                res.send("response not found")
              }
            } else if (req.query.limit && req.query.filter && req.query.start && req.query.count && req.query.continue) {
              let responseData = await invoke.makeHttpCall("post", "/api/room?limit=" + req.query.limit + "&filter=" + req.query.filter + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "", jsonData);
              if (responseData && responseData.data) {
                res.status(200).send(responseData.data);
              } else {
                res.send("response not found")
              }
            } else if (req.query.limit && req.query.filter) {
              let responseData = await invoke.makeHttpCall("post", "/api/room?limit=" + req.query.limit + "&filter=" + req.query.filter + "", jsonData);
              if (responseData && responseData.data) {
                res.status(200).send(responseData.data);
              } else {
                res.send("response not found")
              }
            } else if (req.query.limit && req.query.start && req.query.count && req.query.continue && req.query.sort) {
              let responseData = await schedule.roomData(req);
              if (responseData && responseData.data) {
                res.status(200).send(responseData.data);
              } else {
                res.send("response not found")
              }
            } else if (req.query.limit && req.query.start && req.query.count && req.query.continue) {
              let responseData = await invoke.makeHttpCall("post", "/api/room?limit=" + req.query.limit + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue + "", jsonData);
              if (responseData && responseData.data) {
                res.status(200).send(responseData.data);
              } else {
                res.send("response not found")
              }
            } else if (req.query.limit) {
              let responseData = await invoke.makeHttpCall("post", "/api/room?limit=" + req.query.limit, jsonData);
              if (responseData && responseData.data) {
                res.status(200).send(responseData.data);
              } else {
                res.send("response not found")
              }
            }
          } catch (error) {
            if (error && error.message) {
              res.status(400).send(error);
            } else {
              res.status(400).send(error);
            }
          }
        }),
        s.post("/stream",async(req,res,E)=>{
          try {
            var jsonData = {
              authorization: req.headers.authorization,
              rooms:req.body.rooms
            }
            let responseData = await invoke.makeHttpCall("post", "/api/stream",jsonData);
            if (responseData && responseData.data) {
              res.status(200).send(responseData.data);
            } else {
              res.send("response not found")
            }
          } catch (error) {
            if (error && error.message) {
              res.status(400).send(error);
            } else {
              res.status(400).send(error);
            }
          }
        })
        s.get("/:userId", async (req, res, E) => {
          try {
            let jsonData;
            if(req && req.headers && req.headers.authorization){
              jsonData = {
                authorization: req.headers.authorization
              }
            }
            if (req.params.userId && req.query.populate && req.query.populate[0] && req.query.populate[1]) {
              let responseData = await invoke.makeHttpCall("patch", "/api/room/" + req.params.userId + "?populate=" + req.query.populate[0] + "&populate=" + req.query.populate[1] +"",jsonData);
              if (responseData && responseData.data) {
                res.status(200).send(responseData.data);
              } else {
                res.send("response not found")
              }
            } else if (req.params.userId) {
              let responseData = await invoke.makeHttpCall("patch", "/api/room/" + req.params.userId + "",jsonData);
              if (responseData && responseData.data) {
                res.status(200).send(responseData.data);
              } else {
                res.send("response not found")
              }
            }
          } catch (error) {
            if (error && error.message) {
              res.status(400).send(error);
            } else {
              res.status(400).send(error);
            }
          }
        }),
        s.post("/", async (req, res, E) => {
          try {
            if (req.body) {
              req.body.authorization = req.headers.authorization;
              let responseData = await invoke.makeHttpCall("post", '/api/room', req.body);
              if (responseData && responseData.data) {
                res.status(200).send(responseData.data);
              } else {
                res.send({ success: false, message: "response not found" })
              }
            } else {
              res.send("response not found")
            }
          } catch (error) {
            if (error && error.message) {
              res.status(400).send(error);
            } else {
              res.status(400).send(error);
            }
          }
        }),
        s.put("/:userId", async (req, res, E) => {
          try {
            if (req && req.body) {
              req.body.authorization = req.headers.authorization;
              let responseData = await invoke.makeHttpCall("put", "/api/room/" + req.params.userId + "", req.body);
              if (responseData && responseData.data) {
                res.status(200).send(responseData.data);
              } else {
                res.send("response not found")
              }
            }
          } catch (error) {
            if (error && error.message) {
              res.status(400).send(error);
            } else {
              res.status(400).send(error);
            }
          }
        }),
        s.put("/timeoutupdate/:roomId", async (req, res, E) => {
          try {
            if (req && req.body) {
              let responseData = await invoke.makeHttpCall("put", "/api/room/timeoutupdate/" + req.params.roomId + "", req.body);
              if (responseData && responseData.data) {
                res.status(200).send(responseData.data);
              } else {
                res.send("response not found")
              }
            }
          } catch (error) {
            if (error && error.message) {
              res.status(400).send(error);
            } else {
              res.status(400).send(error);
            }
          }
        }),
        s.delete("/:UserId", async (req, res, E) => {
          try {
            if (req.params.UserId) {
              let responseData = await invoke.makeHttpCall("delete", "/api/room/" + req.params.UserId+"?authorization="+req.headers.authorization+"");
              if (responseData && responseData.data) {
                res.status(200).send(responseData.data);
              } else {
                res.send({ success: false, message: "response not found" })
              }
            } else {
              res.send("response not found")
            }
          } catch (error) {
            if (error && error.message) {
              res.status(400).send(error);
            } else {
              res.status(400).send(error);
            }
          }
        }),
        s.get("/notification/:userId", async (req, res, E) => {
          try {
            if (req.params.userId) {
              let JsonData = {
                authorization:req.headers.authorization
              }
              let responseData = await invoke.makeHttpCall("post", "/api/room/notification/" + req.params.userId,JsonData);
              if (responseData && responseData.data) {
                res.status(200).send(responseData.data);
              } else {
                res.send("response not found")
              }
            }
          } catch (error) {
            if (error && error.message) {
              res.status(400).send(error);
            } else {
              res.status(400).send(error);
            }
          }
        }),
        s.patch("/notification", async (req, res, E) => {
          try {
            if (req.body) {
              req.body.authorization = req.headers.authorization;
              let responseData = await invoke.makeHttpCall("patch", "/api/room/notification/unread",req.body);
              if (responseData && responseData.data) {
                res.status(200).send(responseData.data);
              } else {
                res.send("response not found")
              }
            }
          } catch (error) {
            if (error && error.message) {
              res.status(400).send(error);
            } else {
              res.status(400).send(error);
            }
          }
        }),
        (A.exports = s);
    },
    256: (A, B, E) => {
      const w = express.Router(),
        Q = E(4676);
      w.get("/", async (req, res, E) => {
        try {
          if (req) {
            let responseData = await invoke.makeHttpCall("post", "/api/stat", req.query);
            if (responseData && responseData.data) {
              res.status(200).send(responseData.data);
            } else {
              res.send({ success: false, message: "response not found" })
            }
          } else {
            res.send("response not found")
          }
        } catch (error) {
          if (error && error.message) {
            res.status(400).send(error);
          } else {
            res.status(400).send(error);
          }
        }
      }),
        (A.exports = w);
    },
    2566: (A, B, E) => {
      const w = express.Router();
      w.get("/", async (req, res, E) => {
        try {
          if (req.query && req.query.limit && req.query.filter) {
            let responseData = await invoke.makeHttpCallai_service("get", "/api/media?limit=" + req.query.limit + "&filter=" + req.query.filter + "");
            if (responseData && responseData.data) {
              res.status(200).send(responseData.data.message);
            } else {
              res.send("response not found")
            }
          } else if (req.query && req.query.limit) {
            let responseData = await invoke.makeHttpCallai_service("get", "/api/media?limit=" + req.query.limit);
            if (responseData && responseData.data) {
              res.status(200).send(responseData.data.message);
            } else {
              res.send("response not found")
            }
          }
        } catch (error) {
          if (error && error.message) {
            res.status(400).send(error);
          } else {
            res.status(400).send(error);
          }
        }
      }),
        w.get("/:roomid", async (req, res, E) => {
          try {
            if (req.query && req.query.filter) {
              let responseData = await invoke.makeHttpCallai_service("get", "/api/media/" + req.params.roomid + "?filter=" + req.query.filter + "");
              if (responseData && responseData.data) {
                res.status(200).send(responseData.data.message);
              } else {
                res.send("response not found")
              }
            }
          } catch (error) {
            if (error && error.message) {
              res.status(400).send(error);
            } else {
              res.status(400).send(error);
            }
          }
        }),
        (A.exports = w);
    },
    285: (A, B, E) => {
      const w = express.Router(),
        Q = E(4676);
      w.get("/", Q.isAuth(["administrator"]), function (A, B, E) {
        const w = [{ stoppedAt: { $ne: null } }];
        A.query.from && w.push({ startedAt: { $gte: new Date(A.query.from) } }),
          A.query.to && w.push({ startedAt: { $lt: new Date(A.query.to) } });
      }),
        (A.exports = w);
    },
    4067: (A, B, E) => {
      const w = express.Router(),
        Q = multer,
        s = fs,
        C = os,
        g = pathVar,
        I = slugify,
        D = requestNew,
        Y = nconf,
        F = Q({
          dest: C.tmpdir(),
          limits: { fileSize: 1024 * Y.get("upload:limit") * 1024, files: 1 },
          onFileSizeLimit: function (A) {
            s.unlink(g.resolve(A.path)), (A.failed = !0);
          },
        }).single("upload"),
        M = E(386),
        R = E(4676),
        c = M(Y.get("recognizer:uri")) || {};
      w.post("/", async (req, res, E) => {
        try {
          const form = new formidable.IncomingForm();
          form.parse(req, async (err, fields, files) =>{
            const myfile = files.upload;
            var jsonData = {
              headers: req.headers.authorization,
              myfile: myfile
            }
            var metaData = {
              'Content-Type': 'application/octet-stream',
              'X-Amz-Meta-Testing': 1234,
              example: 5678,
            }
            let responseData = await invoke.makeHttpCall('post', '/api/storage', jsonData);
            if (responseData && responseData.data && responseData.data.id) {
              minioClient.fPutObject("storage", responseData.data.id, myfile.filepath, metaData, async  (err3, etag) =>{
                if (err3) {
                  return res.status(500).send(err3);
                } else if (etag) {
                  res.status(200).send(responseData.data);
                }
              })
            }
          })
        } catch (error) {
          if (error && error.message) {
            res.status(400).send(error);
          } else {
            res.status(400).send(error);
          }
        }
      }),
        w.post("/face", upload.single('upload'), async (req, res, E) => {
          try {
            if(!req.file.buffer){
              res.status(200).send("upload proper file")
            } else {
              let resized = await sharp(req.file.buffer).resize(200, 150).jpeg().toBuffer()
              let uploadImg = await uploadImgAndVerify(resized)
              if (uploadImg.success) {
                if (uploadImg.message == 'Unable to find a face') {
                  res.status(200).send(uploadImg.message)
                } else {
                  var jsonData = {
                    authorization: req.headers.authorization,
                    rep: uploadImg.message,
                    myfile: req.file
                  }
                  let responseData = await invoke.makeHttpCall('post', '/api/storage/face', jsonData)
                  if (responseData && responseData.data) {
                    let secondResponse = await invoke.makeHttpCall('post', '/api/storage/face1', responseData.data)
                    if (secondResponse && secondResponse.data && secondResponse.data.id) {
                      res.status(200).send(secondResponse.data);
                      minioClient.putObject("storage", secondResponse.data.id, req.file.buffer, req.file.size, async function (err3, etag) {
                        if (err3) {
                          return res.status(500).send(err3);
                        } else if (etag) {
                          // res.status(200).send(responseData.data);
                        }
                      })
                    } else {
                      res.send({ success: false, message: "response not found" });
                    }
                  } else {
                    res.send({ success: false, message: "response not found" });
                  }
                }
              }
            }
          } catch (error) {
            console.log(error)
            if (error && error.message) {
              res.status(400).send(error);
            } else {
              res.status(400).send(error);
            }
          }
        }),
        w.post("/facephoto", upload.single('upload'), async (req, res, E) => {
          try {
            if(!req.file.buffer){
              res.status(200).send("upload proper file")
            } else {
              var decodedValue;
              const header = req.headers.authorization.split(" ");
              const authorization = header[1];
              // var decodeToken = jwt_decode(authorization);
              if(authorization !== null || authorization !== undefined){
                const base64String = authorization.split('.')[1];
                decodedValue = JSON.parse(Buffer.from(base64String,    
                                     'base64').toString('ascii'));
               }
              // const containerName = 'training';
              // const folderName = decodedValue.id; // Folder name to create
              // const fileName = req.file.originalname+".png"
              let uploadImg = await uploadTrainedImg(req.file.buffer,req.file.originalname,decodedValue.id)
              if (uploadImg.success) {
                res.status(200).send({success:true,mesage:'uploaded','counter':uploadImg.message.counter});
                //train photo
                if(uploadImg&&uploadImg.message&&uploadImg.message.counter&&(uploadImg.message.counter==31)){
                  let uploadImg = await uploadTrainedApiCall(decodedValue.id)   
                }
              }else{
                res.status(200).send({success:false,mesage:'failed to upload'});
              }
              
              
            }
          } catch (error) {
            console.log(error)
            if (error && error.message) {
              res.status(400).send(error);
            } else {
              res.status(400).send(error);
            }
          }
        }),
        w.post('/verifymobile', upload.single('upload'), async (req, res) => {
          try {
            // var jsondata;
            // var data;
            // const form = new formidable.IncomingForm();
            // form.parse(req, async (err, fields, files) => {
            //   const myfile = files.upload;
            //   var fileStream = fs.createReadStream(myfile.filepath);
            //   var formData = {
            //     image: fileStream
            //   };
            if (!req.file.buffer) {
              res.status(200).send("upload proper file")
            } else {
              // let resized = await sharp(req.file.buffer).resize(5000, 5000).jpeg({ quality: 90 }).toBuffer()
              let uploadImg = await uploadImgAndVerifyObject(req.file.buffer)
              if (uploadImg.success) {
                // let uploadImage = uploadImg.message
                var find = _.find(uploadImg.message, { key: 'cell phone' })
                var findHeadphone = _.find(uploadImg.message, { key: 'Headphones' })
                if (find || findHeadphone) {
                  res.status(200).send({ success: true, message: 'Phone detected' })
                  let responseData = await invoke.makeHttpCall("get", "/api/verifymobile/" + req.headers.authorization);
                  if (responseData && responseData.data) {
                    for (const key in responseData.data.averages) {
                      if (Object.hasOwnProperty.call(responseData.data.averages, key)) {
                        const element = responseData.data.averages[key];
                        if ((key == 'm3') || (key == "h1")) {
                          if (key == 'h1') {
                            const h1Index = responseData.data.metrics.indexOf("h1");
                            const h1Weight = responseData.data.weights[h1Index];
                            responseData.data.averages.h1 = h1Weight
                            jsondata = {
                              "type": "event",
                              "metadata": {
                                "metrics": responseData.data.averages,
                                "peak": "h1",
                                "threshold": 0,
                                "violated": true
                              }
                            }
                          }
                          if (key == 'm3') {
                            const m3Index = responseData.data.metrics.indexOf("m3");
                            const m3Weight = responseData.data.weights[m3Index] * responseData.data.metrics.length;
                            responseData.data.averages.m3 = m3Weight
                            data = {
                              "type": "event",
                              "metadata": {
                                "metrics": responseData.data.averages,
                                "peak": "m3",
                                "threshold": 0,
                                "violated": true
                              }
                            }
                          }
                        }
                      }
                    }
                    data.authorization=req.headers.authorization
                    let response = await invoke.makeHttpCall("post", "/api/chat/" + responseData.data.id, data);
                    if (response && response.data) {
                    } else {
                      res.send("response not found")
                    }
                  } else {
                    res.send("response not found")
                  }
                } else {
                  res.status(200).send({ success: false, message: 'There is no object detected' })
                }
              } else {
                  res.status(200).send({ success: false, message: 'There is no object detected' })
              }
            }
            // })
          } catch (error) {
            if (error && error.message) {
              res.status(400).send(error);
            } else {
              res.status(400).send(error);
            }
          }
        }),
        w.post('/headphone', async (req, res) => {
          try {
            var find = req.headers.authorization
            if (find) {
              let responseData = await invoke.makeHttpCall("get", "/api/headphone/" + req.headers.authorization);
              if (responseData && responseData.data) {
                var jsondata;
                for (const key in responseData.data.averages) {
                  if (Object.hasOwnProperty.call(responseData.data.averages, key)) {
                    const element = responseData.data.averages[key];
                    if (key == "h1") {
                      const h1Index = responseData.data.metrics.indexOf("h1");
                      const h1Weight = responseData.data.weights[h1Index];
                      responseData.data.averages.h1 = h1Weight
                      jsondata = {
                        "type": "event",
                        "metadata": {
                          "metrics": responseData.data.averages,
                          "peak": "h1",
                          "threshold": 0,
                          "violated": true
                        }
                      }
                    }
                  }
                }
                let response = await invoke.makeHttpCall("post", "/api/chat/" + responseData.data.id, jsondata);
                let reportbody = {
                  peak: response.data.metadata.peak,
                  time: response.data.createdAt,
                  room: responseData.data.id,
                  authorization: req.headers.authorization
                }
                let report = await invoke.makeHttpCallUser_service("post", "/api/reportlog", reportbody)
                if (response && response.data) {
                  res.status(200).send({ success: true, message: 'Headphone checking' })
                } else {
                  res.send("response not found")
                }
              } else {
                res.send("response not found")
              }
            } else {
              res.send("response not found")
            }
          } catch (error) {
            if (error && error.message) {
              res.status(400).send(error);
            } else {
              res.status(400).send(error);
            }
          }
        }),
        w.post("/passport", upload.single('upload'), async (req, res, E) => {
          try {
            if (!req.file.buffer) {
              res.status(200).send("upload proper file")
            } else {
              var jsonData = {
                authorization: req.headers.authorization,
                myfile: req.file
              }
              let responseData = await invoke.makeHttpCall('post', '/api/storage/passport1?format=' + req.query.format, jsonData)
              if (responseData && responseData.data.success) {
                let secondResponse = await invoke.makeHttpCall('post', '/api/storage/passport2', responseData.data)
                if (secondResponse && secondResponse.data.success) {
                  if (responseData && responseData.data && responseData.data.message && responseData.data.message.id) {
                    res.status(200).send(responseData.data.message);
                    //validate photo
                    let validatePhto = await validatePhoto(responseData.data.message.user,req.file.buffer)
                    // console.log(JSON.stringify(validatePhto))
                    if(validatePhto.message.length){
                    //update record into db
                    // console.log(JSON.stringify(validatePhto),'inside if')
                      let jsonData={
                        id:responseData.data.message.user,
                        verified:true,
                        tenantId:responseData.data.decodeToken.tenantId
                      }
                      let sendDataToBackend = await invoke.makeHttpCall('post', 'updatephotostatus', jsonData)
                     //console.log(sendDataToBackend)
                    }else{
                      //update record into db
                      // console.log(JSON.stringify(validatePhto),'inside else')
                      let jsonData={
                        id:responseData.data.message.user,
                        verified:false,
                        tenantId:responseData.data.decodeToken.tenantId
                      }
                      let sendDataToBackend = await invoke.makeHttpCall('post', 'updatephotostatus', jsonData)
                     // console.log(sendDataToBackend)
                    }
                    minioClient.putObject("storage", responseData.data.message.id, req.file.buffer, req.file.size, async function (err3, etag) {
                      if (err3) {
                        return res.status(500).send(err3);
                      } else if (etag) {
                        // console.log(etag)
                        // res.status(200).send(responseData.data.message);
                      }
                    })
             
                    
                  } else {
                    res.send({ success: false, message: "response not found" });
                  }

                } else {
                  console.log({ success: false, message: "response not found" })
                  res.send({ success: false, message: "response not found" });
                }
              } else {
                res.send({ success: false, message: "response not found" });
              }
            }
          } catch (error) {
            if (error && error.message) {
              res.status(400).send(error);
            } else {
              res.status(400).send(error);
            }
          }
        }),
        w.get("/:imageId", async (req, res, E) => {
          let data;
          minioClient.getObject('storage', req.params.imageId, function (err, objStream) {
            if (err) {
              return console.log(err)
            }
            objStream.on('data', function (chunk) {
              data = !data ? new Buffer(chunk) : Buffer.concat([data, chunk]);
            })
            objStream.on('end', function () {
              res.writeHead(200, { 'Content-Type': 'image/jpeg' });
              res.write(data);
              res.end();
            })
            objStream.on('error', function (err) {
              res.status(500);
              console.log(err)
              res.send(err);
            })
          });
        }),
        (A.exports = w);
    },
    5121: (A, B, E) => {
      const w = express.Router(),
        Q = E(4676),
        C = Object.keys(data);
      w.get("/users", async (req, res, E) => {
        try {
          if (req.query && req.query.filter && req.query.filter.role) {
            let jsonData;
            if(req && req.headers && req.headers.authorization){
              jsonData = {
                authorization: req.headers.authorization
              }
            }
            let responseData = await invoke.makeHttpCall("post", "/api/suggest/users?filter[role]=" + req.query.filter.role + "&filter[value]=" + req.query.filter.value, jsonData);
            if (responseData && responseData.data) {
              res.status(200).send(responseData.data);
            } else {
              res.send("response not found")
            }
          }
        } catch (error) {
          if (error && error.message) {
            res.status(400).send(error);
          } else {
            res.status(400).send(error);
          }
        }
      }),
        w.get("/tz", Q.isAuth(["administrator"]), function (A, B) {
          const E = A.query.filter || {},
            w = new RegExp(E.value, "i");
          B.json(C.filter((A) => w.test(A)));
        }),
        (A.exports = w);
    },
    9327: (A, B, E) => {
      const w = express.Router(),
        Q = E(4676);
      w.get("/", async (req, res, E) => {
        try {
          if (req.query.limit && req.query.filter && req.query.start && req.query.count && req.query.continue && req.query.sort) {
            let responseData = await schedule.userSearch(req);
            if (responseData && responseData.data) {
              res.status(200).send(responseData.data);
            } else {
              res.send("response not found")
            }
          } else if (req.query.limit && req.query.filter && req.query.start && req.query.count && req.query.continue) {
            let responseData = await invoke.makeHttpCall("get", "/api/user?limit=" + req.query.limit + "&filter=" + req.query.filter + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue +"");
            if (responseData && responseData.data) {
              res.status(200).send(responseData.data);
            } else {
              res.send("response not found")
            }
          } else if (req.query.limit && req.query.filter) {
            let responseData = await invoke.makeHttpCall("get", "/api/user?limit=" + req.query.limit + "&filter=" + req.query.filter +"");
            if (responseData && responseData.data) {
              res.status(200).send(responseData.data);
            } else {
              res.send("response not found")
            }
          } else if (req.query.limit && req.query.start && req.query.count && req.query.continue && req.query.sort) {
            let responseData = await schedule.userData(req);
            if (responseData && responseData.data) {
              res.status(200).send(responseData.data);
            } else {
              res.send("response not found")
            }
          } else if (req.query.limit && req.query.start && req.query.count && req.query.continue) {
            let responseData = await invoke.makeHttpCall("get", "/api/user?limit=" + req.query.limit + "&start=" + req.query.start + "&count=" + req.query.count + "&continue=" + req.query.continue +"");
            if (responseData && responseData.data) {
              res.status(200).send(responseData.data);
            } else {
              res.send("response not found")
            }
          } else if (req.query.limit) {
            let responseData = await invoke.makeHttpCall("get", "/api/user?limit=" + req.query.limit+"");
            if (responseData && responseData.data) {
              res.status(200).send(responseData.data);
            } else {
              res.send("response not found")
            }
          }
        } catch (error) {
          if (error && error.message) {
            res.status(400).send(error);
          } else {
            res.status(400).send(error);
          }
        }
      }),
        w.get("/me", async (req, res, E) => {
          try {
            var jsonData = {
              authorization: req.headers.authorization,
            }
            let responseData = await invoke.makeHttpCall("post", "/api/user/me", jsonData);
            if (responseData && responseData.data) {
              res.status(200).send(responseData.data);
            } else {
              res.send("response not found")
            }
          } catch (error) {
            if (error && error.message) {
              res.status(400).send(error);
            } else {
              res.status(400).send(error);
            }
          }
        }),
        w.put("/me", async (req, res) => {
          try {
            if (req.body.face) {
              req.body.authorization = req.headers.authorization;
              let responseData = await invoke.makeHttpCall("put", "/api/user/me1", req.body);
              if (responseData && responseData.data) {
                res.status(200).send(responseData.data);
              } else {
                res.send("response not found")
              }
            } else if (req.body.passport) {
              req.body.authorization = req.headers.authorization;
              let responseData = await invoke.makeHttpCall("put", "/api/user/me2", req.body);
              if (responseData && responseData.data) {
                res.status(200).send(responseData.data);
              } else {
                res.send("response not found")
              }
            } else {
              res.send("Unable to find a face")
            }
          } catch (error) {
            if (error && error.message) {
              res.status(400).send(error);
            } else {
              res.status(400).send(error);
            }
          }
        }),
        w.get("/:username", async (req, res) => {
          try {
            if (req.params.username) {
              let responseData = await invoke.makeHttpCall("get", "/api/user/" + req.params.username +"");
              if (responseData && responseData.data) {
                res.status(200).send(responseData.data);
              } else {
                res.send("response not found")
              }
            }
          } catch (error) {
            if (error && error.message) {
              res.status(400).send(error);
            } else {
              res.status(400).send(error);
            }
          }
        }),
        w.post("/", async (req, res, E) => {
          try {
            if (req.body) {
              var A = req.get("user-agent")
              req.body.bower = A;
              req.body.authorization = req.headers.authorization;
              let responseData = await invoke.makeHttpCall("post", '/api/user', req.body);
              if (responseData && responseData.data) {
                res.status(200).send(responseData.data);
              } else {
                res.send({ success: false, message: "response not found" })
              }
            } else {
              res.send("response not found")
            }
          } catch (error) {
            if (error && error.message) {
              res.status(400).send(error);
            } else {
              res.status(400).send(error);
            }
          }
        }),
        w.put("/:userId", async (req, res, E) => {
          try {
            if (req && req.body) {
              req.body.authorization = req.headers.authorization;
              let responseData = await invoke.makeHttpCall("put", "/api/user/" + req.params.userId + "", req.body);
              if (responseData && responseData.data) {
                res.status(200).send(responseData.data);
              } else {
                res.send("response not found")
              }
            }
          } catch (error) {
            if (error && error.message) {
              res.status(400).send(error);
            } else {
              res.status(400).send(error);
            }
          }
        }),
        w.delete("/:UserId", async (req, res, E) => {
          try {
            if (req.params.UserId) {
              let responseData = await invoke.makeHttpCall("delete", "/api/user/" + req.params.UserId +"?authorization="+req.headers.authorization+"");
              if (responseData && responseData.data) {
                res.status(200).send(responseData.data);
              } else {
                res.send({ success: false, message: "response not found" })
              }
            } else {
              res.send("response not found")
            }
          } catch (error) {
            if (error && error.message) {
              res.status(400).send(error);
            } else {
              res.status(400).send(error);
            }
          }
        }),
        (A.exports = w);
    },
    9328: (A, B) => {
      const w = express.Router();
      w.post("/", async (req, res) => {
        try {
          if (req.body) {
            let responseData = await invoke.makeHttpCallsync("post", '/api/generateProctorToken', req.body);
            if (responseData && responseData.data) {
              let logData = responseData.data.data
              delete responseData.data.data
              res.status(200).send(responseData.data);
            } else {
              res.send({ success: false, message: "response not found" })
            }
          } else {
            res.send("response not found")
          }
        } catch (error) {
          if (error && error.message) {
            res.status(400).send(error);
          } else {
            res.status(400).send(error);
          }
        }

      }),
        (A.exports = w);
    },
    9000: (A, B) => {
      const w = express.Router();
      w.get("/", async (A, B) => {
        try {
          // let response = await tokenService.findPhoneObjectDetection
          // (A.query);
          B.json({ "app": "proctoring", "version": "4.7.1-a711351", "license": { "iat": 1669314377, "nbf": 1640995200, "exp": 1704067200, "host": "demo.proctoring.online", "unit": "hours", "volume": 10000, "used": 1728 }, "config": { "iframe": { "sandbox": "allow-scripts allow-forms allow-modals allow-same-origin allow-popups allow-downloads" }, "turnURI": "turn://webrtc:webrtc@turn.proctoring.online:3478?transport=udp+tcp" }, "user": { "id": "610ee98a5873e50013ebf09d", "username": "610ee98a5873e50013ebf09d", "nickname": "student", "host": "demo.proctoring.online", "role": "student" }, "room": { "student": null, "proctor": null, "invites": [], "members": [], "addons": ["check", "mobile", "screen", "webrtc", "shared"], "metrics": ["b1", "b2", "b3", "c1", "c2", "c3", "c4", "c5", "k1", "m1", "m2", "n1", "n2", "s1", "s2"], "weights": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], "scale": [], "acceptable": [], "status": "template", "tags": [], "xaxis": [], "identifier": "check", "subject": "check", "scheduledAt": null, "lifetime": null, "deadline": null, "timeout": null, "locale": null, "threshold": 0, "timezone": null, "rules": null, "url": null, "api": null, "quorum": 0, "concurrent": 0, "complete": false, "stoppedAt": null, "conclusion": null, "comment": null, "error": null, "host": "demo.proctoring.online", "createdAt": "2021-08-07T20:25:01.460Z", "yaxis": [], "updatedAt": "2022-12-14T09:02:30.777Z", "expires": 90, "removeAt": null, "attempt": null, "provider": null, "id": "610eec1d2084b300151f78f3" } });
        } catch (response) {
          B.json(0);
        }

      }),
        (A.exports = w);
    },
    //code end
  },
    B = {};
  function E(w) {
    if (B[w]) return B[w].exports;
    var Q = (B[w] = { exports: {} });
    return A[w].call(Q.exports, Q, Q.exports, E), Q.exports;
  }
  (E.o = (A, B) => Object.prototype.hasOwnProperty.call(A, B)),
    (() => {
      const A = os,
        B = nconf;
      B.use("memory"),
        B.env({ separator: "_", lowerCase: !0, parseValues: !0 }),
        // console.log("env"+JSON.stringify(B));
        B.defaults({

          host: "0.0.0.0",
          port: 7e3,
          threads: 8,
          hostname: String(A.hostname),
          admin: { username: "admin", password: "aep7feuY" },
          // mongo: { uri: "mongodb://localhost:27017/proctor" },
          // mongo: { uri: "mongodb+srv://edutechdbadmin:3DUtechDBAdm1n@proctoredu.cdnsi.mongodb.net/proctor?retryWrites=true&w=majority"},
          mongo: { uri: "" },
          // minio: { uri: "https://4GATP82FP60JC6W0ENU3:JspPHOZV+oXaohYK+DgVsLSZy9tJJvCyh5Pnu75Q@proctorminiodev.lntedutech.com/testbucket" },
          minio: { uri: "https://G3FUFK2374780KWYANBA:eWkJaZ42Payv5SyBDviBfHSIxhecJ14FfC3d6znr@proctorminiodev.lntedutech.com/storage" },
          // minio: { uri: "http://X8TVX3OO54H2XFHDEGGQ:ORAnlLo0AR+c0jQM8DT+2wRlherCdjrUPgXjA7jj@minio-api:9000/storage" },
          // minio: { uri: "https://proctorstg:SNuBzMS2wgBJfP/eWh0PgDT/9nL1qtoJhOqVtYDXkX8/QAyLDIvs1SMsS26b0sjXdOLU8FV2Vb4+k5D6ZTiaGA==@proctorminio.lntedutech.com/storage" },
          // recognizer: { uri: "http://iuqu5aishai7Nuothacohcah@recognizer:8080/upload" },
          recognizer: { uri: "http://iuqu5aishai7Nuothacohcah@20.198.220.175:8080/upload" },

          // minio: { uri: "https://IX2GAAIFNSA8WQQUC7GT:5c5VZ+aQFGDOHxkEq+wEe7gaE8P1FEUSByeRwnPK@proctorminiodev.lntedutech.com/storage" },
          // recognizer: { uri: "http://iuqu5aishai7Nuothacohcah@localhost:8080/upload" },
          upload: { limit: 100, expires: 60 },
          static: { expires: 60 },
          session: { key: "secret", expires: 720 },
          ssl: { key: null, cert: null },
          archive: { dir: null },
        });
      const w = cluster,
        Q = E(422);
      if (w.isMaster) {
        const A = dgram.createSocket("udp4");
        let s = [];
        A.on("error", function (A) {
          A && Q.log({ level: "error", label: "server", message: A });
          // console.log("error 222"+A);
        }),
          A.on("message", function (A) {
            try {
              A = JSON.parse(A);
            } catch (B) {
              A = null;
            }
            if (A && A.id) for (const B in w.workers) w.workers[B].send(A);
          }),
          A.on("listening", function () {
            const B = A.address();
            // Q.log({ level: "info", label: "server", message: `UDP listening on ${B.address}:${B.port}` });
          }),
          A.bind(B.get("port"), B.get("host"));
        const C = function (E) {
          try {
            // const w = JSON.stringify(E),
              Q = Buffer.from(w);
            for (let E = 0; E < s.length; E++) A.send(Q, 0, Q.length, B.get("port"), s[E]);
          } catch (A) {
            Q.log({ level: "error", label: "server", message: A });
            //  console.log("error 3333"+A);
          }
        },
          g = function () {
            for (const A in w.workers) w.workers[A].process.kill("SIGUSR2");
            A.close(function () {
              Q.log({ level: "info", label: "server", message: "UDP listener has been stopped" });
            });
          };
        for (let A = 0; A < B.get("threads"); A++) w.fork();
        w.on("exit", function (A, B, E) {
          0 !== B && "SIGINT" !== E && "SIGUSR2" !== E && w.fork();
        }),
          w.on("message", function (A, B) {
            if (B && "nodes:list" === B.id) s = B.data || [];
            else {
              for (const A in w.workers) w.workers[A].send(B);
              s.length && C(B);
            }
          }),
          process.once("SIGUSR2", g),
          process.once("SIGINT", g);
      } else if (w.isWorker) {
        // const A = express,
        const w = pathVar,
          s = cors,
          C = qs,
          g = morgan,
          I = compression,
          D = bodyparser,
          Y = passport,
          R = express(),
          L = B.get("ssl:key") && B.get("ssl:cert") ? "https" : "http",
          i = "https" === L ? https.Server({ key: String(B.get("ssl:key")).replace(/\\n/g, "\n"), cert: String(B.get("ssl:cert")).replace(/\\n/g, "\n") }, R) : http.Server(R);
        c = E(8993)(i),
          R.enable("trust proxy"),
          R.disable("x-powered-by"),
          R.set("query parser", function (A) {
            return C.parse(A, { allowPrototypes: !0, strictNullHandling: !0 });
          }),
          R.use(
            g(function (A, B, E) {
              const w = [B.ip, "-", A.method(B, E), A.url(B, E), A.status(B, E), `(${E.statusMessage})`, A.res(B, E, "content-length") || 0, "bytes", "-", A["response-time"](B, E), "ms"].join(" ");
              let s = "verbose";
              E.statusCode >= 100 && (s = "info"), E.statusCode >= 400 && (s = "warn"), E.statusCode >= 500 && (s = "error"), Q.log({ level: s, label: L, message: w });
            })
          ),
          R.use(I()),
          R.use(D.json({ limit: '500mb' })),
          R.use(D.urlencoded({ extended: !1 })),
          // R.use(D.json({limit:'50mb'})),
          // R.use(D.urlencoded({ limit:'50mb',extended: true })),
          R.use(Y.initialize()),
          R.use(function (A, B, E) {
            Y.authenticate("session", function (B, w) {
              if (B || !w) return E(B);
              A.logIn(w, E);
            })(A, B, E);
          }),
          R.use("/api", s({ origin: !0, credentials: !0 }), E(3310)),
          R.use('/user', userService),
          R.use('/webinar', webinarService)
        R.use(express.static(w.join(__dirname, "public"), B.get("static:expires") ? { maxAge: 60 * B.get("static:expires") * 1e3 } : {})),
          R.use(function (A, B, E) {
            B.status(404), E();
          }),
          R.use(function (A, B, E, w) {
            if (E.headersSent) return w(A);
            200 === E.statusCode && E.status(500), (E.statusMessage = String(A).replace(/\n/g, " ")), E.json({ error: E.statusMessage });
          }),
          E(4503),
          i.listen(B.get("port"), B.get("host"), function () {
            const A = i.address();
            console.log('Listening on port ' + i.address().port); //Listening on port 8888
          });
      }
    })();
})();


let uploadImgAndVerify = async (fileBuffer) => {
  return new Promise(async (resolve, reject) => {

    try {
      await axios.post(process.env.RECOGNIZER + '/upload', fileBuffer, {
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      })
        .then((response) => {
          resolve({ success: true, message: response.data })
        })
        .catch((error) => {
          resolve({ success: false, message: error })
        });
    } catch (error) {
      reject({ success: false, message: error })
    }

  })
};

let uploadTrainedImg= async (fileBuffer,filename,folderName) => {
  return new Promise(async (resolve, reject) => {
    try {
      // console.log('/upload?filename='+filename+'&folderName='+folderName)
      await axios.post(process.env.OBJECT_DETECTION + '/upload?filename='+filename+'&folderName='+folderName, fileBuffer, {
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      })
        .then((response) => {
          resolve({ success: true, message: response.data })
        })
        .catch((error) => {
          resolve({ success: false, message: error })
        });
    } catch (error) {
      reject({ success: false, message: error })
    }

  })
};
let uploadTrainedApiCall=async(userName,fileBuffer)=>{
  return new Promise(async (resolve, reject) => {
    try {
      // console.log('/upload?filename='+filename+'&folderName='+folderName)
      await axios.post(process.env.OBJECT_DETECTION + '/train?model=hog&userName='+userName, {
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      })
        .then((response) => {
          resolve({ success: true, message: response.data })
        })
        .catch((error) => {
          resolve({ success: false, message: error })
        });
    } catch (error) {
      reject({ success: false, message: error })
    }

  })
}
let validatePhoto=async(userName,imageBuffer)=>{
  return new Promise(async (resolve, reject) => {
    try {
      const formData = new FormData();
      formData.append('file', imageBuffer, {
        filename: 'image.jpg',
        contentType: 'image/jpeg' // Change content type accordingly
      });
    
      // console.log('/upload?filename='+filename+'&folderName='+folderName)
      await axios.post(process.env.OBJECT_DETECTION + '/recognize?userName='+userName, formData,{
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      })
        .then((response) => {
          resolve({ success: true, message: response.data })
        })
        .catch((error) => {
          resolve({ success: false, message: error })
        });
    } catch (error) {
      reject({ success: false, message: error })
    }

  })
}
let uploadImgAndVerifyObject = async (fileBuffer) => {
  return new Promise(async (resolve, reject) => {

    try {
      // await request.post({
      //   url: process.env.OBJECT_DETECTION + '/api/data',
      //   formData: formData,
      //   headers: { "Content-Type": "application/json", "X-Api-Key": 'iuqu5aishai7Nuothacohcah' }
      // }, function optionalCallback(err, httpResponse, body) {
      //   if (err) {
      //     resolve({ success: false, message: err })
      //   } else {
      //     resolve({ success: true, message: body })
      //   }
      // });
      await axios.post(process.env.OBJECT_DETECTION + '/api/data', fileBuffer, {
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      })
        .then((response) => {
          if (response && response.data && response.data.success) {
            resolve({ success: true, message: response.data.message })
          } else {
            resolve({ success: false, message: response.data.message })
          }
          
        })
        .catch((error) => {
          resolve({ success: false, message: error })
        });
    } catch (error) {
      reject({ success: false, message: error })
    }

  })
};
function getData(req) {
  return new Promise((resolve, reject) => {
    try {
      let data = []; let F; let s = ";";
      req.on("line", async function (B) {
        if (F) {
          const E = B.split(s); const w = {};
          for (let A = 0; A < F.length; A++) w[F[A]] = E[A]
          w._id = w.id; delete w.id;
          data.push(w);
        } else F = B.split(s);
        resolve({ success: true, message: data })
      });
    } catch (error) {
      reject({ success: false, message: error })
    }
  })
}
