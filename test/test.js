process.env.NODE_ENV = 'test';

var should = require('should');
var assert = require('assert');
var dash_button = require('../index.js');

var hex = '8f:3f:20:33:54:44';
var int_array = [];

var arp = require('arpjs');
var sendarp = function(){
    arp.send({
    'op': 'request',
    'src_ip': '10.105.50.100',
    'dst_ip': '10.105.50.1',
    'src_mac': hex,
    'dst_mac': 'ff:ff:ff:ff:ff:ff'
    });  
};

startTests = function() {
    before(function(done) {
        done(); 
    });
    it('should correctly convert string hex to decimal array', function(done) {
        int_array = dash_button.hex_to_int_array(hex)
        done(); 
    });
    it('should correctly convert a decimal array to string hex', function(done) {
        dash_button.int_array_to_hex(int_array).should.equal(hex);
        done(); 
    });
    it('should recognize an arp request', function(done) {
        this.timeout(30000);//sometimes the detection takes a while
    	  setTimeout(sendarp, 2500); //giving pcap time to set up a listener   
        dash_button.register(hex).on('detected', function(){
            done();
        });        
    });
    it('should throttle multiple requests', function(done) {
        this.timeout(30000);//sometimes the detection takes a while
    	setInterval(sendarp, 100); //giving pcap time to set up a listener   
        dash_button.register(hex).on('detected', function(){
            done();//done should only be called once.
        });        
    });
}
startTests();

