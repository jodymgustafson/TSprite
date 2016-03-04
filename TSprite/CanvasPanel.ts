/// <reference path="Canvas.ts" />
/// <reference path="Base.ts" />

module TSprite
{
    export module Canvas
    {
        /** Defines the background drawing style for a panel */
        export enum BackgroundStyle
        {
            NO_REPEAT = 0,
            REPEAT_X = 1,
            REPEAT_Y = 2,
            REPEAT = 3,
            FILL = 4
        }

        /**
         * Gets a panel that can draw a tiled background and is also drawable so it can be wrapped by a sprite
         */
        export class CanvasPanel extends TSprite.Panel implements TSprite.Canvas.IDrawable
        {
            private imageW: number;
            private imageH: number;
            private bgColor: string;
            private bgOffset: IPoint = { x: 0, y: 0 };
            private bgStyle = TSprite.Canvas.BackgroundStyle.NO_REPEAT;
            /** @protected */
            _drawable: TSprite.Canvas.IDrawable;

            constructor(w: number, h: number);
            /**
             * @param w Width of the panel
             * @param h Height of the panel
             * @param image An image for the background
            */
            constructor(w: number, h: number, image: HTMLImageElement);
            /**
             * @param w Width of the panel
             * @param h Height of the panel
             * @param drawable A drawable object for the background
            */
            constructor(w: number, h: number, drawable: TSprite.Canvas.IDrawable);
            constructor(w: number, h: number, imageOrDrawable?: any)
            {
                super(w, h);

                if (imageOrDrawable instanceof HTMLImageElement)
                {
                    this._drawable = new TSprite.Canvas.SpriteSheetImage(imageOrDrawable, 0, 0, imageOrDrawable.width, imageOrDrawable.height);
                }
                else
                {
                    this._drawable = imageOrDrawable;
                }
                this.imageW = this._drawable ? this._drawable.getWidth() : w;
                this.imageH = this._drawable ? this._drawable.getHeight() : h;
            }

            public getWidth(): number
            {
                return this.imageW;
            }
            public getHeight(): number
            {
                return this.imageH;
            }

            public update(dt) { return this; }

            public setBackgroundColor(color: string): TSprite.Canvas.CanvasPanel
            {
                this.bgColor = color;
                return this;
            }
            public getBackgroundColor(): string
            {
                return this.bgColor;
            }

            public setBackgroundPosition(offset: number, offsetY?: number): TSprite.Canvas.CanvasPanel
            {
                this.bgOffset.x = offset % this.imageW;
                this.bgOffset.y = (offsetY || offset) % this.imageH;
                return this;
            }
            public getBackgroundPosition(): IPoint
            {
                return this.bgOffset;
            }

            public setBackgroundStyle(style: TSprite.Canvas.BackgroundStyle): TSprite.Canvas.CanvasPanel
            {
                this.bgStyle = style;
                return this;
            }
            public getBackgroundStyle(): TSprite.Canvas.BackgroundStyle
            {
                return this.bgStyle;
            }

            public draw(context: CanvasRenderingContext2D);
            public draw(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number)
            public draw(context: CanvasRenderingContext2D, x: number = this.x, y: number = this.y, w: number = this.w, h: number = this.h)
            {
                if (this.visible)
                {
                    context.save();
                    if (this.bgColor)
                    {
                        context.fillStyle = this.bgColor;
                        context.fillRect(x, y, w, h);
                    }
                    if (this._drawable)
                    {
                        // Set clip to bounds of the sprite
                        context.beginPath();
                        context.rect(x, y, w, h);
                        context.clip();
                        // Tile the background
                        switch (this.bgStyle)
                        {
                            case TSprite.Canvas.BackgroundStyle.REPEAT:
                                this.tileBackgroundBoth(context, x, y, w, h);
                                break;
                            case TSprite.Canvas.BackgroundStyle.REPEAT_X:
                                this.tileBackgroundHorizontal(context, x, y, w);
                                break;
                            case TSprite.Canvas.BackgroundStyle.REPEAT_Y:
                                this.tileBackgroundVertical(context, x, y, h);
                                break;
                            case TSprite.Canvas.BackgroundStyle.FILL:
                                this.fillBackground(context, x, y, w, h);
                                break;
                            default:
                                this.drawBackground(context, x, y);
                                break;
                        }
                    }
                    context.restore();
                    if (TSprite.debug) context.strokeRect(x, y, w, h);
                    return this;
                }
            }

