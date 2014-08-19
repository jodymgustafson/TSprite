/// <reference path="../ExampleApp.ts" />
/// <reference path="../../TSprite/Base.ts" />
/// <reference path="../../TSprite/AnimationLoop.ts" />
/// <reference path="../../TSprite/Canvas.ts" />

class DrawableCircle implements TSprite.Canvas.IDrawable
{
    private alpha = 1.0;
    private alphaDelta = -30 / 1000;

    constructor(private w: number, private h: number) { }

    draw(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number)
    {
        this.alpha += this.alphaDelta;
        if (this.alpha < 0.1 || this.alpha > 1) this.alphaDelta *= -1;
        var r = w / 2;
        context.fillStyle = "rgba(0,0,255," + this.alpha + ")";
        context.beginPath();
        context.arc(x + r, y + r, r, 0, 2 * Math.PI);
        context.fill();
    }
    getWidth(): number { return this.w; }
    getHeight(): number { return this.h; }
};

class Example1_1App extends ExampleApp
{
    private sprite: TSprite.Canvas.CanvasSprite;

    constructor()
    {
        super("Drawable Canvas Sprite");
        
        this.sprite = new TSprite.Canvas.CanvasSprite(new DrawableCircle(32, 32), 10, 10, 32, 32);

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
    new Example1_1App().start();
});