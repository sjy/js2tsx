# React to TSX Code

<p align="center">

[![npm](https://img.shields.io/npm/v/js2tsx.svg)](https://www.npmjs.com/package/js2tsx)
[![npm](https://img.shields.io/npm/l/express.svg)](https://www.npmjs.com/package/js2tsx)

</p>

> A toolkit provide some codemod scripts based on [jscodeshift](https://github.com/facebook/jscodeshift) to migrating react code base to typesceipt.

## Getting Started

> **NOTE** Please make sure a stable and modern verison of node and npm packages installed!

```bash
git clone $this-repo
yarn install
# or npm install
```

## Usage

All npm scripts can be run in `jscodeshift's dry` mode, which will never really change the files' content.

```bash
jscodeshift -t ./transforms/$some-provided-codemod.js $react-code-base-path --extension js --parser babylon
```

If you want to rename all js/jsx files to tsx/ts files, a simple rename file is provied to do this job.

```bash
npm run rename $code-base-path js tsx
```

### add-import.js

Add a import statement to each file match the path pattern specified;

### react-to-tsx.js

Add type annotaions to react composite components based on exsiting propTypes defination, turn from

```jsx
...
class Counter extends Component {
    static propTypes = {
        active: PropTypes.bool,
        name: PropTypes.string,
        count: PropTypes.number,
        unit: PropTypes.node,
        lowerLimit: PropTypes.number,
        upperLimit: PropTypes.number,
        onCountChange: PropTypes.func,
    };
    ...
}
...
```

to:

```jsx
...
type CounterState = {};
interface CounterProps extends BaseProps {
  active?: boolean,
  name?: string,
  count?: number,
  unit?: any,
  lowerLimit?: number,
  upperLimit?: number,
  onCountChange?: any,
}
class Counter extends Component<CounterProps, CounterState> {
    static propTypes = {
        active: PropTypes.bool,
        name: PropTypes.string,
        count: PropTypes.number,
        unit: PropTypes.node,
        lowerLimit: PropTypes.number,
        upperLimit: PropTypes.number,
        onCountChange: PropTypes.func,
    };
    ...
}
...
```

### sfc-to-tsx.js

Add type annotaions to stateless function components based on exsiting propTypes defination, turn from

```jsx
...
const Counter = ({ unit, count, lowerLimit, onCountChange}) => {
    return (
        <div className="fake-counter">
            <span className="operation" onClick={this.onCountChange.bind(this, 'minus')}>
                -
            </span>
            <span className="count">
                {count}
                {unit}
            </span>
            <span className="operation" onClick={this.onCountChange.bind(this, 'add')}>
                +
            </span>
        </div>
    );
};

Counter.propTypes = {
    active: PropTypes.bool,
    name: PropTypes.string,
    count: PropTypes.number,
    unit: PropTypes.node,
    lowerLimit: PropTypes.number,
    upperLimit: PropTypes.number,
    onCountChange: PropTypes.func,
};
...
```

to:

```jsx
...
const Counter: React.SFC<CounterProps> = ({ unit, count, lowerLimit, onCountChange}) => {
    return (
        <div className="fake-counter">
            <span className="operation" onClick={this.onCountChange.bind(this, 'minus')}>
                -
            </span>
            <span className="count">
                {count}
                {unit}
            </span>
            <span className="operation" onClick={this.onCountChange.bind(this, 'add')}>
                +
            </span>
        </div>
    );
};

interface CounterProps extends BaseProps {
  active?: boolean,
  name?: string,
  count?: number,
  unit?: any,
  lowerLimit?: number,
  upperLimit?: number,
  onCountChange?: any,
}
...
```

## Debug

> VS Code debug tool + nodejs debugger is heavilly recommended;
> sample config: .vscode/launch.json

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch via NPM",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "port": 9229
    }
  ]
}
```

[More Info @jscodeshift](https://github.com/facebook/jscodeshift/issues/223)

## Alt Codemods

* [react-codemod](https://github.com/reactjs/react-codemod) - React codemod scripts to update React APIs.
* [js-codemod](https://github.com/cpojer/js-codemod/) - Codemod scripts to transform code to next generation JS.
* [js-transforms](https://github.com/jhgg/js-transforms) - Some documented codemod experiments to help you learn.

## Support

jscodeshift: [https://github.com/facebook/jscodeshift](https://github.com/facebook/jscodeshift)

recast: [https://github.com/benjamn/recast](https://github.com/benjamn/recast)

ast-types: [https://github.com/benjamn/ast-types](https://github.com/benjamn/ast-types)

ast-explorer: [http://astexplorer.net/](http://astexplorer.net/)
