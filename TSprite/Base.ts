// Base objects for TSprite library
// @author JM Gustafson
// @version 1.00

module TSprite
{
    "use strict";
    /** Used to get or set debug mode */
    export var debug = false;

    export interface IPoint
    {
        x: number;
        y: number;
    }
    export interface IVelocity
    {
        vx: number;
        vy: number;
    }

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

    /** Defines a rectanglular area */
    export class Rectangle
    {
        public x = 0;
        public y = 0;

        constructor(public w = 0, public h = 0)
        {
        }

        public get top(): number { return this.y; }
        public get bottom(): number { return this.y + this.h; }
        public get left(): number { return this.x; }
        public get right(): number { return this.x + this.w; }
        
        /** Moves the rect to a new position */
        public moveTo(x: number, y: number): Rectangle
        {
            this.x = x;
            this.y = y;
            return this;
        }

        /** Determines if this rect intersects with another */
        public intersects(rect: Rectangle): boolean
        {
            var result =
                this.x < rect.x + rect.w &&
                this.x + this.w > rect.x &&
                this.y < rect.y + rect.h &&
                this.y + this.h > rect.y;
            return result;
        }

        /** Determines if this rect contains a point */
        public contains(x: number, y: number): boolean
        {
            var result =
                this.x < x &&
                this.x + this.w > x &&
                this.y < y &&
                this.y + this.h > y;
            return result;
        }
        
        /**
         * Checks if this rect intersects another and returns the borders that intersected.
         * This is the same as intersects except it returns the borders, which makes it slower.
         * @return The borders that were hit using TSprite.BorderFlags
         */
        public intersectsBorders(rect: TSprite.Rectangle): number
        {
            var borders = BorderFlags.NONE;
            if (this.intersects(rect))
            {
                if (rect.left < this.right && rect.right > this.right)
                {
                    borders |= BorderFlags.RIGHT;
                }
                if (rect.left < this.left && rect.right > this.left)
                {
                    borders |= BorderFlags.LEFT;
                }
                if (rect.top < this.bottom && rect.bottom > this.bottom)
                {
                    borders |= BorderFlags.BOTTOM;
                }
                if (rect.top < this.top && rect.bottom > this.top)
                {
                    borders |= BorderFlags.TOP;
                }
            }
            return borders;
        }
    }

    // Used to keep track of next UID internally for sprites
    var nextUID = 0;
    // Resets the UID to the base number specified
    export function resetUID(base: number): void
    {
        nextUID = base;
    }

    /**
    * Base class for all TSprite sprites
    */
    export class Sprite extends Rectangle
    {
        /** Determines if the sprite should be drawn */
        public visible = true;
        /** Determines if the sprite should be updated */
        public active = true;
        /** User specified id, set to uid by default */
        public id: string;
        /** The z-index of the sprite */
        public zIndex: number;
        /** Used to associate any user data with the sprite */
        public userData: any;
        /** Collision areas
         * @protected */
        _colAreas: Rectangle[] = null;

        private _uid: number;
        /** Gets the unique ID of this sprite */
        public get uid(): number
        {
            return this._uid;
        }

        /**
        * Creates a new sprite
        * @param w Width of the sprite
        * @param h Height of the sprite
        * @param vx Initial x velocity in pixels per second
        * @param vy Initial y velocity in pixels per second
        */
        constructor(w?: number, h?: number, public vx = 0, public vy = 0)
        {
            super(w, h);
            this._uid = nextUID++;
            this.id = this._uid.toString(10);
            this.setVelocity(vx, vy);
        }

        /**
         * Updates the sprite's position if it is active
         * @param {number} dt The timespan in ms used to update the position
         */
        public update(dt: number): Sprite
        {
            if (this.active)
            {
                if (this.vx != 0)
                {
                    this.x += this.vx * dt;
                }
                if (this.vy != 0)
                {
                    this.y += this.vy * dt;
                }
            }

            return this;
        }

        /** Sets visible and active to false */
        public disable(): Sprite
        {
            this.visible = this.active = false;
            return this;
        }

        /** Sets visible and active to true */
        public enable(): Sprite
        {
            this.visible = this.active = true;
            return this;
        }

        /**
         * @Override to get correct return type
         */
        public moveTo(x: number, y: number): Sprite
        {
            return <Sprite>super.moveTo(x, y);
        }

        /** Gets the x and y velocity in pixels per second */
        public getVelocity(): IVelocity
        {
            return { vx: this.vx * 1000, vy: this.vy * 1000 };
        }

        /**
         * Sets the velocity of the sprite in pixels per second 
         * @param ppsX The pps on the x axis
         * @param ppsY The pps on the y axis
         */
        public setVelocity(ppsX: number, ppsY: number): Sprite
        {
            this.vx = ppsX / 1000;
            this.vy = ppsY / 1000;
            return this;
        }

        /** Adds a collision area to be used to check for collisions */
        public addCollisionArea(x: number, y: number, w: number, h: number): Sprite
        {
            var rect = new Rectangle(w, h).moveTo(x, y);
            if (!this._colAreas)
            {
                this._colAreas = [rect];
            }
            else
            {
                this._colAreas.push(rect);
            }
            return this;
        }

        /** Determines if this sprite intersects another */
        public intersects(otherSprite: Sprite): boolean
        {
            // First see if the rect bounds intersect
            if (super.intersects(otherSprite))
            {
                // If there are collisions areas check those
                if (this._colAreas) return this._checkCollisionAreas(otherSprite);
                else if (otherSprite._colAreas) return otherSprite._checkCollisionAreas(this);
                else return true;
            }
            return false;
        }

        /**
         * Checks collisions areas of two sprites
         * @protected
         * @param otherSprite The other sprite
         * @param noRecurse Used internally when this method is called for the other sprite
         */
        _checkCollisionAreas(otherSprite: Sprite, noRecurse = false): boolean
        {
            for (var i in this._colAreas)
            {
                var thisArea = this._getCollisionArea(i);

                if (otherSprite._colAreas)
                {
                    // Check against other sprite's collision areas
                    for (var j in otherSprite._colAreas)
                    {
                        if (thisArea.intersects(otherSprite._getCollisionArea(j))) return true;
                    }
                }
                else
                {
                    // Check against other sprite's bounds
                    if (thisArea.intersects(otherSprite)) return true;
                }
            }

            return false;
        }

        /**
        * Get a collision area with offsets applied
        * @protected
        * @param idx Index of the collision area
        */
        _getCollisionArea(idx: number): Rectangle
        {
            var collArea = this._colAreas[idx];
            var rect = new Rectangle();
            rect.x = this.x + collArea.x;
            rect.y = this.y + collArea.y;
            rect.w = collArea.w;
            rect.h = collArea.h;
            return rect;
        }
    }
} 
