"use strict";
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
var RegEx = /** @class */ (function () {
    function RegEx(regexp) {
        var nfa = makeNFA(regexp);
        this.fa = faOfNFA(nfa);
        console.log(Object.keys(this.fa).length);
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
var regexp = "[a-zA-Z0-9]+@[a-zA-Z0-9]+.[a-zA-Z]{2+}";
//let regexp = "(0|1)*1";
// let regexp = new RegEx(
//   "(a|(b|c))(a|(b|c))*@(a|(b|c))(a|(b|c))*.(a|(b|c))(a|(b|c))(a|(b|c))*"
// );
var str = "abc@a.ab";
console.log(regexp.matches(str));
