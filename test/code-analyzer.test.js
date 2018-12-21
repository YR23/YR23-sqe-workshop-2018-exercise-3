var assert = require('assert');
import * as parser from '../src/js/code-analyzer';

//* Helping Function */
function Count(graph,type)
{
    var counter = 0;
    for (var i=0;i<graph.length;i++)
    {
        if (graph[i].True == type)
            counter++;
    }
    return counter;

/* End of Helping Functions*/

}


function ParseMyInput(val) {
    return val.split('|');
}

//** 1 **//
describe('Cheking Simple IF', () => {
    var TestedInput = 'function foo(x, y, z){if (x < y) {x=x+1} return -1;}';
    var input = ParseMyInput('x=1|y=2|z=3');
    var result = parser.ParseDataToTableBig(TestedInput,input);
    it('total', () => {         
        assert.equal(result.length,4);
    });
    it('count Greens', () => {
        var counter = Count(result,true);
        assert.equal(counter,4);
    }); 
    it('count Reds', () => {
        var counter = Count(result,false);
        assert.equal(counter,0);
    });
});

//** 2 **//
describe('Cheking Simple IF and Else', () => {
    var TestedInput = 'function foo(x, y, z){if (x < y) {x=x+1} else{y=y+1} return -1;}';
    var input = ParseMyInput('x=1|y=2|z=3');
    var result = parser.ParseDataToTableBig(TestedInput,input);
    it('total', () => {
        assert.equal(result.length,5);
    });
    it('count Greens', () => {
        var counter = Count(result,true);
        assert.equal(counter,4);
    });
    it('count Reds', () => {
        var counter = Count(result,false);
        assert.equal(counter,1);
    });
});

//** 3 **//
describe('Checking simple if and elseif and if', () => {
    var TestedInput = 'function foo(x){\n' +
        '    let a=2;\n' +
        '    if (x < 2) {\n' +
        '        x =  5;\n' +
        '    } else if (x < 3) {\n' +
        '        x =   5;\n' +
        '    } else {\n' +
        '        x= x  + 5;\n' +
        '    }\n' +
        '    \n' +
        '    return z;\n' +
        '}';
    var input = ParseMyInput('x=1|y=2|z=3');
    var result = parser.ParseDataToTableBig(TestedInput,input);
    it('total', () => {
        assert.equal(result.length,8);
    });
    it('count Greens', () => {
        var counter = Count(result,true);
        assert.equal(counter,5);
    });
    it('count Reds', () => {
        var counter = Count(result,false);
        assert.equal(counter,3);
    });
});

//** 4 **//
describe('Checking If inside if ', () => {
    var TestedInput = 'function foo(x, y, z){\n' +
        'if (x < y) {\n' +
        ' x=x+1; \n' +
        'if (x<y){\n' +
        'x=x;\n' +
        '}\n' +
        '} \n' +
        'return -1;}';
    var input = ParseMyInput('x=1|y=2|z=3');
    var result = parser.ParseDataToTableBig(TestedInput,input);
    it('total', () => {
        assert.equal(result.length,7);
    });
    it('count Greens', () => {
        var counter = Count(result,true);
        assert.equal(counter,6);
    });
    it('count Reds', () => {
        var counter = Count(result,false);
        assert.equal(counter,1);
    });
});

//** 5 **//
describe('Aviram Code', () => {
    var TestedInput = 'function foo(x, y, z){\n' +
        '    let a = x + 1;\n' +
        '    let b = a + y;\n' +
        '    let c = 0;\n' +
        '    \n' +
        '    if (b < z) {\n' +
        '        c = c + 5;\n' +
        '    } else if (b < z * 2) {\n' +
        '        c = c + x + 5;\n' +
        '    } else {\n' +
        '        c = c + z + 5;\n' +
        '    }\n' +
        '    \n' +
        '    return c;\n' +
        '}\n';
    var input = ParseMyInput('x=1|y=2|z=3');
    var result = parser.ParseDataToTableBig(TestedInput,input);
    it('total', () => {
        assert.equal(result.length,8);
    });
    it('count Greens', () => {
        var counter = Count(result,true);
        assert.equal(counter,6);
    });
    it('count Reds', () => {
        var counter = Count(result,false);
        assert.equal(counter,2);
    });

});

//** 6 **//
describe('Now Checking just Unary', () => {

});

//** 7 **//
describe('Now Checking just Binary equ', () => {

});

//** 8 **//
describe('Now Checking just Strings ', () => {

});

//** 9 **//
describe('Now Checking declaratin inside false if ', () => {

});

//** 10 **//
describe('Now Checking declaratin inside true if ', () => {

});

//** 11 **//
describe('Now Checking declaratin inside true if ', () => {

});

//** 12 **//
describe('Now Checking declaratin inside false if ', () => {

});

//** 13 **//
describe('Now Checking Member 2 assignment ', () => {

});

//** 14 **//
describe('Now Checking local to local assignment ', () => {

});

//** 15 **//
describe('Now Checkin gother operators ', () => {

});

//** 16 **//
describe('Now Checkin gother continue ', () => {

});

//** 17 **//
describe('Now Else IF with if and else ', () => {

});

//** 18 **//
describe('Empty Return ', () => {

});

//** 19 **//
describe('if mekunan ', () => {

});
