module.exports = function(file, api) {
    const j = api.jscodeshift;
    const { statement } = j.template;

    function getTypeAnnotation(node) {
        if (!node.value) return 'any';
        const reactTypeName = node.value.property ? node.value.property.name : 'any';
        switch (reactTypeName) {
            case 'number':
                return j.numberTypeAnnotation();
            case 'bool':
                return j.booleanTypeAnnotation();
            case 'string':
                return j.stringTypeAnnotation();
            default:
                return j.anyTypeAnnotation();
        }
    }

    function hasJSXElement(ast) {
        return (
            j(ast)
                .find(j.JSXElement)
                .size() > 0
        );
    }

    function insertPropsAndState(ast, compName, properties) {
        if (!Array.isArray(properties) || properties.length === 0) return;
        const propName = `${compName}Props`;
        const stateName = `${compName}State`;
        const propsInterfaceDecl = statement`interface ${propName} extends BaseProps { };\n`;
        const props = properties.map(p => ({
            key: j.identifier(p.key.name),
            value: getTypeAnnotation(p),
        }));

        propsInterfaceDecl.body.properties = props.map(p =>
            j.objectTypeProperty(p.key, p.value, true)
        );

        return j(ast).insertBefore(propsInterfaceDecl);
    }

    let source = file.source;
    source = j(source)
        .find(j.ArrowFunctionExpression)
        .filter(afe => hasJSXElement(afe))
        .map(afe => afe.parent)
        .replaceWith(decl => {
            if (decl.node.id) {
                const compName = decl.node.id.name;
                // :React.SFC<${CompProps}>
                decl.node.id.typeAnnotation = j.typeAnnotation(
                    j.genericTypeAnnotation(
                        j.qualifiedTypeIdentifier(j.identifier('React'), j.identifier('SFC')),
                        j.typeParameterInstantiation([
                            j.genericTypeAnnotation(j.identifier(`${compName}Props`), null),
                        ])
                    )
                );
            }

            return decl.node;
        })
        .toSource();

    source = j(source)
        .find(j.MemberExpression, {
            property: {
                name: 'propTypes',
            },
        })
        .replaceWith(exp => {
            const compName = exp.node.object.name;
            if (
                j(source)
                    .find(j.InterfaceDeclaration, { id: { name: `${compName}Props` } })
                    .size() === 0
            ) {
                const props = exp.parent.node.right.properties;
                // insert at expression statement
                insertPropsAndState(exp.parent.parent, compName, props);
            }
            return exp.node;
        })
        .toSource();

    return source;
};
