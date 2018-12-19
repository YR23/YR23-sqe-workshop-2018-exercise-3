import $ from 'jquery';
import {ParseDataToTableBig} from './code-analyzer';



$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        var args = readArgs($('#args').val());
        var FinalGraph = ParseDataToTableBig(codeToParse,args);
        let TypeToType={opp:'operation',condif:'condition',everyone:'start',confwhile:'inputoutput',return:'operation'};
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
        'line-width': 3,
        'line-length': 50,
        'text-margin': 10,
        'font-size': 14,
        'font-color': 'black',
        'line-color': 'black',
        'element-color': 'black',
        'fill': 'white',
        'yes-text': 'T',
        'no-text': 'F',
        'arrow-end': 'block',
        'scale': 1,
        // style symbol types

        // even flowstate support ;-)
        'flowstate' : {
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

function CreatePart2(FinalGraph) {
    let str = '';

    for (let i=0;i<FinalGraph.length;i++) {
        if (FinalGraph[i].type != 'condif') {
            if (FinalGraph[i].type != 'return')
                if (FinalGraph[i].nextT != '')
                    str += FinalGraph[i].name + '->' + FinalGraph[i].nextT + '\n';
        }
        else {
            if (FinalGraph[i].nextF != '' || FinalGraph[i].nextT != '') {
                if (FinalGraph[i].nextF != '')
                    str += FinalGraph[i].name + '(no)->' + FinalGraph[i].nextF + '\n';
                if (FinalGraph[i].nextT != '')
                    str += FinalGraph[i].name + '(yes)->' + FinalGraph[i].nextT + '\n';
            }
        }
    }
    return str;
}

