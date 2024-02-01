const w = require("nconf");
const Q = require("mongoose");
const C = require("crypto");
const g = require("bowser");
const I = require("jsonwebtoken");
const { v4: D } = require("uuid");
Y = Q.Schema,
F = /^[A-Za-z0-9_-]+$/,
M = new Y(
    {
        _id: {
            type: String,
            validate: {
                validator: function (A) {
                    return F.test(A);
                },
            },
        },
        locked: { type: Boolean },
        active: { type: Boolean },
        createdAt: {
            type: Date,
            default: Date.now,
            set: function () {
                return this.createdAt ? this.createdAt : new Date();
            },
        },
        provider: { type: String },
        hashedPassword: { type: String, select: !1 },
        salt: { type: String, select: !1 },
        role: { type: String, default: "student", enum: ["student", "proctor", "administrator"] },
        group: {
            type: String,
            set: function (A) {
                if (F.test(A)) return A;
            },
        },
        nickname: { type: String },
        labels: {
            type: [String],
            set: function (A) {
                return "string" == typeof A ? A.split(",").map((A) => A.trim()) : A;
            },
        },
        lang: { type: String },
        secure: { type: Boolean },
        face: { type: Y.Types.ObjectId, ref: "Attach" },
        passport: { type: Y.Types.ObjectId, ref: "Attach" },
        threshold: { type: Number },
        similarity: { type: Number },
        limit: { type: Number },
        depth: { type: Number },
        exclude: { type: [{ type: String, ref: "User" }] },
        similar: { type: [{ _id: !1, user: { type: String, ref: "User" }, distance: Number }] },
        rep: { type: [Number] },
        verified: { type: Boolean },
        rating: { type: Number },
        loggedAt: { type: Date, index: !0 },
        ipaddress: { type: String },
        useragent: {
            type: String,
            set: function (A) {
                if (A) {
                    const B = g.parse(A);
                    (this.browser = B.browser), (this.os = B.os), (this.platform = B.platform);
                }
                return A;
            },
        },
        browser: { name: String, version: String },
        os: { name: String, version: String, versionName: String },
        platform: { type: { type: String }, vendor: String, model: String },
        referer: { type: String },
    },
    { versionKey: !1 }
);
(M.methods.isActive = function () {
return !this.locked;
}),
(M.methods.randomPassword = function (A = 32) {
    return C.randomBytes(A).toString("base64");
}),
(M.methods.encryptPassword = function (A, B) {
    return C.createHmac("sha1", B).update(A).digest("hex");
}),
(M.methods.validPassword = function (A) {
    return !(!A || !this.salt) && this.encryptPassword(A, this.salt) === this.hashedPassword;
}),
M.virtual("username")
    .set(function (A) {
        this._id || (this._id = A);
    })
    .get(function () {
        return this._id;
    }),
M.virtual("password")
    .set(function (A) {
        A || (A = this.randomPassword()), (this._plainPassword = A), (this.salt = this.randomPassword()), (this.hashedPassword = this.encryptPassword(A, this.salt));
    })
    .get(function () {
        return this._plainPassword;
    }),
