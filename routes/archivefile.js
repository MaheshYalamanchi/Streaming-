                const w = E(5622),
                    Q = E(7435),
                    s = E(5747);
                function C(A, B, E) {
                    const Q = B.pop();
                    if (!Q) return E();
                    const g = function (w) {
                            (s.rmdir ? s.rmdir : s.unlink)(w, function (w) {
                                if (w) return E(w);
                                C(A, B, E);
                            });
                        },
                        I = w.join(A, Q);
                    s.readdir(I, function (A, B) {
                        if (A) return E(A);
                        if (!B.length) return g(I);
                        let Q = (B = B.reverse()).length;
                        for (let A = 0; A < B.length; A++) {
                            let C = w.join(I, B[A]);
                            s.unlink(C, function (A) {
                                if (A) return E(A);
                                0 == --Q && g(I);
                            });
                        }
                    });
                }
                const g = {
                    metadata: function (A, B) {
                        if (!Q.get("archive:dir")) return B();
                        const E = w.join(Q.get("archive:dir"), A);
                        s.readdir(E, function (A, Q) {
                            if (A) return B(A);
                            const C = Q.filter(function (A) {
                                return /\.json$/.test(A);
                            });
                            let g = C.length;
                            if (!g) return B(null, []);
                            const I = [];
                            for (let A = 0; A < C.length; A++) {
                                const Q = w.join(E, C[A]);
                                s.readFile(Q, "utf8", function (A, E) {
                                    if (!A)
                                        try {
                                            I.push(JSON.parse(E));
                                        } catch (A) {}
                                    0 == --g && B(null, I);
                                });
                            }
                        });
                    },
                    download: function (A, B, E) {
                        if (!Q.get("archive:dir")) return E();
                        const C = w.join(Q.get("archive:dir"), A);
                        s.stat(C, function (A, w) {
                            if (A || !w.isFile()) return E(A || new Error("Not a file"));
                            const Q = w.size,
                                g = E();
                            if (B) {
                                const A = B.replace(/bytes=/, "").split("-"),
                                    E = parseInt(A[0], 10),
                                    w = A[1] ? parseInt(A[1], 10) : Q - 1,
                                    I = w - E + 1;
                                g.writeHead(206, { "Content-Range": "bytes " + E + "-" + w + "/" + Q, "Accept-Ranges": "bytes", "Content-Length": I }), s.createReadStream(C, { start: E, end: w }).pipe(g);
                            } else g.writeHead(200, { "Content-Length": Q }), s.createReadStream(C).pipe(g);
                        });
                    },
                    remove: function (A, B) {
                        if (!Q.get("archive:dir")) return B();
                        C(w.resolve(Q.get("archive:dir")), [A], B);
                    },
                };
                A.exports = g;