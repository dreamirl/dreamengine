![DreamEngine Logo](http://dreamengine.dreamirl.com/assets/imgs/logo.png)

# DreamEngine (DE) - a simple and powerful 2D game engine using PIXI

The DreamEngine is a free open source engine to create HTML5 games.
This brand new version is based on [PIXI](http://www.pixijs.com/).

It give you a powerful and simple declaration, logic, inputs binding, achievements management, audio library and so on.

If you want to use PIXI but don't want to code everything you need aside, you should try the DreamEngine.

You want to hack directly with the PIXI engine? Just do DE.PIXI anywhere and start hacking.
Since the engine is based on PIXI without modifications, you can use any plugins working with PIXI.

Instead of the others engine, the DreamEngine is a little bit harder to start with, but it is worthy.

# Usage

You want the easy way? Just grab the [game_sample](https://github.com/dreamirl/game_sample).

You wants to do custom stuff?

- Using ES6 you can do `import DE from '@dreamirl/dreamengine'` this what we do in the sample (you can use package.alias or webpack.resolve to match the paths to each module)
- Not using an ES6 architecture and want to go straight forward? just download the file you need in dist/ (those are "compiled" engine ready for use)

# Troubleshooting

The engine is still a work in progress project, even if it's quite stable and all feature are ready for use, some stuff may be messed up.

_*What is missing/not good:*_

- camera, because we have to use a PIXI Container on top, the positions are not good and when you want to do some camera movement it feel weird, also no crop/sizing on the camera
- CollisionSystem, maybe coming as optional plugin but it is planned
- SystemDetection, to make different build for different platforms easily
- Screen, to detect the size and DPI of the player's screen and choose if it should load an other quality. Despite the first algorithm is quite simple this require a tons of work on all the rendering process because it should load lower quality image, keeping the same rendering, and not touching the logic at all

# Examples

Here is a list of games made with the engine:

- [Hexamaster](https://inateno.itch.io/hexamaster-tb) (using a lot of PIXI plugins)

Made one? Submit it in a PR.

## Contributing

Check issues if you want to contribute.

You wrote a game? A plugin? An editor? Or other stuff?
You know a better way to do something in the engine (physics, loops, inputs, gui...)?
Open an issue or send a pull request!

# Credits

The website [HTML5-Dreamengine](http://dreamengine.dreamirl.com)
You can also follow the [company](http://twitter.com/dreamirlgames). or the [original creator](http://twitter.com/inateno).

## License

The DreamEngine is released under the [MIT License](http://opensource.org/licenses/MIT).
