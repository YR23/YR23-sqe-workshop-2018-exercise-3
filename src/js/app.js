import $ from 'jquery';
import {ParseDataToTableBig} from './code-analyzer';
import * as flowchart from './flowchart';


$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        var args = readArgs($('#args').val());
        var FinalGraph = ParseDataToTableBig(codeToParse,args);
        let TypeToType={opp:'operation',condif:'condition',everyone:'start',condwhile:'condition',return:'operation',checker:'inputoutput'};
        $('#parsedCode').val(CreateTableFromGraph(FinalGraph,TypeToType));
    });
});

function readArgs(val) {
    return val.split('|');
}

function CreateTableFromGraph(FinalGraph,TypeToType) {
    let strpart1  = '';
    let strpart2 = '';

    strpart1 = CreatePart1(FinalGraph,TypeToType);
    strpart2 = CreatePart2(FinalGraph,TypeToType);

    const diagram = flowchart.parse(strpart1 +strpart2);
    diagram.drawSVG('diagram', {
        'x': 0,
        'y': 0,
        'line-width': 3, 'line-length': 50, 'text-margin': 10, 'font-size': 14,
        'font-color': 'black', 'line-color': 'black', 'element-color': 'black', 'fill': 'white',
        'yes-text': 'T', 'no-text': 'F', 'arrow-end': 'block', 'scale': 1, 'flowstate' : {
            'true' : { 'fill' : '#005a02', 'font-size' : 12},
            'false' : { 'fill' : '#ff000c'},
        }
    });
    return strpart1+'\n\n'+strpart2;
}

function CreatePart1(FinalGraph,TypeToType) {
    let str = '';

    for (let i=0;i<FinalGraph.length;i++)
        str +=FinalGraph[i].name +'=>'+TypeToType[FinalGraph[i].type]+': '+FinalGraph[i].text +'|'+FinalGraph[i].True+'\n';
    return str;
}

function DoIfnum1Part2(FinalGraph,i,str) {
    if (FinalGraph[i].type != 'return')
        if (FinalGraph[i].nextT != '') {
            if (FinalGraph[i].nextT.substr(0,7) == 'checker') str += FinalGraph[i].name + '(bottom)->' + FinalGraph[i].nextT + '\n' ;
            else if (FinalGraph[i].type == 'everyone') str += FinalGraph[i].name + '(right)->' + FinalGraph[i].nextT + '\n' ;
            else str += FinalGraph[i].name + '(bottom)->' + FinalGraph[i].nextT + '\n';
        }
    return str;
}

function DoIfnum2Part2(FinalGraph,i,str) {
    if (FinalGraph[i].nextF != '' || FinalGraph[i].nextT != '') {
        if (FinalGraph[i].nextT != '') str += FinalGraph[i].name + '(yes,right)->' + FinalGraph[i].nextT + '\n';
        if (FinalGraph[i].nextF != '') str += FinalGraph[i].name + '(no,bottom)->' + FinalGraph[i].nextF + '\n';
    }
    return str;
}

function CreatePart2(FinalGraph) {
    let str = '';
    for (let i=0;i<FinalGraph.length;i++) {
        if (FinalGraph[i].next != '') str += FinalGraph[i].name + '->' + FinalGraph[i].next + '\n' ;
        if (FinalGraph[i].type != 'condif' && FinalGraph[i].type != 'condwhile') {
            str = DoIfnum1Part2(FinalGraph,i,str);
        }
        else {
            str = DoIfnum2Part2(FinalGraph,i,str);
        }
    }
    return str;
}

