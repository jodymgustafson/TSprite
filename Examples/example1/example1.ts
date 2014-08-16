/// <reference path="../ExampleApp.ts" />
/// <reference path="../../src/TSprite/Base.ts" />
/// <reference path="../../src/TSprite/AnimationLoop.ts" />
/// <reference path="../../src/TSprite/Canvas.ts" />

class Example1App extends ExampleApp
{
    private sprite: TSprite.Canvas.CanvasSprite;

    constructor()
    {
        super("Simple Canvas Sprite");

        this.sprite = new TSprite.Canvas.CanvasSprite(
            (context, x, y, w, h) =>
            {
                var r = w / 2;
                context.fillStyle = "Blue";
                context.beginPath();
                context.arc(x + r, y + r, r, 0, 2 * Math.PI);
                context.fill();
            }
            , 10, 10, 32, 32);

        this.setRandomVelocity(this.sprite);
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
    new Example1App().start();
});