# Client Framework

It is important for the future maintainership of this small website
that the code can easily be understood by the "average" programmer,
of which Rich mentions that 50% of programmers being below average
would mean that any advanced system would not be maintainable.

I chose to write a very simple templating and component library based
off of the new HTMLElement concept to function react-esque without the
burden of transpilation.

Quite simply a component is a class extension of the base class 
`Component`, It is expected that this is implemeneted as such with the
other methods filled in.

```js
class MyComponent extends Component {
    static __IDENTIFY() { return 'MyComponent'; }

    constructor() {
        super(MyComponent);
    }
}
```

That is the simplest form a component can be, it won't render but it
will register it's self in the DOM and be accessable with the
`<mycomponent></mycomponent>` tag within the DOM.

In order to get some stuff rendering in there, it is important to
override the `Render` method, returning an object with a template
and a style sheet, or a promise that will resolve these, so they can be
asynchronusly loaded by the framework.


Basic loading
```js
class MyComponent extends Component {
    static __IDENTIFY() { return 'MyComponent'; }

    constructor() {
        super(MyComponent);
    }

    Render() {
        return {
            template: /* html */`<div>{this.state.name}</div>`,
            style: `div { text-color: red }`,
        };
    }
}
```

Asynchronus loading
```js
class MyComponent extends Component {
    static __IDENTIFY() { return 'MyComponent'; }

    constructor() {
        super(MyComponent);
    }

    Update() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.state.name = 'Hello World';
                resolve();
            }, 1000);
        });
    }

    Render() {
        return {
            template: SideLoad('MyComponent.html'),
            style: SideLoad('MyComponent.css'),
        };
    }
}
```

## State

Similarly to React this framework includes a concept for statefulness,
a given component has a state which can be user-defined `this.state.x=`
or an attribute to the component tag in the HTML, or both. When the
state changes, the component is re-renderered.

State is updated with `setState()`.

Within the HTML, any instance of `{this.state.}` will be replaced with
the internal state of the component.

The `OnMount` method is called once the component has been loaded and
attatched to the DOM. This is where you can do any post-load setup.
It is only called once and it's return value becomes the state of the
component.

The `Update` method is called when the global state or the attribute
state changes, and is expected to modify the internal state before
rendering.

TODO: Global state
