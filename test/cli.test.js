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

let app = {
    args: {
        b: false
    }
};

global.app = app;

let {outputResults} = require('../src');

test('Test cli is called', () => {

    const testFunction = jest.fn(outputResults({rowHeadings: ["col"]}, data));
    testFunction();
    expect(testFunction).toHaveBeenCalledTimes(1);
});

test('Cli should return nothing', () => {
    global.test = true;
    expect(outputResults({rowHeadings: ["col"]}, data)).toBeUndefined();
});