M.set("toJSON", {
    virtuals: !0,
    getters: !0,
    transform: function (A, B) {
        return delete B._id, delete B[M.options.versionKey], delete B[M.options.discriminatorKey], delete B.hashedPassword, delete B.salt, delete B.password, delete B.rep, B;
    },
}),
M.post("init", function () {
    (this._face = this.face), (this._passport = this.passport);
}),
M.pre("save", function (A) {
    if ((this._id || (this._id = D()), this.nickname || (this.nickname = this.username), !this.face)) return (this.rep = []), (this.similar = []), A();
    const B = this;
    String(this._face) != String(this.face)
        ? B.populate([{ path: "face", select: { "metadata.rep": 1, "metadata.similar": 1 } }], function (E) {
              if (E) return A(E);
              const w = B.face && B.face.toJSON();
              w && w.metadata ? ((B.face = w.id), (B.rep = w.metadata.rep || []), (B.similar = w.metadata.similar || [])) : ((B.face = null), (B.rep = []), (B.similar = [])), A();
          })
        : String(this._passport) != String(this.passport)
        ? B.populate([{ path: "passport", select: { "metadata.rep": 1, "metadata.verified": 1 } }], function (E) {
              if (E) return A(E);
              const w = B.passport && B.passport.toJSON();
              w && w.metadata ? ((B.passport = w.id), (B.verified = w.metadata.verified)) : ((B.passport = null), (B.verified = null)), A();
          })
        : A();
}),
M.post("save", function () {
    if (String(this._face) != String(this.face)) {
        const A = E(2914);
        A.setAttachedFlag(this.face, !0), A.setAttachedFlag(this._face, !1);
    }
    if (String(this._passport) != String(this.passport)) {
        const A = E(2914);
        A.setAttachedFlag(this.passport, !0), A.setAttachedFlag(this._passport, !1);
    }
}),
M.pre("remove", function (A) {
    E(7476)
        .findOne({ student: this._id })
        .exec(function (B, E) {
            return B ? A(B) : E ? A(new Error("The user is associated with a room")) : void A();
        });
}),
M.post("remove", function () {
    const A = E(2914);
    A.setAttachedFlag(this.face, !1), A.setAttachedFlag(this.passport, !1);
}),
(M.statics.getToken = function (A = {}, B) {
    const E = A.id,
        Q = "number" == typeof A.expires ? A.expires : w.get("session:expires");
    R.findById(E).exec(function (A, E) {
        if (A) return B(A);
        if (!E) return B(new Error("User not found"));
        const s = { id: E.id, role: E.role, provider: E.provider, group: E.group };
        Q && (s.exp = ~~(Date.now() / 1e3) + 60 * Q), (s.token = I.sign(s, w.get("session:key"))), B(null, s);
    });
}),
(M.statics.localAuth = function (A, B) {
    (A = A || {}),
        R.findById(A.username)
            .select("+hashedPassword +salt")
            .exec(function (E, w) {
                if (E) return B(null, !1);
                if (!w) return B(null, !1);
                if (!w.isActive()) return B(null, !1);
                if (!w.validPassword(A.password)) return B(null, !1);
                for (let B in A) "password" !== B && "provider" !== B && (w[B] = A[B]);
                w.save(function (A, E) {
                    if (A) return B(null, !1);
                    B(null, E);
                });
            });
}),
(M.statics.externalAuth = function (A, B) {
    (A = A || {}),
        R.findById(A.username).exec(function (E, w) {
            if (E) return B(E, !1);
            if (w) {
                if (!w.isActive()) return B(null, !1);
                if (!w.provider && A.provider && !w.validPassword(A.password)) return B(null, !1);
                for (let B in A) "password" !== B && "provider" !== B && (w[B] = A[B]);
                w.save(B);
            } else (w = new R(A)).save(B);
        });
}),
(M.statics.findSimilarFaces = function (A, B) {
    const E = (A = A || {}).model || [],
        w = A.sample || [],
        Q = A.exclude || [],
        C = A.face,
        g = A.threshold || 0.25,
        I = A.similarity || 0.15,
        D = A.limit || 10,
        Y = A.depth || 1e3;
    let F = 0;
    if (E.length === w.length)
        for (let A = 0; A < E.length; A++) {
            const B = E[A] - w[A];
            F += B * B;
        }
    let M = { distance: F, threshold: g, verified: F <= g };
    const L = w.length > 0 ? w : E;
    if (!C || !L.length) return B(null, M);
    const i = {
        query: { locked: { $ne: !0 }, rep: { $ne: null }, role: "student" },
        map: function () {
            var A = this.rep || [];
            if (!(c >= n || A.length !== s.length)) {
                for (var B = 0, E = 0, w = 0, Q = s.length; E < Q; E++) if ((B += (w = s[E] - A[E]) * w) > t) return;
                var C = this._id;
                -1 === e.indexOf(C) && (emit(C, B), c++);
            }
        },
        reduce: function (A, B) {
            return B[0];
        },
    };
    (i.scope = { c: 0, e: Q, n: D, s: L, t: I }),
        (i.sort = { loggedAt: -1 }),
        (i.limit = Y),
        R.mapReduce(i, function (A, E) {
            if (A) return B(A);
            const w = E.results || [],
                Q = [];
            for (let A = 0; A < w.length; A++) {
                const B = w[A];
                Q.push({ user: B._id, distance: B.value, threshold: I });
            }
            return (
                (M.similar = Q.sort(function (A, B) {
                    return A.value - B.value;
                })),
                B(null, M)
            );
        });
}),
(M.statics.updateRating = function (A, B, E) {
    R.findById(A).exec(function (A, w) {
        if (A || !w) return "function" == typeof E && E(A || new Error("User not found"));
        "number" == typeof w.rating ? (w.rating = Math.ceil((w.rating + B) / 2)) : (w.rating = B), w.save(E);
    });
});
const R = Q.model("User", M);
module.exports = R;