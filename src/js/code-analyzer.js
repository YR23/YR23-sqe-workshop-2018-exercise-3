import * as esprima from 'esprima';
import * as GraphCreator from './Part3';

export {
    parseCode,ParseDataToTable,ParseDataToTableBig
};

let op = [];
let every = 0;
let condif = 0;
let condwhile = 0;
let converter;
let RealVals = {};
let ArgsDic = {};
let ArgsBefore = [];
let graph = [];
let stackCameFrom = ['heyyyyy|T'];
let stackEvery = [];
let stackWasReached = [];
let stackLastIf = [];
let stackConnectContinue = [];


function ParseDataToTableBig(codeToParse,args) {
    op = [];every = 0;condif = 0;condwhile = 0;
    stackLastIf = [true];
    graph = [];
    stackCameFrom = ['heyyyyy|T'];
    stackEvery = [];
    stackWasReached = [];
    stackConnectContinue = [];
    let Code = parseCode(codeToParse);
    ArgsBefore = args;
    let FinalCode = ParseDataToTable(Code);
    return FinalCode;
}

const parseCode = (codeToParse) => {
    op = [];
    condif = 0;every = 0;condwhile = 0;
    RealVals = {};
    stackWasReached = [true];
    stackConnectContinue = [];
    graph = [];
    stackLastIf = [true];
    stackCameFrom = ['heyyyyy|T'];
    ArgsBefore = [];
    stackEvery = [];
    CreateConverter();
    let ep = esprima.parseScript(codeToParse);
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
    for (let i = 0;i<ArgsBefore.length;i++) {
        let splited = ArgsBefore[i].split('=');args[i] = splited[0];
        splited[0] = splited[0].trim();
        if (splited[1].includes('[')) {
            let mySubString = splited[1].substring(splited[1].lastIndexOf('[') + 1, splited[1].lastIndexOf(']'));
            let splited_array = mySubString.split(',');
            for (let j=0;j<splited_array.length;j++)
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

function GetMeOppNum(opp)
{
    return parseInt(opp.substr(3));
}

function FindLatestOpp() {
    for (let i=graph.length-1;i>0;i--)
    {
        if (graph[i]['name'].substr(0,3)=='opp')
            return graph[i]['name'];
    }
}

function DoConnectToOpps(start,end,i) {
    if (GetMeOppNum(graph[i]['name'])>start && GetMeOppNum(graph[i]['name'])<=end)
        if (graph[i]['nextT'] == '')
            graph[i]['nextT'] = 'everyone'+every;
}

function ConnectOppsToEvrey(lastOpp) {

    let start = GetMeOppNum(lastOpp);
    let end = GetMeOppNum(FindLatestOpp());
    for (let i=0;i<graph.length;i++)
    {
        if (graph[i]['name'].substr(0,3)=='opp')
            DoConnectToOpps(start,end,i);
    }
}

function InitLastPop() {
    return 'heyyyyy|T'.split('|');

}


function GetMeEveryNum(opp)
{
    return parseInt(opp.substr(8));
}
function ConnectTheEveries() {
    let start = 0;
    let end = every;
    for (let i=0;i<graph.length;i++)
    {
        if (graph[i]['name'].substr(0,8)=='everyone')
            if (GetMeEveryNum(graph[i]['name'])>=start && GetMeEveryNum(graph[i]['name'])<end)
                graph[i]['nextT'] = 'everyone'+end;
    }
}

function DoIfBlock(lastPop,counter,i,expression){
    graph.push({text: '', next: '', True: '', type: '', nextT: '', nextF: ''});
    if (expression.body[i].type=='IfStatement') {
        graph[graph.length - 1]['name'] = 'condif' + condif;if (op.length==0) stackEvery.push('opp0'); else stackEvery.push('opp'+op[op.length-1]);}
    if (expression.body[i].type=='WhileStatement') {
        graph[graph.length - 1]['name'] = 'condwhile' + condwhile; stackEvery.push('opp'+op[op.length-1]);}
}

function DoElse1Block() {
    graph.push({text: '', next: '', True: '', type: '', nextT: '', nextF: ''});
    op.push(op.length);
    graph[graph.length-1]['name'] = 'opp'+op[op.length-1];
    stackCameFrom.push('opp'+op[op.length-1]+'|T');
}

function DoElse2Block(lastOpp) {
    if (lastOpp != undefined) {
        graph.push({text: '', next: '', True: '', type: '', nextT: '', nextF: ''});
        let bool = stackLastIf[stackLastIf.length-1];
        SetGraph2(graph.length - 1, 'continue', bool, 'everyone', 'everyone' + every);
        ConnectOppsToEvrey(lastOpp);
        stackCameFrom = [];
        stackCameFrom.push('everyone' + every+'|T');
        if (every==0)
            stackConnectContinue.push('everyone' + every);
        if (stackEvery.length==0)
            ConnectTheEveries();
        every++;}
}

function DoElse3Block(lastPop,counter,expression,i) {
    if (counter==0 && expression.body[i].type!='FunctionDeclaration' && expression.body[i].type!='ReturnStatement') {

        DoElse1Block();
    }
}

function ParseBlockStatement(expression)
{
    var counter =0;
    var lastPop;
    for (var i=0;i<expression.body.length;i++)
    {
        lastPop = InitLastPop();
        if (SeqStop(expression.body[i])) {
            counter =0;
            lastPop = stackCameFrom.pop().split('|');
            graph.push({text: '', next: '', True: '', type: '', nextT: '', nextF: ''});
            if (expression.body[i].type=='IfStatement') {
                graph[graph.length - 1]['name'] = 'condif' + condif;
                if (op.length==0)
                    stackEvery.push('opp0');
                else
                    stackEvery.push('opp'+op[op.length-1]);
            }
            if (expression.body[i].type=='WhileStatement') {
                graph[graph.length - 1]['name'] = 'condwhile' + condwhile;
                stackEvery.push('opp'+op[op.length-1]);
            }
        }
        else {
            if (counter==0 && expression.body[i].type!='FunctionDeclaration' && expression.body[i].type!='ReturnStatement') {
                lastPop = stackCameFrom.pop().split('|');
                graph.push({text: '', next: '', True: '', type: '', nextT: '', nextF: ''});
                counter++;
                op.push(op.length);
                graph[graph.length-1]['name'] = 'opp'+op[op.length-1];
                stackCameFrom.push('opp'+op[op.length-1]+'|T');
            }
        }
        SetNextByName(lastPop[0],graph[graph.length-1]['name'],lastPop[1]);
        ParseDataToTable(expression.body[i]);
        var lastOpp = undefined;
        if (expression.body[i].type=='IfStatement' || expression.body[i].type=='WhileStatement')
            lastOpp = stackEvery.pop();
        if (lastOpp != undefined)
        {
            graph.push({text: '', next: '', True: '', type: '', nextT: '', nextF: ''});
            let bool = stackLastIf[stackLastIf.length-1];
            SetGraph2(graph.length - 1, 'continue', bool, 'everyone', 'everyone' + every);
            ConnectOppsToEvrey(lastOpp);
            stackCameFrom = [];
            stackCameFrom.push('everyone' + every+'|T');
            if (every==0)
                stackConnectContinue.push('everyone' + every);
            //if (stackEvery.length==0)
                //ConnectTheEveries();
            every++;
        }


    }}

function ParseVariableDeclaration(expression)
{
    for (let i=0;i<expression.declarations.length;i++)
    {
        ParseDataToTable(expression.declarations[i]);
    }
}

function KindOfOpearion(name, operator, value) {
    if (operator == '!=')
        return name != value;
    return name == value;
}
/*
function CheckIfOpeatorIsEq(operator) {
    return (operator == '==' || operator == '===' || operator == '!=');
}
*/
function WhatToReturn(name, operator, value) {
    if (Number.isInteger(name) && Number.isInteger(value))
        return eval(name+operator+value);
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

function ParseVariableDeclarator(expression)
{
    let real = ParseForReal(expression.init);
    let right = ParseDataToTable(expression.init);
    let left = ParseDataToTable(expression.id);
    let IsPerformed = Peek(stackLastIf) && Peek(stackWasReached);
    if (IsPerformed)
        RealVals[expression.id.name] = real;
    SetGraph(graph.length-1,GraphCreator.Decleartion(left,right),IsPerformed,'opp');
}

function ParseExpressionStatement(expression)
{
    ParseDataToTable(expression.expression);
}


function ParseAssignmentExpression(expression)
{

    let left = ParseDataToTable(expression.left);
    let right = ParseDataToTable(expression.right);
    let bool = Peek(stackWasReached) && Peek(stackLastIf);
    if(bool)
        RealVals[left] = ParseForReal(expression.right);
    SetGraph2(graph.length-1,GraphCreator.Assignment(left,right),bool,'opp','opp'+op[op.length-1]);
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
    let name = (ParseDataToTable(expression.left));
    let operator = expression.operator;
    let value = (ParseDataToTable(expression.right));
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
    let condition = ParseDataToTable(expression.test);
    let ShouldICheckMySelf =  Peek(stackWasReached) && Peek(stackLastIf);
    SetGraph2(graph.length - 1, GraphCreator.While(condition),ShouldICheckMySelf, 'condwhile', 'condwhile' + condwhile); //the if text
    stackCameFrom.push('condwhile' + condwhile+'|T');
    let lastCondwhile = condwhile;
    condwhile++;
    stackWasReached.push(ShouldICheckMySelf);
    stackLastIf.push(CheckForCondition(expression.test));
    ParseDataToTable(expression.body);
    stackWasReached.pop();
    stackLastIf.pop();
    SetNextByName('condwhile'+lastCondwhile,'everyone'+every,'F');
}

function CheckForCondition(condition) {
    return ParseForReal(condition);
}

function SetNextByName(name,next,bool) {
    for (let i=0;i<graph.length;i++)
    {
        if (graph[i]['name'] == name)
            graph[i]['next'+bool] = next;
    }
}

function Peek(s)
{
    let res = s.pop();
    s.push(res);
    return res;
}

function DoAlternate(expression,ShouldICheckMySelf,checkForCond,lastCondIf) {
    if (expression.alternate.type==='IfStatement') {
        expression.alternate.type= 'ElseIfStatement';
        stackWasReached.push(ShouldICheckMySelf);
        stackLastIf.push(checkForCond);
        graph.push({text: '', next: '', True: '', type: '', nextT: '', nextF: ''});
        stackCameFrom.pop();
        SetNextByName('condif' + lastCondIf,'condif' +condif ,'F');
        ParseDataToTable(expression.alternate);
        stackLastIf.pop();
        stackWasReached.pop();}
    else {
        stackWasReached.push(ShouldICheckMySelf);
        stackLastIf.push(!checkForCond);
        stackCameFrom.push('condif' + lastCondIf + '|F');
        ParseDataToTable(expression.alternate);
        stackLastIf.pop();
        stackWasReached.pop();
        SetGraph2(graph.length - 1, '', ShouldICheckMySelf && !(checkForCond), 'opp', 'opp' + op[op.length - 1]);}
}

function DoSomeIf(expression,ShouldICheckMySelf,checkForCond) {
    stackWasReached.push(ShouldICheckMySelf);
    stackLastIf.push(checkForCond);
    ParseDataToTable(expression.consequent);
    stackLastIf.pop();
    stackWasReached.pop();
}

function ParseIfStatement(expression)
{
    var condition = ParseDataToTable(expression.test);
    var type = expression.type == 'IfStatement'; var ShouldICheckMySelf;
    if (type) {
        ShouldICheckMySelf = Peek(stackWasReached) && Peek(stackLastIf);
        SetGraph2(graph.length - 1, GraphCreator.If(condition),ShouldICheckMySelf, 'condif', 'condif' + condif); //the if text
    }
    else {
        ShouldICheckMySelf = Peek(stackWasReached) && !Peek(stackLastIf);
        SetGraph2(graph.length - 1, GraphCreator.ElseIf(condition),ShouldICheckMySelf, 'condif', 'condif' + condif); //the if text
    }
    var lastCondIf = condif;
    stackCameFrom.push('condif' + condif+'|T');
    condif++;
    var checkForCond = CheckForCondition(expression.test);
    stackWasReached.push(ShouldICheckMySelf);
    stackLastIf.push(checkForCond);
    ParseDataToTable(expression.consequent);
    stackLastIf.pop();
    stackWasReached.pop();
    if (expression.alternate != null) {
        if (expression.alternate.type==='IfStatement') {
            expression.alternate.type= 'ElseIfStatement';
            stackWasReached.push(ShouldICheckMySelf);
            stackLastIf.push(checkForCond);
            graph.push({text: '', next: '', True: '', type: '', nextT: '', nextF: ''});
            stackCameFrom.pop();
            SetNextByName('condif' + lastCondIf,'condif' +condif ,'F');
            ParseDataToTable(expression.alternate);
            stackLastIf.pop();
            stackWasReached.pop();}
        else {
            stackWasReached.push(ShouldICheckMySelf);
            stackLastIf.push(!checkForCond);
            stackCameFrom.push('condif' + lastCondIf + '|F');
            ParseDataToTable(expression.alternate);
            stackLastIf.pop();
            stackWasReached.pop();
            SetGraph2(graph.length - 1, '', ShouldICheckMySelf && !(checkForCond), 'opp', 'opp' + op[op.length - 1]);
        }
    }
    else
    {
        SetNextByName('condif'+lastCondIf,'everyone'+every,'F');
    }
}


function ParseMemberExpression(expression)
{
    return ParseDataToTable(expression.object) +'[' + ParseDataToTable(expression.property) + ']';
}

function ParseReturnStatement(expression)
{

    let ret;
    if (expression.argument!=null)
        ret = ParseDataToTable(expression.argument);
    else
        ret = '';
    graph.push({text:'',next:'',True:'',type:'',nextT:'',nextF:''});
    SetGraph2(graph.length-1,GraphCreator.Return(ret),true,'return','return0');
    let lastPop = stackCameFrom.pop().split('|');
    SetNextByName(lastPop[0],graph[graph.length-1]['name'],lastPop[1]);

}

function ParseUnaryExpression(expression)
{
    return expression.operator + ParseDataToTable(expression.argument);
}
