(() => {
    var e = {
            422: (e, t, r) => {
                const s = r(1531),
                    { createLogger: o, format: n, transports: i } = r(944),
                    { combine: c, timestamp: l, colorize: p, printf: a } = n,
                    g = function ({ label: e, level: t, message: r, timestamp: o }) {
                        return e || (e = "worker"), `${o} ${t} [${e}-${s.isWorker ? s.worker.id : 0}]: ${r}`;
                    },
                    u = o({ level: "info", format: c(l(), a(g)), transports: [new i.Console({ stderrLevels: ["error"], handleExceptions: !0 })], exitOnError: !1 });
                e.exports = u;
            },
            3129: (e) => {
                "use strict";
                e.exports = require("child_process");
            },
            1531: (e) => {
                "use strict";
                e.exports = require("cluster");
            },
            8605: (e) => {
                "use strict";
                e.exports = require("http");
            },
            6990: (e) => {
                "use strict";
                e.exports = require("http-proxy");
            },
            7211: (e) => {
                "use strict";
                e.exports = require("https");
            },
            7435: (e) => {
                "use strict";
                e.exports = require("nconf");
            },
            2087: (e) => {
                "use strict";
                e.exports = require("os");
            },
            4016: (e) => {
                "use strict";
                e.exports = require("tls");
            },
            944: (e) => {
                "use strict";
                e.exports = require("winston");
            },
        },
        t = {};
    function r(s) {
        if (t[s]) return t[s].exports;
        var o = (t[s] = { exports: {} });
        return e[s](o, o.exports, r), o.exports;
    }
    (() => {
        const e = r(2087),
            t = r(1531),
            s = r(422),
            o = r(7435);
        if ((o.env({ separator: "_", lowerCase: !0, parseValues: !0 }), o.defaults({ host: "0.0.0.0", port: 443, redirect: { port: 80 }, threads: e.cpus().length, ssl: {}, vhost: {} }), t.isMaster)) {
            const { fork: e } = r(3129);
            for (const t in o.get("vhost")) {
                const r = o.get(`vhost:${t}:name`);
                r &&
                    e("server.js", [r], {
                        env: {
                            HOST: o.get(`vhost:${t}:host`),
                            PORT: o.get(`vhost:${t}:port`),
                            THREADS: o.get(`vhost:${t}:threads`),
                            HOSTNAME: o.get(`vhost:${t}:hostname`),
                            MONGO_URI: o.get(`vhost:${t}:mongo:uri`),
                            MINIO_URI: o.get(`vhost:${t}:minio:uri`),
                            RECOGNIZER_URI: o.get(`vhost:${t}:recognizer:uri`),
                            UPLOAD_LIMIT: o.get(`vhost:${t}:upload:limit`),
                            UPLOAD_EXPIRES: o.get(`vhost:${t}:upload:expires`),
                            STATIC_EXPIRES: o.get(`vhost:${t}:static:expires`),
                            SESSION_KEY: o.get(`vhost:${t}:session:key`),
                            SESSION_EXPIRES: o.get(`vhost:${t}:session:expires`),
                            ARCHIVE_DIR: o.get(`vhost:${t}:archive:dir`),
                        },
                    });
            }
            for (let e = 0; e < o.get("threads"); e++) t.fork();
            t.on("exit", function (e, r, s) {
                0 !== r && "SIGINT" !== s && "SIGUSR2" !== s && t.fork();
            }),
                process.once("SIGUSR2", function () {
                    for (const e in t.workers) t.workers[e].process.kill("SIGUSR2");
                }),
                process.once("SIGINT", function () {
                    for (const e in t.workers) t.workers[e].process.kill("SIGUSR2");
                });
        } else if (t.isWorker) {
            const e = r(6990).createProxyServer({ xfwd: !0, ws: !0 });
            e.on("error", function (e) {
                s.log({ level: "error", label: "proxy", message: e });
            });
            const t = r(7211),
                n = r(4016),
                i = {},
                c = {
                    SNICallback: function (e, t) {
                        if (!t) return i[e];
                        t(null, i[e]);
                    },
                    key: String(o.get("ssl:key")).replace(/\\n/g, "\n"),
                    cert: String(o.get("ssl:cert")).replace(/\\n/g, "\n"),
                },
                l = {};
            for (const e in o.get("vhost")) {
                const { name: t, port: r = 3e3, ssl: s } = o.get("vhost:" + e);
                (l[t] = "http://127.0.0.1:" + r), s && (i[t] = n.createSecureContext({ key: String(s.key).replace(/\\n/g, "\n"), cert: String(s.cert).replace(/\\n/g, "\n") }));
            }
            const p = t.createServer(c, function (t, r) {
                const o = t.headers.host,
                    n = l[o];
                if (n) s.log({ level: "info", label: "proxy", message: `${t.connection.remoteAddress} - ${t.method} https://${o}${t.url} (Proxy Pass)` }), e.web(t, r, { target: n });
                else {
                    const e = "Not Found";
                    s.log({ level: "warn", label: "proxy", message: `${t.connection.remoteAddress} - ${t.method} https://${o}${t.url} (${e})` }),
                        r.writeHead(404, { "Content-Length": Buffer.byteLength(e), "Content-Type": "text/plain" }).end(e);
                }
            });
            p.on("upgrade", function (t, r, s) {
                const o = l[t.headers.host];
                o && e.ws(t, r, s, { target: o });
            });
            const a = o.get("port"),
                g = o.get("host");
            p.listen(a, g, function () {
                const e = p.address();
                s.log({ level: "info", label: "proxy", message: `Proxy listening on ${e.address}:${e.port}` });
            });
            const u = r(8605),
                h = o.get("greenlock:filename"),
                f = o.get("greenlock:contents"),
                d = new RegExp("^/.well-known/acme-challenge/" + h),
                S = u.createServer(function (e, t) {
                    if (f && d.test(e.url)) return t.writeHead(200, { "Content-Length": Buffer.byteLength(f), "Content-Type": "text/plain" }).end(f);
                    t.writeHead(301, { Location: `https://${e.headers.host}${e.url}` }).end();
                }),
                v = o.get("redirect:port");
            v && S.listen(v, g),
                process.once("SIGINT", function () {}),
                process.once("SIGUSR2", function (t) {
                    p.close(), e.close(), S.close(), process.kill(process.pid, t);
                });
        }
    })();
})();
