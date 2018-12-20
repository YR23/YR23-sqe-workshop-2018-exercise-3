import * as esprima from 'esprima';
import * as StringCreator from './Part2';
import * as GraphCreator from './Part3';

export {
    parseCode,ParseDataToTable,ParseDataToTableBig
};
var lastIF = true;
var startingop=0;
var op = [];
var every = 0;
var condif = 0;
var condwhile = 0;
var converter;
var RealVals = {};
var ArgsDic = {};
var ArgsBefore = [];
var Do = true;
var elseDo = true;
var graph = [];
var stack = [];
var stack2 = [true];
var stack3 = [];
var connectEvery = [];
var stackWasReached = [];
var stackLastIf = [];


function ParseDataToTableBig(codeToParse,args) {
    op = [];
    every = 0;
    condif = 0;
    condwhile = 0;
    stack = [];
    stack2 = [true];
    stackLastIf = [true];
    stack3 = [];
    Do = true;
    elseDo = true;
    graph = [];
    lastIF = true;
    connectEvery = [];
    stackWasReached = [];
    let Code = parseCode(codeToParse);
    ArgsBefore = args;
    let FinalCode = ParseDataToTable(Code);
    return FinalCode;
}

const parseCode = (codeToParse) => {
    op = [];
    condif = 0;
    every = 0;
    condwhile = 0;
    stack = [];
    RealVals = {};
    stackWasReached = [true];
    lastIF = true;
    Do = true;
    graph = [];
    stack2 = [true];
    stackLastIf = [true];
    stack3 = [];
    ArgsBefore = [];
    connectEvery = [];
    CreateConverter();
    var ep = esprima.parseScript(codeToParse);
    return ep;
};

function CreateConverter()
{
    converter = new Map();
    converter.set('FunctionDeclaration','function Declaration');
    converter.set('Identifier','variable declaration');
    converter.set('VariableDeclarator','variable declaration');
    converter.set('AssignmentExpression', 'assignment expression');
    converter.set('WhileStatement', 'while statement');
    converter.set('IfStatement', 'if statement');
    converter.set('ElseIfStatement', 'else if statement');
    converter.set('ElseStatement','else statement');
    converter.set('ReturnStatement','return statement');
    converter.set('ForStatement','for statement');
}

function CotinueSwitchCase4(expression) {
    switch (expression.type) {
    case('UnaryExpression'):
        return ParseUnaryExpression(expression);

    }
}

function CotinueSwitchCase3(expression) {
    switch (expression.type)
    {
    case('MemberExpression'):
        return ParseMemberExpression(expression);
    case('ElseIfStatement'):
        ParseIfStatement(expression);
        break;
    case('ReturnStatement'):
        ParseReturnStatement(expression);
        break;
    default:
        return CotinueSwitchCase4(expression);}
}

function CotinueSwitchCase2(expression) {
    switch (expression.type)
    {
    case('Literal'):
        return ParseLiteral(expression);
    case('BinaryExpression'):
        return ParseBinaryExpression(expression);
    case('WhileStatement'):
        ParseWhileStatement(expression);
        break;
    case('IfStatement'):
        ParseIfStatement(expression);
        break;
    default:
        return CotinueSwitchCase3(expression);}
}

function CotinueSwitchCase(expression) {
    switch (expression.type)
    {
    case('VariableDeclarator'):
        ParseVariableDeclarator(expression);
        break;
    case('ExpressionStatement'):
        ParseExpressionStatement(expression);
        break;
    case('AssignmentExpression'):
        ParseAssignmentExpression(expression);
        break;
    case('Identifier'):
        return ParseIdentifier(expression);
    default:
        return CotinueSwitchCase2(expression);}
}


function ParseDataToTable(expression)
{
    switch (expression.type)
    {
    case ('Program'):
        return ParseProgram(expression);
    case ('FunctionDeclaration'):
        ParseFunction(expression);
        break;
    case('BlockStatement'):
        ParseBlockStatement(expression);
        break;
    case('VariableDeclaration'):
        ParseVariableDeclaration(expression);
        break;
    default:
        return CotinueSwitchCase(expression);}

}


function ParseProgram(expression)
{
    ParseDataToTable(expression.body[0]);
    return graph;
}


function ParseFunction(expression) {
    let args = [];
    for (var i = 0;i<ArgsBefore.length;i++) {
        let splited = ArgsBefore[i].split('=');args[i] = splited[0];
        splited[0] = splited[0].trim();
        if (splited[1].includes('[')) {
            let mySubString = splited[1].substring(splited[1].lastIndexOf('[') + 1, splited[1].lastIndexOf(']'));
            let splited_array = mySubString.split(',');
            for (var j=0;j<splited_array.length;j++)
            {
                ArgsDic[splited[0]+'['+j+']'] = splited_array[j];
                RealVals[splited[0]+'['+j+']'] = splited_array[j];}}
        else {
            ArgsDic[splited[0]] = splited[1];RealVals[splited[0]] = splited[1];}
    }
    ParseDataToTable(expression.body);
}

