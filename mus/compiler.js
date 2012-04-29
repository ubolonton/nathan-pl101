// -*- js-indent-level: 4 -*-

// TODO: Accept a file

var endTime = function (time, expr) {
    function duration(expr) {
        switch (expr.tag) {
        case "note":
            return expr.dur;
        case "rest":
            return expr.dur;
        case "seq":
            return duration(expr.left) + duration(expr.right);
        case "par":
            var l = duration(expr.left);
            var r = duration(expr.right);
            return l > r ? l : r;
        case "repeat":
            return expr.count * duration(expr.section);
        }
    }
    return time + duration(expr);
};

var compile = function (musexpr) {
    var result = [];
    function walk(start, expr) {
        switch (expr.tag) {
        case "note":
            result.push({
                tag: "note", pitch: expr.pitch,
                start: start, dur: endTime(start, expr) - start
            });
            break;
        case "rest":
            result.push({
                tag: "rest",
                start: start, dur: endTime(start, expr) - start
            });
            break;
        case "seq":
            walk(start, expr.left);
            walk(endTime(start, expr.left), expr.right);
            break;
        case "par":
            walk(start, expr.left);
            walk(start, expr.right);
            break;
        case "repeat":
            var startTime = start;
            for (var i = 0; i < expr.count; i++) {
                walk(startTime, expr.section);
                startTime = endTime(startTime, expr.section);
            }
        }
    }
    walk(0, musexpr);
    return result;
};

var melody_mus = {
    tag: 'seq',
    left: {
        tag: 'seq',
        left: { tag: 'note', pitch: 'a4', dur: 250 },
        right: {
            tag: 'seq',
            left: {
                tag: 'repeat', count: 3,
                section: { tag: 'note', pitch: 'e4', dur: 150 }},
            right: { tag: 'note', pitch: 'b4', dur: 250 }} },
    right: {
        tag: 'seq',
        left: {
            tag: 'seq',
            left: { tag: 'note', pitch: 'c4', dur: 500 },
            right: { tag: 'rest', dur: 100}},
        right: { tag: 'note', pitch: 'd4', dur: 500 } } };

console.log(melody_mus);
console.log(compile(melody_mus));
