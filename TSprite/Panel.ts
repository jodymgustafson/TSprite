module TSprite
{
    /** Enum that represent borders of a rectangle. Can be combined using bitwise operators. */
    export enum BorderFlags
    {
        NONE = 0,
        TOP = 0x01,
        BOTTOM = 0x02,
        LEFT = 0x04,
        RIGHT = 0x08,
        LEFTORRIGHT = LEFT | RIGHT,
        TOPORBOTTOM = TOP | BOTTOM,
        ALL = LEFTORRIGHT | TOPORBOTTOM
    }

    /** Functions used to check borders from BorderFlags combinations */
    export module BorderCheck
    {
        export function top(borders: number): boolean
        {
            return (borders & TSprite.BorderFlags.TOP) !== 0;
        }
        export function bottom(borders: number): boolean
        {
            return (borders & TSprite.BorderFlags.BOTTOM) !== 0;
        }
        export function left(borders: number): boolean
        {
            return (borders & TSprite.BorderFlags.LEFT) !== 0;
        }
        export function right(borders: number): boolean
        {
            return (borders & TSprite.BorderFlags.RIGHT) !== 0;
        }
        export function topOrBottom(borders: number): boolean
        {
            return (borders & TSprite.BorderFlags.TOPORBOTTOM) !== 0;
        }
        export function leftOrRight(borders: number): boolean
        {
            return (borders & TSprite.BorderFlags.LEFTORRIGHT) !== 0;
        }
    }

    /**
     * Implements a Panel, which is a rectangle that has bounds checking.
     */
    export class Panel extends Rectangle
    {
        public visible = true;

        constructor(x: number, y: number, w: number, h: number)
        {
            super(x, y, w, h);
        }

        /**
         * Checks if an item is touching or ouside the bounds of this panel
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
