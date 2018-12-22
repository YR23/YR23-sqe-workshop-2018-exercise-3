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

describe('Cheking IF Function', () => {
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

describe('Cheking IF Function: using If and Else only', () => {
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

describe('Cheking IF Function: using If and ElseIf and Else', () => {
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

describe('Cheking IF Function: nested If', () => {
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
    var TestedInput = 'function foo(x){\n' +
        'let a=0;\n' +
        'return -1;\n' +
        '}';
    var input = ParseMyInput('x=1');
    var result = parser.ParseDataToTableBig(TestedInput,input);
    it('total', () => {
        assert.equal(result.length,2);
    });
    it('count Greens', () => {
        var counter = Count(result,true);
        assert.equal(counter,2);
    });
    it('count Reds', () => {
        var counter = Count(result,false);
        assert.equal(counter,0);
    });
});

//** 7 **//
describe('Now Checking just Member exp', () => {
    var TestedInput = 'function foo(x){\n' +
        'let a=0;\n' +
        'return z[0];\n' +
        '}';
    var input = ParseMyInput('x=1|y=2|z=[1,2]');
    var result = parser.ParseDataToTableBig(TestedInput,input);
    it('total', () => {
        assert.equal(result.length,2);
    });
    it('count Greens', () => {
        var counter = Count(result,true);
        assert.equal(counter,2);
    });
    it('count Reds', () => {
        var counter = Count(result,false);
        assert.equal(counter,0);
    });


});

//** 8 **//
describe('Now Checking Strings ', () => {
    var TestedInput = 'function foo(x,y){\n' +
        'let a=0;\n' +
        'return x;\n' +
        '}';
    var input = ParseMyInput('x="hello"|y=2');
    var result = parser.ParseDataToTableBig(TestedInput,input);
    it('total', () => {
        assert.equal(result.length,2);
    });
    it('count Greens', () => {
        var counter = Count(result,true);
        assert.equal(counter,2);
    });
    it('count Reds', () => {
        var counter = Count(result,false);
        assert.equal(counter,0);
    });
});

//** 9 **//
describe('Now Checking regular while ', () => {
    var TestedInput = 'function foo(x){\n' +
        'let a=0;\n' +
        'while (x==2) {x=x}\n' +
        'return -1;\n' +
        '}';
    var input = ParseMyInput('x=1');
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

//** 10 **//
describe('Checking while function with if inside ', () => {
    var TestedInput = 'function foo(x){\n' +
        'let a=0;\n' +
        'while (x==2) {if (x==1){x=x}}\n' +
        'return -1;\n' +
        '}';
    var input = ParseMyInput('x=1');
    var result = parser.ParseDataToTableBig(TestedInput,input);
    it('total', () => {
        assert.equal(result.length,7);
    });
    it('count Greens', () => {
        var counter = Count(result,true);
        assert.equal(counter,4);
    });
    it('count Reds', () => {
        var counter = Count(result,false);
        assert.equal(counter,3);
    });

});

//** 11 **//
describe('Checking while function with if else inside ', () => {
    var TestedInput = 'function foo(x){\n' +
        'let a=0;\n' +
        'while (x==2) {if (x==1){x=x}else{a=a}}\n' +
        'return -1;\n' +
        '}';
    var input = ParseMyInput('x=1');
    var result = parser.ParseDataToTableBig(TestedInput,input);
    it('total', () => {
        assert.equal(result.length,8);
    });
    it('count Greens', () => {
        var counter = Count(result,true);
        assert.equal(counter,4);
    });
    it('count Reds', () => {
        var counter = Count(result,false);
        assert.equal(counter,4);
    });

});

//** 12 **//
describe('Now that if -> opperation -> if', () => {
    var TestedInput = 'function foo(x){\n' +
        'let a=0;\n' +
        ' if (x==1){x=x; if (x==2) {a=a}}\n' +
        'return -1;\n' +
        '}';
    var input = ParseMyInput('x=1');
    var result = parser.ParseDataToTableBig(TestedInput,input);
    it('total', () => {
        assert.equal(result.length,8);
    });
    it('count Greens', () => {
        var counter = Count(result,true);
        assert.equal(counter,7);
    });
    it('count Reds', () => {
        var counter = Count(result,false);
        assert.equal(counter,1);
    });
});

//** 13 **//
describe('Now Checking strings just to be safe ', () => {
    var TestedInput = 'function foo(x){\n' +
        'let a="hello";\n' +
        'let b = "hello";\n' +
        ' if (a==b){x=x; if (x!=1) {a=a}}\n' +
        'return -1;\n' +
        '}';
    var input = ParseMyInput('x=1');
    var result = parser.ParseDataToTableBig(TestedInput,input);
    it('total', () => {
        assert.equal(result.length,8);
    });
    it('count Greens', () => {
        var counter = Count(result,true);
        assert.equal(counter,7);
    });
    it('count Reds', () => {
        var counter = Count(result,false);
        assert.equal(counter,1);
    });
});

//** 14 **//
describe('Now != with string just to be sure sure  ', () => {
    var TestedInput = 'function foo(x){\n' +
        'let a="hello";\n' +
        'let b = "hello1";\n' +
        ' if (a!=b){x=x; if (x!=1) {a=a}}\n' +
        'return -1;\n' +
        '}';
    var input = ParseMyInput('x=1');
    var result = parser.ParseDataToTableBig(TestedInput,input);
    it('total', () => {
        assert.equal(result.length,8);
    });
    it('count Greens', () => {
        var counter = Count(result,true);
        assert.equal(counter,7);
    });
    it('count Reds', () => {
        var counter = Count(result,false);
        assert.equal(counter,1);
    });
});

//** 15 **//
describe('Now Checkin var dec inside an if that is false ', () => {
    var TestedInput = 'function foo(x){\n' +
        'let a="hello";\n' +
        'let b = "hello1";\n' +
        ' if (a==b){x=x; if (x!=1) {let c=0;}}\n' +
        'return -1;\n' +
        '}';
    var input = ParseMyInput('x=1');
    var result = parser.ParseDataToTableBig(TestedInput,input);
    it('total', () => {
        assert.equal(result.length,8);
    });
    it('count Greens', () => {
        var counter = Count(result,true);
        assert.equal(counter,4);
    });
    it('count Reds', () => {
        var counter = Count(result,false);
        assert.equal(counter,4);
    });
});

//** 16 **//
describe('Now Checkin member inside an if ', () => {
    describe('Now Checkin var dec inside an if that is false ', () => {
        var TestedInput = 'function foo(x,y,z){\n' +
            'let a="hello";\n' +
            'let b = "hello1";\n' +
            ' if (z[0]==3){x=x; if (x!=1) {let c=0;}}\n' +
            'return -1;\n' +
            '}';
        var input = ParseMyInput('x=1|y=2|z=[1,2]');
        var result = parser.ParseDataToTableBig(TestedInput,input);
        it('total', () => {
            assert.equal(result.length,8);
        });
        it('count Greens', () => {
            var counter = Count(result,true);
            assert.equal(counter,4);
        });
        it('count Reds', () => {
            var counter = Count(result,false);
            assert.equal(counter,4);
        });
    });
});

//** 17 **//
describe('Now 2 numbers with addition', () => {
    var TestedInput = 'function foo(x,y,z){\n' +
        'let a=1+1;\n' +
        'let b = "hello1";\n' +
        ' if (a==3){x=x; if (x!=1) {let c=0;}}\n' +
        'return -1;\n' +
        '}';
    var input = ParseMyInput('x=1|y=2|z=[1,2]');
    var result = parser.ParseDataToTableBig(TestedInput,input);
    it('total', () => {
        assert.equal(result.length,8);
    });
    it('count Greens', () => {
        var counter = Count(result,true);
        assert.equal(counter,4);
    });
    it('count Reds', () => {
        var counter = Count(result,false);
        assert.equal(counter,4);
    });
});

//** 18 **//
describe('Empty Return ', () => {
    var TestedInput = 'function foo(x,y,z){\n' +
        'let a=1+1;\n' +
        'let b = "hello1";\n' +
        ' if (a==3){x=x; if (x!=1) {let c=0;}}\n' +
        'return ;\n' +
        '}';
    var input = ParseMyInput('x=1|y=2|z=[1,2]');
    var result = parser.ParseDataToTableBig(TestedInput,input);
    it('total', () => {
        assert.equal(result.length,8);
    });
    it('count Greens', () => {
        var counter = Count(result,true);
        assert.equal(counter,4);
    });
    it('count Reds', () => {
        var counter = Count(result,false);
        assert.equal(counter,4);
    });
});

//** 19 **//
describe('complex situation ', () => {
    var TestedInput = 'function YR (x) {\n' +
        'let a=0;\n' +
        'let b=1;\n' +
        'if (x==2)\n' +
        '   {\n' +
        '    x = 2;\n' +
        '    if (x==2)\n' +
        '   { a = a; }\n' +
        '    else if (x==1)\n' +
        '   { b = b; }\n' +
        '   let f=1;\n' +
        '   b=f;\n' +
        '   }\n' +
        'else if (x==1)\n' +
        '   { x = x}\n' +
        'else\n' +
        '   { a = a }\n' +
        'return 3;\n' +
        '}';
    var input = ParseMyInput('x=2');
    var result = parser.ParseDataToTableBig(TestedInput,input);
    it('total', () => {
        assert.equal(result.length,14);
    });
    it('count Greens', () => {
        var counter = Count(result,true);
        assert.equal(counter,9);
    });
    it('count Reds', () => {
        var counter = Count(result,false);
        assert.equal(counter,5);
    });
});
