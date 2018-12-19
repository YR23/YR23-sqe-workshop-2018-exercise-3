export function Decleartion(left, right) {
    return left +' = '+right+';\n';

}

export function Return(ret) {
    return  'Return '+ret+';';

}

export function Else() {
    return  'else';
}

export function ElseIf(condition) {
    return condition;

}

export function If(condition) {
    return condition;
}

export function While(condition) {
    return condition;

}

export function Assignment(name, value) {
    return name + ' = '+ value + ' ;\n';

}

export function Function(name,args)
{
    var final = '';
    final += 'function ';
    final += name +' (';
    for (var i=0;i<args.length;i++)
    {
        if (i===args.length-1)
            final += args[i]+') ';
        else
            final += args[i]+', ';
    }
    final += '{';
    return final;
}

export function Closer() {
    return ' }';
}

