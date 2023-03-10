function getTokenType(token_type) {
    if (["SingleLineComment", "MultiLineComment"].includes(token_type))
        return "comment";
    else if (["This", "With", "Default", "If", "Throw", "Delete", "In", "Try", "As", "From", "Class", "Enum", "Extends", "Super", "Export", "Import", "Async", "Await", "Yield", "Implements", "Private", "Public", "Interface", "Package", "Protected", "Static", "Break", "Do", "Instanceof", "Typeof", "Case", "Else", "New", "Var", "Catch", "Finally", "Return", "Void", "Continue", "For", "Switch", "While", ].includes(token_type))
        return "keyword";
    else if ([ "StringLiteral", "BackTick", "TemplateStringStartExpression", "TemplateStringAtom"].includes(token_type))
        return "string";
    else if (["DecimalLiteral", "HexIntegerLiteral", "OctalIntegerLiteral", "OctalIntegerLiteral2", "BinaryIntegerLiteral", "BigHexIntegerLiteral", "BigOctalIntegerLiteral", "BigBinaryIntegerLiteral", "BigDecimalIntegerLiteral"].includes(token_type))
        return "number";
    else if (["OpenBracket", "CloseBracket", "OpenParen", "CloseParen", "OpenBrace", "CloseBrace", "SemiColon", "Comma", "Assign", "QuestionMark", "QuestionMarkDot", "Colon", "Ellipsis", "Dot", "PlusPlus", "MinusMinus", "Plus", "Minus", "BitNot", "Not", "Multiply", "Divide", "Modulus", "Power", "NullCoalesce", "Hashtag", "RightShiftArithmetic", "LeftShiftArithmetic", "RightShiftLogical", "LessThan", "MoreThan", "LessThanEquals", "GreaterThanEquals", "Equals_", "NotEquals", "IdentityEquals", "IdentityNotEquals", "BitAnd", "BitXOr", "BitOr", "And", "Or", "MultiplyAssign", "DivideAssign", "ModulusAssign", "PlusAssign", "MinusAssign", "LeftShiftArithmeticAssign", "RightShiftArithmeticAssign", "RightShiftLogicalAssign", "BitAndAssign", "BitXorAssign", "BitOrAssign", "PowerAssign", "ARROW"].includes(token_type))
        return "enum";
    else if (["Debugger", "FunctionObject", "StrictLet", "NonStrictLet", "Const"].includes(token_type))
        return "function";
    else if (["Identifier"].includes(token_type))
        return "variable";
    else
        return "other";
}
exports.getTokenType = getTokenType;

const keywords = ['abstract', 'arguments', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class*', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'double', 'else', 'enum*', 'eval', 'export*', 'extends*', 'false', 'final', 'finally', 'float', 'for', 'function', 'goto', 'if', 'implements', 'import*', 'in', 'instanceof', 'int', 'interface', 'let', 'long', 'native', 'new', 'null', 'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'super*', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'true', 'try', 'typeof', 'var', 'void', 'volatile', 'while', 'with', 'yield'];
const keyobjects = ['Array', 'Date', 'Number', 'Object', 'String', 'Infinity', 'NaN'];
const keyfunctions = ['eval', 'hasOwnProperty', 'isFinite', 'isNaN', 'isPrototypeOf', 'length', 'name', 'prototype', 'toString', 'undefined', 'valueOf', 'require', 'eval', 'parseInt'];

exports.keywords = keywords;
exports.keyobjects = keyobjects;
exports.keyfunctions = keyfunctions;

const lib = { console: { functions: ['log', 'warn', 'error', 'info'] }, Math: { variables: ['PI', 'E', 'LN2', 'LN10', 'SQRT2'], functions: ['floor', 'round', 'sin', 'abs', 'cos', 'exp', 'log', 'max', 'min', 'pow', 'tan', 'sqrt'] } }
exports.lib = lib