function SeqStop(exp) {
    return exp.type=='WhileStatement' || exp.type=='IfStatement' || exp.type=='ElseIfStatement';
}

function ParseBlockStatement(expression)
{
    var counter =0;
    for (var i=0;i<expression.body.length;i++)
    {
        if (SeqStop(expression.body[i])) {
            graph.push({text: '', next: '', True: '', type: '', nextT: '', nextF: ''});
            if (graph[graph.length-2]['type'] == 'opp')
            {
                graph[graph.length-2]['name'] = 'opp'+op[op.length-1];}
            else if (graph[graph.length-2]['type'] == 'condif')
            {
                graph[graph.length-1]['name'] = 'condif'+condif;
            }
            else if (graph[graph.length-2]['type'] == 'condwhile')
            {
                graph[graph.length-3]['name'] = 'condwhile'+condwhile;
                condwhile++;
            }
        }
        else {
            if (counter==0 && expression.body[i].type!='FunctionDeclaration') {
                graph.push({text: '', next: '', True: '', type: '', nextT: '', nextF: ''});
                counter++;
                op.push(op.length);
            }
        }
        ParseDataToTable(expression.body[i]);
    }
}

function ParseVariableDeclaration(expression)
{
    for (var i=0;i<expression.declarations.length;i++)
    {
        ParseDataToTable(expression.declarations[i]);
    }
}

function KindOfOpearion(name, operator, value) {
    if (operator == '!=')
        return name != value;
    return name == value;
}

function CheckIfOpeatorIsEq(operator) {
    return (operator == '==' || operator == '===' || operator == '!=');
}

function WhatToReturn(name, operator, value) {
    if (Number.isInteger(name) && Number.isInteger(value))
        return eval(name+operator+value);
    if (CheckIfOpeatorIsEq(operator))
        return KindOfOpearion(name,operator,value);
    //return name +operator+ value; options to show
}

