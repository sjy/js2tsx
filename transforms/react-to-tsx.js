module.exports = function(file, api) {
  const j = api.jscodeshift;
  const { statement } = j.template;

  function getTypeAnnotation(node) {
    if (!node.value) return 'any';
    const reactTypeName = node.value.property
      ? node.value.property.name
      : 'any';
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

  // mutate ast
  function insertPropsAndState(ast, className, properties) {
    if (!Array.isArray(properties) || properties.length === 0) return;
    const propName = `${className}Props`;
    const stateName = `${className}State`;
    const propsInterfaceDecl = statement`interface ${propName} extends RModule { };\n`;
    const stateInterfaceDecl = statement`type ${stateName} = {};\n`;
    const props = properties.map(p => ({
      key: j.identifier(p.key.name),
      value: getTypeAnnotation(p),
    }));

    propsInterfaceDecl.body.properties = props.map(p =>
      // set property as optional
      j.objectTypeProperty(p.key, p.value, true)
    );

    return (
      j(ast)
        // .insertBefore(stateInterfaceDecl)
        .insertBefore(propsInterfaceDecl)
    );
  }

  let source = file.source;

  source = j(source)
    .find(j.ClassDeclaration)
    .replaceWith(decl => {
      const className = decl.value.id.name;
      const propName = `${className}Props`;
      const stateName = `${className}State`;
      let props = [];
      j(decl)
        .find(j.ClassProperty, {
          static: true,
          key: {
            name: 'propTypes',
          },
        })
        .forEach(cp => (props = cp.value.value.properties));

      // add class generic type annotation
      decl.value.superTypeParameters = j.typeParameterInstantiation([
        j.intersectionTypeAnnotation([
          j.genericTypeAnnotation(j.identifier(propName), null),
          j.genericTypeAnnotation(j.identifier('State'), null),
          j.genericTypeAnnotation(j.identifier('DispatchActions'), null),
        ]),
        j.genericTypeAnnotation(j.identifier(stateName), null),
      ]);

      if (
        j(source)
          .find(j.InterfaceDeclaration, {
            id: {
              name: propName,
            },
          })
          .size() === 0
      ) {
        insertPropsAndState(decl, className, props);
      }

      return decl.node;
    })
    .toSource();

  return source;
};
