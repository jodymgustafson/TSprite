/// <reference path="../ExampleApp.ts" />
/// <reference path="../../src/TSprite/Base.ts" />
/// <reference path="../../src/TSprite/AnimationLoop.ts" />
/// <reference path="../../src/TSprite/Canvas.ts" />

class Example3App extends ExampleApp
{
    private sprite: TSprite.Canvas.CanvasSprite;

    constructor()
    {
        super("Animated Sprite");
    }

    /** @override */
    public start()
    {
        var img = new Image();
        img.src = "images/ball.png";
        img.onload = () =>
        {
            var frames = new TSprite.Canvas.ImageAnimationFrames(img, 32, 32, 2, 4);
            this.sprite = new TSprite.Canvas.AnimatedSprite(frames, 16, 10, 10);
            this.setRandomVelocity(this.sprite);
            super.start();
        }
    }

    /** @override */
    update(dt: number)
    {
        this.sprite.update(dt);

        if (this.sprite.right >= this.canvas.width || this.sprite.left <= 0)
        {
            this.sprite.vx *= -1;
        }
        if (this.sprite.bottom >= this.canvas.height || this.sprite.top <= 0)
        {
            this.sprite.vy *= -1;
        }

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.sprite.draw(this.context);

        super.update(dt);
    }
}

$(function ()
{
    new Example3App().start();
});