const express = require('express');
const router =  express.Router();
const w = express.Router();
const Q = require('../routes/auth');
const s = require('../routes/archivefile');
w.get("/:room", Q.isAuth(["proctor", "administrator"]), function (A, B, E) {
s.metadata(A.path, function (A, w) {
    if (A || !w) return B.status(404), E(new Error("Not found"));
    B.json(w);
});
});
w.get("/:room/:video", Q.isAuth(["proctor", "administrator"]), function (A, B, E) {
    s.download(A.path, A.headers.range, function (A) {
        return A ? (B.status(404), E(new Error("Not found"))) : B;
    });
});


module.exports = w;