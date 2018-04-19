module.exports = function(file, api, options) {
    const j = api.jscodeshift;
    const { statement } = j.template;
    const imports = j(file.source).find(j.ImportDeclaration);
    // modify statement content here
    const importStat = statement`import { DispatchActions } from 'shared/actions/types'\;`;
    const importStat2 = statement`import { State } from 'shared/reducers/types'\;`;

    return imports
        .filter((im, i) => i === imports.size() - 1)
        .insertAfter(importStat)
        .insertAfter(importStat2)
        .toSource();
};
