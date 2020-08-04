"use strict";

const data = [
    {
        col: "abc",
    },
    {
        col: "ok 123"
    },
    {
        col: "last col"
    }
];

let {outputResults, processArgs} = require('../src');

test('Test CLI is called', () => {

    const testFunction = jest.fn(outputResults({rowHeadings: ["col"]}, data));
    testFunction();
    expect(testFunction).toHaveBeenCalledTimes(1);
});

test('CLI should return nothing', () => {
    global.app = {
        args: {
            b: false
        }
    };
    expect(outputResults({rowHeadings: ["col"]}, data)).toBeUndefined();
});

test('CLI should stop multiple commands being entered', () => {

    global.app.args._ = ['rs', 'repo'];

    try {
        processArgs();
    } catch (e) {
        expect(e.message).toBe('Only enter one command at a time');
    }
});