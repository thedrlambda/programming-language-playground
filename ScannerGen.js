"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
function makeNFA(regEx) {
    var stack = [];
    var map = [];
    for (var i = 0; i < regEx.length + 1; i++) {
        map.push({});
    }
    for (var i = 0; i < regEx.length; i++) {
        var c = regEx.charAt(i);
        if (c === "(" || c === "|")
            stack.push(i);
        var start = void 0;
        if (c === ")") {
            var pipe = stack.pop();
            if (regEx.charAt(pipe) === "|") {
                start = stack.pop();
                if (map[pipe][""] === undefined)
                    map[pipe][""] = [];
                map[pipe][""].push(i);
                if (map[start][""] === undefined)
                    map[start][""] = [];
                map[start][""].push(pipe + 1);
            }
            else
                start = pipe;
        }
        else {
            start = i;
        }
        if (regEx.charAt(i + 1) === "*") {
            if (map[i + 1][""] === undefined)
                map[i + 1][""] = [];
            map[i + 1][""].push(start);
            if (map[start][""] === undefined)
                map[start][""] = [];
            map[start][""].push(i + 1);
        }
        if (c === "(" || c === ")" || c === "*") {
            if (map[i][""] === undefined)
                map[i][""] = [];
            map[i][""].push(i + 1);
        }
        else if (c === "|") {
        }
        else {
            if (map[i][c] === undefined)
                map[i][c] = [];
            map[i][c].push(i + 1);
        }
    }
    return map;
}
function addAllUnique(as, bs) {
    (bs || []).forEach(function (b) {
        if (as.indexOf(b) < 0)
            as.push(b);
    });
}
function arrayToString(arr) {
    arr.sort();
    return arr.join(",");
}
function addClojure(arr, nfa) {
    for (var i = 0; i < arr.length; i++) {
        addAllUnique(arr, nfa[arr[i]][""]);
    }
}
function faOfNFA(nfa) {
    var map = {};
    var initial = [0];
    addClojure(initial, nfa);
    var stateNames = [];
    var toVisit = [initial];
    var _loop_1 = function () {
        var current = toVisit.splice(0, 1)[0];
        var alpha = [];
        current.forEach(function (x) {
            Object.keys(nfa[x]).forEach(function (a) {
                if (a !== "" && alpha.indexOf(a) < 0)
                    alpha.push(a);
            });
        });
        var name_1 = arrayToString(current);
        if (stateNames.indexOf(name_1) < 0)
            stateNames.push(name_1);
        var cString = stateNames.indexOf(name_1);
        map[cString] = {
            transitions: {},
            accept: current.indexOf(nfa.length - 1) >= 0,
        };
        alpha.forEach(function (a) {
            var collect = [];
            current.forEach(function (s) {
                addAllUnique(collect, nfa[s][a]);
            });
            addClojure(collect, nfa);
            var name = arrayToString(collect);
            if (stateNames.indexOf(name) < 0)
                stateNames.push(name);
            var collectString = stateNames.indexOf(name);
            map[cString].transitions[a] = collectString;
            if (map[collectString] === undefined)
                toVisit.push(collect);
        });
    };
    while (toVisit.length > 0) {
        _loop_1();
    }
    return map;
}
function xor(a, b) {
    return a !== b;
}
function minimize(fa) {
    var classes = [];
    var len = Object.keys(fa).length;
    for (var i = 0; i < len; i++) {
        classes.push([]);
    }
    for (var i = 0; i < len; i++) {
        for (var j = i + 1; j < len; j++) {
            if (xor(fa[i].accept, fa[j].accept)) {
                classes[j][i] = 1;
            }
        }
    }
    var changed = true;
    var pass = 2;
    while (changed) {
        changed = false;
        var _loop_2 = function (i) {
            var _loop_4 = function (j) {
                if (classes[j][i] !== undefined)
                    return "continue";
                var transitionsI = Object.keys(fa[i].transitions);
                var transitionsJ = Object.keys(fa[j].transitions);
                transitionsI
                    .filter(function (x) { return transitionsJ.includes(x); })
                    .forEach(function (x) {
                    var _a = __read(myMin(fa[i].transitions[x], fa[j].transitions[x]), 2), min = _a[0], max = _a[1];
                    var marked = classes[max][min];
                    if (marked !== undefined) {
                        classes[j][i] = pass;
                        changed = true;
                    }
                });
            };
            for (var j = i + 1; j < len; j++) {
                _loop_4(j);
            }
        };
        for (var i = 0; i < len; i++) {
            _loop_2(i);
        }
        pass++;
    }
    // printTable(classes);
    var map = {};
    for (var i = 0; i < len; i++) {
        for (var j = i - 1; j >= 0; j--) {
            if (classes[i][j] === undefined)
                map[i] = j;
        }
    }
    var _loop_3 = function (i) {
        Object.keys(fa[i].transitions).forEach(function (k) {
            var endState = fa[i].transitions[k];
            if (map[endState] !== undefined) {
                fa[i].transitions[k] = map[endState];
            }
        });
    };
    for (var i = 0; i < len; i++) {
        _loop_3(i);
    }
    Object.keys(map).forEach(function (x) {
        delete fa[+x];
    });
}
function myMin(a, b) {
    if (a <= b)
        return [a, b];
    else
        return [b, a];
}
function isPrefix(ar1, ar2) {
    for (var k = 0; k < Math.min(ar1.length, ar2.length); k++) {
        if (ar1[k] !== ar2[k])
            return false;
    }
    return true;
}
function printTable(table) {
    for (var x = 0; x < table.length; x++) {
        var result = "";
        for (var y = 0; y < table[x].length; y++) {
            if (y > 0)
                result += " | ";
            result += table[x][y] || " ";
        }
        console.log(result);
    }
}
function arrayEquals(ar1, ar2) {
    if (ar1.length !== ar2.length)
        return false;
    for (var k = 0; k < ar1.length; k++) {
        if (ar1[k] !== ar2[k])
            return false;
    }
    return true;
}
var RegEx = /** @class */ (function () {
    function RegEx(regexp) {
        var nfa = makeNFA(regexp);
        this.fa = faOfNFA(nfa);
        // console.log(this.fa);
        // console.log(Object.keys(this.fa).length);
        minimize(this.fa);
        // console.log(this.fa);
        // console.log(Object.keys(this.fa).length);
    }
    RegEx.prototype.matches = function (str) {
        var state = 0;
        for (var i = 0; i < str.length; i++) {
            var c = str.charAt(i);
            state = this.fa[state].transitions[c];
            if (state === undefined)
                return false;
        }
        return this.fa[state].accept;
    };
    return RegEx;
}());
// let regexp = "[a-zA-Z0-9]+@[a-zA-Z0-9]+.[a-zA-Z]{2+}";
var regexp = new RegEx("(0|(1|(a|b)))*01");
// let regexp = new RegEx(
//   "(a|(b|c))(a|(b|c))*@(a|(b|c))(a|(b|c))*.(a|(b|c))(a|(b|c))(a|(b|c))*"
// );
console.log(regexp.matches("001001010110101"), true);
console.log(regexp.matches("00100101011010"), false);
console.log(regexp.matches("00"), false);
console.log(regexp.matches("01"), true);
// Today:
// * Minimize
// * Store in files
// * Generate token
// * Syntactic sugar
