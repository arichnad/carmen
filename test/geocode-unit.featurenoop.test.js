// Under certain conditions (feature with null or empty text) it will
// skip indexing but may still be rendered to a vector tile. Tests that
// these features miss loading but noop gracefully.

var tape = require('tape');
var Carmen = require('..');
var index = require('../lib/index');
var mem = require('../lib/api-mem');
var addFeature = require('../lib/util/addfeature');

var conf = {
    a: new mem(null, function() {}),
};
var c = new Carmen(conf);
tape('index', function(t) {
    addFeature.vt(conf.a, {
        _id:1,
        _text:'\n',
        _zxy:['6/32/32'],
        _center:[0,0]
    }, t.end);
});
tape('reverse geocode', function(t) {
    c.geocode('0,0', { limit_verify:1 }, function(err, res) {
        t.ifError(err);
        t.deepEqual(res.features.length, 0);
        t.end();
    });
});

tape('index.teardown', function(assert) {
    index.teardown();
    assert.end();
});
