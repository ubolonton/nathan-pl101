// -*- js-indent-level: 4 -*-

// TODO: Accept a file

var endTime = function (time, expr) {
    function duration(expr) {
        switch (expr.tag) {
        case "note":
            return expr.dur;
        case "seq":
            return duration(expr.left) + duration(expr.right);
        case "par":
            var l = duration(expr.left);
            var r = duration(expr.right);
            return l > r ? l : r;
        }
        if (expr.tag === 'note')
            return expr.dur;
    }
    return time + duration(expr);
};

var compile = function (musexpr) {
    var result = [];
    function walk(start, expr) {
        switch (expr.tag) {
        case "seq":
            walk(start, expr.left);
            walk(endTime(start, expr.left), expr.right);
            break;
        case "par":
            walk(start, expr.left);
            walk(start, expr.right);
            break;
        case "note":
            result.push({
                tag: "note", pitch: expr.pitch,
                start: start, dur: endTime(start, expr) - start
            });
            break;
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
        right: { tag: 'note', pitch: 'b4', dur: 250 } },
    right: {
        tag: 'seq',
        left: { tag: 'note', pitch: 'c4', dur: 500 },
        right: { tag: 'note', pitch: 'd4', dur: 500 } } };

console.log(melody_mus);
console.log(compile(melody_mus));
