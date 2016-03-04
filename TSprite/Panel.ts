/// <reference path="Base.ts" />
module TSprite
{
    /**
     * Implements a Panel, which is a rectangle that has bounds checking.
     */
    export class Panel extends Rectangle
    {
        public visible = true;

        constructor(w: number, h: number)
        {
            super(w, h);
        }

        /**
         * Checks if an item is touching or outside the bounds of this panel
         * @param rect The item to check
         * @return The borders that were hit using TSprite.BorderFlags
         */
        public checkBounds(rect: TSprite.Rectangle): number
        {
            var borders = BorderFlags.NONE;
            if (rect.right >= this.right)
            {
                borders |= BorderFlags.RIGHT;
            }
            else if (rect.left <= this.x)
            {
                borders |= BorderFlags.LEFT;
            }
            if (rect.bottom >= this.bottom)
            {
                borders |= BorderFlags.BOTTOM;
            }
            else if (rect.top <= this.y)
            {
                borders |= BorderFlags.TOP;
            }
            return borders;
        }

        /**
         * Keeps an item inside the panel
         * @param rect The item to restrict
         * @return The borders that were hit using TSprite.BorderFlags
         */
        public restrictBounds(rect: TSprite.Rectangle): number
        {
            var borders = this.checkBounds(rect);
            if (borders)
            {
                if (borders & BorderFlags.LEFT) rect.x = this.x;
                else if (borders & BorderFlags.RIGHT) rect.x = this.right - rect.w;
                if (borders & BorderFlags.TOP) rect.y = this.y;
                else if (borders & BorderFlags.BOTTOM) rect.y = this.bottom - rect.h;
            }
            return borders;
        }
    }
}
