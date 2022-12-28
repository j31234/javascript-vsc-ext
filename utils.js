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