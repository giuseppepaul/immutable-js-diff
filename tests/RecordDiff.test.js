'use strict';

var diff = require('../src/diff');
var Immutable = require('immutable');
var assert = require('assert');

describe('Record diffs', function(){
    it('diffs simple records', function(){
        var simpleRecord = Immutable.Record({ a: 1, b: 'hello', c: true });
        var a = simpleRecord();
        var b = simpleRecord({ b: 'dear', c: false });

        var expected = Immutable.fromJS([
            {op: 'replace', path: '/b', value: 'dear'},
            {op: 'replace', path: '/c', value: false},
        ]);

        var result = diff(a, b);

        return assert.ok(Immutable.is(result, expected));
    });

    it('diff complex records', function() {
        var complexRecord = Immutable.Record({
            a: Immutable.Map({ names: Immutable.Map({ first: 'John', second: 'Smith' }), age: 21 }),
            b: Immutable.List([1, 2, 3, 'hi', Immutable.Map({ greeting: 'hello' })])
        });

        var a = complexRecord();
        var b = complexRecord({
            a: Immutable.Map({ names: Immutable.Map({ first: 'Jane', second: 'Smith' }), age: 21 }),
            b: Immutable.List([1, 2, 6, 'hi', Immutable.Map({ greeting: 'there' }) ])
        });

        // Remove the age property from b
        b = b.removeIn(['a', 'age'])

        var expected = Immutable.fromJS([
            {op: 'replace', path: '/a/names/first', value: 'Jane'},
            {op: 'remove', path: '/a/age'},
            {op: 'replace', path: '/b/2', value: 6},
            {op: 'replace', path: '/b/4/greeting', value: 'there'},
        ]);

        var result = diff(a, b);

        return assert.ok(Immutable.is(result, expected));
    });

    it('diffs complex nested records', function(){

        var namesRecord = Immutable.Record({ first: 'Bob', second: 'Smith' });
        var bioRecord = Immutable.Record({ age: 0, nationality: 'en', hobbies: Immutable.List([]) });
        var personRecord = Immutable.Record({ names: namesRecord(), info: bioRecord() });

        const a = personRecord({ info: bioRecord({ hobbies: Immutable.List(['football']) }) });
        const b = personRecord({
            names: namesRecord({ first: 'Jim', second: 'Bob' }),
            info: bioRecord({ age: 12, nationality: 'it', hobbies: Immutable.List(['football', 'chess']) })
        })

        var expected = Immutable.fromJS([
            {op: 'replace', path: '/names/first', value: 'Jim'},
            {op: 'replace', path: '/names/second', value: 'Bob'},
            {op: 'replace', path: '/info/age', value: 12},
            {op: 'replace', path: '/info/nationality', value: 'it'},
            {op: 'add', path: '/info/hobbies/1', value: 'chess'},
        ]);

        var result = diff(a, b);
        return assert.ok(Immutable.is(result, expected));
    });
});