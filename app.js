const express = require('express');
const path = require('path');
// const cookieParser = require('cookie-parser');
// const logger = require('morgan');
const cors = require('cors');
const indexRouter = require('./routes/index');
const archiveRouter = require('./routes/archive');
const authRouter = require('./routes/auth');

const app = express();
app.use(cors({
//  origin: '*' // для разработки
}))

app.use("/archive", archiveRouter);
app.use("/auth",authRouter);
// app.use("/blank", E(3321));
// app.use("/chat", E(8120));
// app.use("/check", E(5898));
// app.use("/config", E(2779));
// app.use("/csv", E(8813));
// app.use("/jobs", E(4917));
// app.use("/report", E(5942));
// app.use("/rest", E(5931));
// app.use("/room", E(6855));
// app.use("/stat", E(256));
// app.use("/status", E(285));
// app.use("/storage", E(4067));
// app.use("/suggest", E(5121));
// app.use("/user", E(9327));

module.exports = app;