function GetBinary(expression) {
    if (expression.left.type=='BinaryExpression')
        expression.left = ParseForReal(expression.left);
    if (expression.right.type=='BinaryExpression')
        expression.right = ParseForReal(expression.right);
    let name = ParseMeAVar(expression.left);
    let operator = expression.operator;
    let value = ParseMeAVar(expression.right);
    if (!isNaN(name)){ name = parseInt(name);} else {name = name.replace(/'|"|`/g,'');}
    if (!isNaN(value)){ value = parseInt(value);} else {value = value.replace(/'|"|`/g,'');}
    return WhatToReturn(name,operator,value);
}

function ParseForReal(x) {
    if (x.type=='BinaryExpression')
    {
        return  GetBinary(x);
    }
    else
        return ParseMeAVar(x);
}

function SetGraph(i, txt, Do, typer) {
    graph[i]['text'] += txt ;
    graph[i]['True'] = Do;
    graph[i]['type'] = typer;

}

function SetGraph2(i, txt, Do, typer,name) {
    graph[i]['text'] += txt ;
    graph[i]['True'] = Do;
    graph[i]['type'] = typer;
    graph[i]['name'] = name;

}

function SetNext(i,bool ,next)
{
    var letter = '';
    if (bool == true)
        letter='T';
    else
        letter ='F';
    graph[i]['next'+letter] = next ;
}

function ParseVariableDeclarator(expression)
{
    var real = ParseForReal(expression.init);
    var right = ParseDataToTable(expression.init);
    var left = ParseDataToTable(expression.id);
    if (Do)
        RealVals[expression.id.name] = real;
    SetGraph(graph.length-1,GraphCreator.Decleartion(left,right),Do,'opp');
}

function ParseExpressionStatement(expression)
{
    ParseDataToTable(expression.expression);
}


function ParseAssignmentExpression(expression)
{

    var left = ParseDataToTable(expression.left);
    var right = ParseDataToTable(expression.right);
    let bool = Peek(stack2) && CheckFirst(stack2);
    if(bool)
        RealVals[left] = ParseForReal(expression.right);
    SetGraph2(graph.length-1,GraphCreator.Assignment(left,right),bool,'opp','opp'+op[op.length-1]);
    expression=expression;
}

function ParseIdentifier(expression)
{

    return expression.name;
}


function ParseLiteral(expression)
{
    return expression.value;
}

function ParseMeAVar(name)
{
    if (name.type=='MemberExpression') {
        let member = ParseDataToTable(name);
        return RealVals[member];
    }
    if (name.name != null)
        name = name.name;
    if (name.value != null)
        name =   name.value;
    if (RealVals.hasOwnProperty(name))
        return RealVals[name];
    return name;
}

function ParseBinaryExpression(expression)
{
    var name = (ParseDataToTable(expression.left));
    var operator = expression.operator;
    var value = (ParseDataToTable(expression.right));
    if (operator == '*' || operator=='/')
    {
        name = '('+name+')';
        value = '('+value+')';
    }
    if (Number.isInteger(name) && Number.isInteger(value))
        return eval(name+operator+value);
    return name+operator+value;
}

function ParseWhileStatement(expression)
{
    Do = CheckForCondition(expression.test);
    var condition = ParseDataToTable(expression.test);
    ParseDataToTable(expression.body);
}

function CheckForCondition(condition) {
    return ParseForReal(condition);
}

function SetNextByName(name, next,bool) {
    for (var i=0;i<graph.length;i++)
    {
        if (graph[i]['name'] == name)
            graph[i]['next'+bool] = next;
    }

}

function FixNextEveryOne() {
    /*
    var counter =-1;
    for (var i=0;i<graph.length;i++)
    {
        if (graph[i]['name'].substr(0,3)=='opp')
            counter++;
        if (counter>=startingop && counter<op.length)
            SetNextByName('opp'+counter,'everyone'+every,'T');
    }
    */
    for (var i=0;i<connectEvery.length;i++)
        SetNextByName('opp'+connectEvery[i],'everyone'+every,'T');

}

function SetNextForIf(finalIf) {

    for (let i=0; i <graph.length;i++)
    {
        var res = graph[i].name.substr(6);
        if (!isNaN(res)) res=parseInt(res);
        if (finalIf==res)
        {
            graph[i].nextT=graph[i+1].name;
            break;
        }
    }
}

function Peek(s)
{
    var res = s.pop();
    s.push(res);
    return res;
}

function CheckFirst(s)
{
    return s[1];
}

function ParseIfStatement(expression)
{
    var condition = ParseDataToTable(expression.test);
    var type = expression.type == 'IfStatement'; var ShouldICheckMySelf;
    if (type)
        ShouldICheckMySelf =  Peek(stackWasReached) && stackLastIf.pop();
    else
        ShouldICheckMySelf =  Peek(stackWasReached) && !stackLastIf.pop();
    SetGraph2(graph.length - 1, GraphCreator.If(condition),ShouldICheckMySelf, 'condif', 'condif' + condif); //the if text
    condif++;
    stackWasReached.push(ShouldICheckMySelf && CheckForCondition(expression.test));
    stackLastIf.push(CheckForCondition(expression.test));
    ParseDataToTable(expression.consequent);
    var last = stackWasReached.pop();
    let finalIf = stack.pop();SetNextForIf(finalIf);
    if (expression.alternate != null) {
        if (expression.alternate.type==='IfStatement') {
            expression.alternate.type= 'ElseIfStatement';
            stackWasReached.push(last);
            ParseDataToTable(expression.alternate);}
        else {
            SetNextByName('condif'+finalIf,'opp'+op.length,'F');
            stackWasReached.push(last);
            ParseDataToTable(expression.alternate);
            var bool = false;
            if (stack2.length==1) {
                stack2.push(true);
                bool=true;
            }
            SetGraph2(graph.length-1,'',CheckFirst(stack2) && !CheckForCondition(expression.test),'opp','opp'+op[op.length-1]);
            if (bool)
                stack2.pop();
            connectEvery.push(op[op.length-1]);
            if (stackWasReached.length==1) {
                graph.push({text: '', next: '', True: '', type: '', nextT: '', nextF: ''});
                SetGraph2(graph.length - 1, 'continue', true, 'everyone', 'everyone' + every);
                FixNextEveryOne();
                every++;
            }}
    }}


function ParseMemberExpression(expression)
{
    return ParseDataToTable(expression.object) +'[' + ParseDataToTable(expression.property) + ']';
}

function ParseReturnStatement(expression)
{

    var ret;
    if (expression.argument!=null)
        ret = ParseDataToTable(expression.argument);
    else
        ret = '';
    graph.push({text:'',next:'',True:'',type:'',nextT:'',nextF:''});
    SetGraph2(graph.length-1,GraphCreator.Return(ret),true,'return','return0');
    if (graph[graph.length-2]['type'] == 'everyone')
        graph[graph.length-2].nextT =  graph[graph.length-1].name;
}

function ParseUnaryExpression(expression)
{
    return expression.operator + ParseDataToTable(expression.argument);
}
