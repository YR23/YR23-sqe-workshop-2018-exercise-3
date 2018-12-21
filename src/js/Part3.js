export function Decleartion(left, right) {
    return left +' = '+right+';\n';

}

export function Return(ret) {
    return  'Return '+ret+';';

}


export function ElseIf(condition) {
    return 'ElseIf:\n '+condition;

}

export function If(condition) {
    return 'If:\n'+condition;
}

export function While(condition) {
    return 'While:\n'+condition;

}

export function Assignment(name, value) {
    return name + ' = '+ value + ' ;\n';

}
