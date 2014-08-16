/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../src/TSprite/Base.ts" />
/// <reference path="../src/TSprite/AnimationLoop.ts" />

/**
* Base class for example apps
* @abstract
*/
class ExampleApp
{
    /** @protected */
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    loop: TSprite.AnimationLoop;
    $fps: JQuery;

    constructor(appName: string)
    {
        $("header").text(appName);

        this.canvas = <HTMLCanvasElement>$("canvas")[0];
        this.context = this.canvas.getContext("2d");
        this.$fps = $("footer>span");

        this.loop = new TSprite.AnimationLoop((dt) => this.update(dt));

        $("canvas").click(() => this.togglePause());
    }

    /** @protected */
    update(dt: number)
    {
        this.$fps.text(this.loop.framesPerSecond.toFixed(2));
    }

    public start()
    {
        this.loop.start();
    }

    /** @protected */
    togglePause()
    {
        if (this.loop.isRunning)
        {
            this.loop.stop();
        }
        else
        {
            this.loop.start();
        }
    }

    /** @protected */
    setRandomVelocity(sprite: TSprite.Sprite)
    {
        sprite.setVelocity(100 * Math.random() + 50, 100 * Math.random() + 50);
    }
} 