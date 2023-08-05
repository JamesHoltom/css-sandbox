# CSS Sandbox

Sandbox for playing around with CSS3 features, primarily flexbox and 3D transformations.

Currently includes:

* A 3D cube that can be moved/rotated, with a toggleable animation.
* A "world" editor, allowing users to make primitive maps. Includes a save/load feature.

Further developments could include:

*World*:

* Setting textures for face elements.
* Add "sprites" which ignore 3D transformations (i.e. setting the *transform-style* to `flat`). Could also include setting *scale* and *skew*.
* Allow for moving the camera in *Edit* mode.
* Spin off into a separate project, with physics and collisions(?).

*Parallax*:

* Set up a container for experimenting with parallax scrolling.

## Running

It's recommended to host *index.html* on a server, with 2 options being:

* Installing [http-server](https://www.npmjs.com/package/http-server) through NPM.
* Using the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension in VSCode.

## Example world

```json
{"id":"0","type":"group","translation":{"x":0,"y":0,"z":0},"rotation":{"x":0,"y":0,"z":0},"size":{"w":200,"h":200},"colour":{"r":255,"g":0,"b":0,"a":255},"children":[{"id":"1","type":"face","translation":{"x":0,"y":50,"z":0},"rotation":{"x":90,"y":0,"z":0},"size":{"w":200,"h":200},"colour":{"r":255,"g":0,"b":0,"a":255},"children":[]},{"id":"2","type":"face","translation":{"x":0,"y":0,"z":-100},"rotation":{"x":0,"y":0,"z":0},"size":{"w":200,"h":100},"colour":{"r":0,"g":255,"b":0,"a":255},"children":[]},{"id":"3","type":"face","translation":{"x":0,"y":0,"z":100},"rotation":{"x":180,"y":0,"z":0},"size":{"w":200,"h":100},"colour":{"r":0,"g":255,"b":255,"a":255},"children":[]},{"id":"4","type":"face","translation":{"x":-100,"y":0,"z":0},"rotation":{"x":0,"y":90,"z":0},"size":{"w":200,"h":100},"colour":{"r":0,"g":0,"b":255,"a":255},"children":[]},{"id":"5","type":"face","translation":{"x":100,"y":0,"z":0},"rotation":{"x":0,"y":270,"z":0},"size":{"w":200,"h":100},"colour":{"r":255,"g":0,"b":255,"a":255},"children":[]},{"id":"6","type":"face","translation":{"x":0,"y":-50,"z":0},"rotation":{"x":270,"y":0,"z":0},"size":{"w":200,"h":200},"colour":{"r":255,"g":255,"b":0,"a":255},"children":[]}]}
```
