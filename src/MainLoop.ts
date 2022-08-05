import Component from './classes/Component';
import GameObject from './classes/GameObject';
import Render from './classes/Render';
import SpriteRenderer from './classes/renderer/SpriteRenderer';
import TextRenderer from './classes/renderer/TextRenderer';
import Scene from './classes/Scene';
import config from './config';
import Events from './utils/Events';
import gamepad from './utils/gamepad';
import Localization from './utils/Localization';
import Time from './utils/Time';

/**
 * @namespace MainLoop
 * The MainLoop namespace handle the call of the next frame, updating scene, rendering and so on
 * MainLoop start when calling DE.start();
 */
class MainLoop {
  public static readonly DEName = 'MainLoop';
  scenes: Scene[] = [];
  renders: Render[] = [];
  additionalModules: { [k: string]: Component } = {};
  launched = false;
  displayLoader = false;

  private loader: GameObject;

  constructor() {
    this.loader = new GameObject({});
  }

  createLoader() {
    const loaderTextRd = new TextRenderer('Loading...', {
      textStyle: {
        fill: 'white',
        fontSize: 35,
        fontFamily: 'Snippet, Monaco, monospace',
        strokeThickness: 1,
        align: 'center',
      },
    });
    this.loader.addRenderer(loaderTextRd);

    let n_dots = 0;
    this.loader.timeout(
      () => {
        var dots = '.';
        for (var i = 0; i < 3; ++i) {
          dots += n_dots < i ? ' ' : '.';
        }

        ++n_dots;
        if (n_dots > 3) {
          n_dots = 0;
        }
        loaderTextRd.text = 'Loading' + dots;
      },
      500,
      true,
    );
    this.loader.renderer.y += 150;
    Events.on('ImageManager-pool-progress', (poolName, progression) => {
      this.loader.removeAutomatism('animateLoader');
      poolName == config.DEFAULT_POOL_NAME
        ? (loaderTextRd.text = progression + '%')
        : (loaderTextRd.text = poolName + ': ' + progression + '%');
    });
    Events.on('ImageManager-pool-complete', (poolName) => {
      this.loader.removeAutomatism('animateLoader');
      loaderTextRd.text = '100%';
    });
  }

  updateLoaderImage(loader: any) {
    // TOTO créer un type "imageParams"
    this.loader.addRenderer(
      new SpriteRenderer({ spriteName: loader[0], scale: loader[2].scale }),
    );
  }

  loop() {
    if (!this.launched) {
      console.warn('MainLoop has stopped');
      return;
    }

    requestAnimationFrame(() => this.loop());

    // regulate fps OR if the Time machine is stopped
    if (!Time.update()) {
      return;
    }

    if (this.displayLoader) {
      for (let i = 0, j; (j = this.renders[i]); i++) {
        this.loader.x = j.pixiRenderer.width * 0.5;
        this.loader.y = j.pixiRenderer.height * 0.5;
        this.loader.update(Time.currentTime);
        j.directRender(this.loader);
      }

      return;
    }

    // TODO render only if framerate is ok then ?
    for (let i = 0, r; (r = this.renders[i]); ++i) {
      r.render();
    }

    gamepad.update(Time.currentTime);

    while (Time.timeSinceLastFrame >= Time.frameDelay) {
      for (let r in this.additionalModules)
        this.additionalModules[r]._update(Time.frameDelayScaled);

      for (let i = 0, r; (r = this.renders[i]); ++i) {
        r.update(Time.frameDelayScaled);
      }

      for (let i = 0, s; (s = this.scenes[i]); ++i) {
        if (s.enable) {
          s.update(Time.frameDelayScaled);
        }
      }

      Time.timeSinceLastFrame -= Time.frameDelay;
    }
  }

  addScene(scene: Scene) {
    this.scenes.push(scene);
  }

  addRender(render: Render) {
    this.renders.push(render);
  }
}

const mainLoop = new MainLoop();

Events.on('lang-changed', () => {
  for (var i = 0, s; (s = mainLoop.scenes[i]); ++i) {
    for (var ii = 0, g; (g = s.gameObjects[ii]); ++ii) {
      checkGameObjectsTextRenderer(g);
    }
  }
});

function checkGameObjectsTextRenderer(go: GameObject) {
  for (var ix = 0, sub; (sub = go.gameObjects[ix]); ++ix) {
    checkGameObjectsTextRenderer(sub);
  }
  if (!go.renderers) {
    return;
  }
  for (var ir = 0, r; (r = go.renderers[ir]); ++ir) {
    if (r.localizationKey) {
      r.text = Localization.get(r.localizationKey);
      r.checkMaxWidth();
    }
  }
}

export default mainLoop;
