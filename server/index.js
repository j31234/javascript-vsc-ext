const node_1 = require("vscode-languageserver/node");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");


const get_tokens = require("../lexer");
const get_AST = require("../parser");
const getTokenType = require('../utils').getTokenType
// const { getTokenType } = require("../extension")
// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = (0, node_1.createConnection)(node_1.ProposedFeatures.all);
// Create a simple text document manager.
const documents = new node_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let hasDiagnosticRelatedInformationCapability = false;
connection.onInitialize((params) => {
    const capabilities = params.capabilities;
    // Does the client support the `workspace/configuration` request?
    // If not, we fall back using global settings.
    hasConfigurationCapability = !!(capabilities.workspace && !!capabilities.workspace.configuration);
    hasWorkspaceFolderCapability = !!(capabilities.workspace && !!capabilities.workspace.workspaceFolders);
    hasDiagnosticRelatedInformationCapability = !!(capabilities.textDocument &&
        capabilities.textDocument.publishDiagnostics &&
        capabilities.textDocument.publishDiagnostics.relatedInformation);
    const result = {
        capabilities: {
            textDocumentSync: node_1.TextDocumentSyncKind.Incremental,
            // Tell the client that this server supports code completion.
            completionProvider: {
                resolveProvider: true
            },
            signatureHelpProvider: {
                triggerCharacters: ["(", ","]
            }
        }
    };
    if (hasWorkspaceFolderCapability) {
        result.capabilities.workspace = {
            workspaceFolders: {
                supported: true
            }
        };
    }
    return result;
});
connection.onInitialized(() => {
    if (hasConfigurationCapability) {
        // Register for all configuration changes.
        connection.client.register(node_1.DidChangeConfigurationNotification.type, undefined);
    }
    if (hasWorkspaceFolderCapability) {
        connection.workspace.onDidChangeWorkspaceFolders(_event => {
            connection.console.log('Workspace folder change event received.');
        });
    }
});
// The global settings, used when the `workspace/configuration` request is not supported by the client.
// Please note that this is not the case when using this server with the client provided in this example
// but could happen with other clients.
const defaultSettings = { maxNumberOfProblems: 1000 };
let globalSettings = defaultSettings;
// Cache the settings of all open documents
const documentSettings = new Map();
connection.onDidChangeConfiguration(change => {
    if (hasConfigurationCapability) {
        // Reset all cached document settings
        documentSettings.clear();
    }
    else {
        globalSettings = ((change.settings.languageServerExample || defaultSettings));
    }
    // Revalidate all open text documents
    documents.all().forEach(validateTextDocument);
});
function getDocumentSettings(resource) {
    if (!hasConfigurationCapability) {
        return Promise.resolve(globalSettings);
    }
    let result = documentSettings.get(resource);
    if (!result) {
        result = connection.workspace.getConfiguration({
            scopeUri: resource,
            section: 'languageServerExample'
        });
        documentSettings.set(resource, result);
    }
    return result;
}
// Only keep settings for open documents
documents.onDidClose(e => {
    documentSettings.delete(e.document.uri);
});
// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(change => {
    validateTextDocument(change.document);
});
// TODO: error infomation
async function validateTextDocument(textDocument) {
    /*
    // In this simple example we get the settings for every validate run.
    const settings = await getDocumentSettings(textDocument.uri);

    // The validator creates diagnostics for all uppercase words length 2 and more
    const text = textDocument.getText();
    const pattern = /\b[A-Z]{2,}\b/g;
    let m: RegExpExecArray | null;

    let problems = 0;
    const diagnostics: Diagnostic[] = [];
    while ((m = pattern.exec(text)) && problems < settings.maxNumberOfProblems) {
        problems++;
        const diagnostic: Diagnostic = {
            severity: DiagnosticSeverity.Warning,
            range: {
                start: textDocument.positionAt(m.index),
                end: textDocument.positionAt(m.index + m[0].length)
            },
            message: `${m[0]} is all uppercase.`,
            source: 'ex'
        };
        if (hasDiagnosticRelatedInformationCapability) {
            diagnostic.relatedInformation = [
                {
                    location: {
                        uri: textDocument.uri,
                        range: Object.assign({}, diagnostic.range)
                    },
                    message: 'Spelling matters'
                },
                {
                    location: {
                        uri: textDocument.uri,
                        range: Object.assign({}, diagnostic.range)
                    },
                    message: 'Particularly for names'
                }
            ];
        }
        diagnostics.push(diagnostic);
    }

    // Send the computed diagnostics to VSCode.
    connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
    */
}