            /** Tiles background in all directions */
            private tileBackgroundBoth(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number)
            {
                var x1 = (this.bgOffset.x > 0 ? this.bgOffset.x - this.imageW : this.bgOffset.x);
                // Note: subtract 0.5 to eliminate gaps
                for (; x1 < w; x1 += this.imageW - 0.5)
                {
                    var y1 = (this.bgOffset.y > 0 ? this.bgOffset.y - this.imageH : this.bgOffset.y);
                    for (; y1 < h; y1 += this.imageH - 0.5)
                    {
                        this._drawable.draw(context, x + x1, y + y1, this.imageW, this.imageH);
                    }
                }
            }
            /** Tiles background horizontally */
            private tileBackgroundHorizontal(context: CanvasRenderingContext2D, x: number, y: number, w: number)
            {
                var x1 = (this.bgOffset.x > 0 ? this.bgOffset.x - this.imageW : this.bgOffset.x);
                // Note: subtract 0.5 to eliminate gaps
                for (; x1 < w; x1 += this.imageW - 0.5)
                {
                    this._drawable.draw(context, x + x1, y, this.imageW, this.imageH);
                }
            }
            /** Tiles background vertically */
            private tileBackgroundVertical(context: CanvasRenderingContext2D, x: number, y: number, h: number)
            {
                var y1 = (this.bgOffset.y > 0 ? this.bgOffset.y - this.imageH : this.bgOffset.y);
                // Note: subtract 0.5 to eliminate gaps
                for (; y1 < h; y1 += this.imageH - 0.5)
                {
                    this._drawable.draw(context, x, y + y1, this.imageW, this.imageH);
                }
            }
            /** Stretches the background image to fill panel */
            private fillBackground(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number)
            {
                this._drawable.draw(context, x, y, w, h);
            }
            /** Draws the background image at the specified location */
            private drawBackground(context: CanvasRenderingContext2D, x: number, y: number)
            {
                this._drawable.draw(context, x, y, this.imageW, this.imageH);
            }
        }

        /**
         * Implements a panel that scrolls a tiled background
         */
        export class ScrollingPanel extends TSprite.Canvas.CanvasPanel
        {
            /** X-velocity in ppms */
            public vx = 0;
            /** Y-velocity in ppms */
            public vy = 0;

            /**
             * @param w, h - Size of the panel
             * @param drawable - A drawable object
             * @param ppsX, ppsY - Velocity in pixels per second to scroll the background
             */
            //constructor(x: number, y: number, w: number, h: number, drawable: TSprite.Canvas.Drawable);
            constructor(w: number, h: number, drawable: TSprite.Canvas.IDrawable, ppsX = 0, ppsY = 0)
            {
                super(w, h, drawable);
                this.setVelocity(ppsX, ppsY);
                this.setBackgroundStyle(TSprite.Canvas.BackgroundStyle.REPEAT);
            }

            /** Updates the position of the background
            * @param dt Number of milliseconds since last update
            * @override
            */
            public update(dt: number): TSprite.Canvas.ScrollingPanel
            {
                var bgOffset = this.getBackgroundPosition();
                this.setBackgroundPosition(bgOffset.x + this.vx * dt, bgOffset.y + this.vy * dt);
                return this;
            }

            /**
             * Sets the velocity of the scroll in pixels per second
             * @param pps Pixels per second to change velocity to
             * @param ppsY (optional) Sets the pps on the y axis independently of x
             * @return An object containing the x and y velocities
             */
            public setVelocity(ppsX: number, ppsY: number)
            {
                this.vx = ppsX / 1000;
                this.vy = ppsY / 1000;
                return this;
            }
            /** Gets the x and y velocity in pixels per second */
            public getVelocity(): IVelocity
            {
                return { vx: this.vx * 1000, vy: this.vy * 1000 };
            }
        }
    }
} 