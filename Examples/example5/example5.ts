﻿/// <reference path="../ExampleApp.ts" />
/// <reference path="../../TSprite/Base.ts" />
/// <reference path="../../TSprite/Panel.ts" />
/// <reference path="../../TSprite/AnimationLoop.ts" />
/// <reference path="../../TSprite/Canvas.ts" />
/// <reference path="../../TSprite/CanvasPanel.ts" />

class Example5App extends ExampleApp
{
    private sprite1: TSprite.Canvas.CanvasSprite;
    private sprite2: TSprite.Canvas.CanvasSprite;
    private panels: TSprite.Canvas.CanvasPanel[] = [];
    private bounds: TSprite.Panel;

    constructor()
    {
        super("Canvas Panels");

        // Create a bounding panel
        this.bounds = new TSprite.Panel(0, 0, this.canvas.width, this.canvas.height);
    }

    /** @override */
    public start()
    {
        var img = new Image();
        img.src = "images/sprites.png";
        img.onload = () =>
        {
            // Create sprites
            var spriteSheet = new TSprite.Canvas.SpriteSheet(img);
            var frames = spriteSheet.getAnimationFrames(32, 32, 2, 4, 0, 0);
            this.sprite1 = new TSprite.Canvas.AnimatedSprite(frames, 24, 100, 10);
            this.setRandomVelocity(this.sprite1);

            frames = spriteSheet.getAnimationFrames(32, 32, 2, 4, 0, 64);
            this.sprite2 = new TSprite.Canvas.AnimatedSprite(frames, 12, 10, 100);
            this.setRandomVelocity(this.sprite2);

            // Create panels
            var ssImage = spriteSheet.getImage(0, 128, 32, 32);
            this.panels.push(new TSprite.Canvas.CanvasPanel(0, 0, 160, 50, ssImage)
                .setBackgroundColor("Green")
                .setBackgroundStyle(TSprite.Canvas.BackgroundStyle.REPEAT_X));

            this.panels.push(new TSprite.Canvas.CanvasPanel(0, 50, 160, 100, ssImage)
                .setBackgroundColor("Orange")
                .setBackgroundStyle(TSprite.Canvas.BackgroundStyle.REPEAT_Y));

            this.panels.push(new TSprite.Canvas.CanvasPanel(0, 150, 160, 100, ssImage)
                .setBackgroundColor("Blue")
                .setBackgroundStyle(TSprite.Canvas.BackgroundStyle.REPEAT));

            this.panels.push(new TSprite.Canvas.CanvasPanel(160, 0, 160, 100, ssImage)
                .setBackgroundColor("Yellow")
                .setBackgroundStyle(TSprite.Canvas.BackgroundStyle.FILL));

            this.panels.push(new TSprite.Canvas.CanvasPanel(160, 100, 160, 100, ssImage)
                .setBackgroundColor("Purple")
                .setBackgroundStyle(TSprite.Canvas.BackgroundStyle.NO_REPEAT));

            // For this panel use the entire HTML image, not the sprite sheet image
            this.panels.push(new TSprite.Canvas.CanvasPanel(160, 200, 160, 50, img)
                .setBackgroundColor("Black")
                .setBackgroundStyle(TSprite.Canvas.BackgroundStyle.FILL));

            super.start();
        }
    }

    /** @override */
    update(dt: number)
    {
        this.sprite1.update(dt);
        this.sprite2.update(dt);

        this.checkBounds(this.sprite1).checkBounds(this.sprite2);

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // Draw the panels
        this.panels.forEach((panel) => panel.draw(this.context));
        // Draw the sprites
        this.sprite1.draw(this.context);
        this.sprite2.draw(this.context);

        if (this.sprite1.intersects(this.sprite2))
        {
            this.bounceSprite(this.sprite1, this.sprite2);
            this.bounceSprite(this.sprite2, this.sprite1);
            // This will prevent sticking
            this.sprite1.update(dt);
            this.sprite2.update(dt);
        }

        super.update(dt);
    }

    /** This will bounce a sprite off another sprite */
    private bounceSprite(sprite: TSprite.Sprite, otherSprite: TSprite.Sprite)
    {
        var xdif = Math.abs(sprite.left - otherSprite.left);
        var ydif = Math.abs(sprite.top - otherSprite.top);
        if (xdif >= ydif) sprite.vx *= -1;
        else if (xdif <= ydif) sprite.vy *= -1;
    }

    /** This will bounce the sprite off the walls of the containing panel */
    private checkBounds(sprite: TSprite.Sprite): Example5App
    {
        var borders = this.bounds.restrictBounds(sprite);
        if (borders)
        {
            if (borders & TSprite.BorderFlags.LEFTORRIGHT)
            {
                sprite.vx *= -1;
            }
            if (borders & TSprite.BorderFlags.TOPORBOTTOM)
            {
                sprite.vy *= -1;
            }
        }
        return this;
    }
}

$(function ()
{
    new Example5App().start();
});