connection.onDidChangeWatchedFiles(_change => {
    // Monitored files have change in VSCode
    connection.console.log('We received an file change event');
});
var completionList = [];
function get_variables(root) {
    if (typeof (root) == "string") return;

    if (root.type == 'program') {
        completionList = [];
    }
    // variable
    if (root.type == 'variableDeclaration')
    {
        let varName = root.body[0].body[0].body[0]; // variableDeclaration -> assignable -> identifier
        completionList.push({ label: varName, kind:node_1.CompletionItemKind.Variable,})
        return;
    }
    // class
    else if (root.type == 'classDeclaration'){
        let varName = root.body[1].body[0]; // classDeclaration[1] -> identifier
        completionList.push({ label: varName, kind:node_1.CompletionItemKind.Class,})
        return;
    }
    // function
    else if (root.type == 'functionDeclaration') {
        root.body.forEach(item => {
            if (item.type == 'identifier') {
                completionList.push({ label: item.body[0], kind: node_1.CompletionItemKind.Function, });
                return;
            }
        })
        return;
    }
    
    
    if (typeof (root.body[0]) == "string") {
        return;
    }
    root.body.forEach(element => {
        get_variables(element);
    });
}
// TODO: code completion
// This handler provides the initial list of the completion items.
connection.onCompletion((_textDocumentPosition) => {
    // The pass parameter contains the position of the text document in
    // which code complete got requested. For the example we ignore this
    // info and always provide the same completion items.
    let document = documents.get(_textDocumentPosition.textDocument.uri);
    const text = document.getText();
    // var tokens = get_tokens(text);
    var AST = get_AST(text);
    // console.log(AST);
    get_variables(AST);
    // tokens = tokens.filter(item => item.text !== '<EOF>');
    // const last_token = tokens.pop();
    // console.log(last_token);
    // let variableList = [];
    // let returnList = [];
    // tokens.forEach(token => {
    //     const tokenType = getTokenType(token.type);
    //         if (tokenType === "variable") {
    //             // console.log(token.text);
    //             if (variableList.indexOf(token.text) == -1) {
    //                 variableList.push(token.text);
    //                 returnList.push({ label: token.text, kind:node_1.CompletionItemKind.Text,})
    //             }
    //         }
    //     }
    // )
    return completionList;
});
// This handler resolves additional information for the item selected in
// the completion list.
connection.onCompletionResolve((item) => {
    if (item.data === 1) {
        item.detail = 'TypeScript details';
        item.documentation = 'TypeScript documentation';
    }
    else if (item.data === 2) {
        item.detail = 'JavaScript details';
        item.documentation = 'JavaScript documentation';
    }
    return item;
});
connection.onSignatureHelp((SignatureHelpParams) => {
    return {
        signatures: [
            {
                label: 'QwQSignature(qwq0, qwq1)',
                documentation: 'QwQSignature documentation, a sample function signature',
                parameters: [
                    {
                        label: 'qwq0',
                        documentation: 'qwq0 documentation'
                    },
                    {
                        label: 'qwq1',
                        documentation: 'qwq1 documentation'
                    }
                ]
            }
        ],
        activeSignature: 0,
        activeParameter: 0
    };
})


// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);
// Listen on the connection
connection.listen();
//# sourceMappingURL=server.js.map