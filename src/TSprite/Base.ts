// Base objects for TSprite library
// @author JM Gustafson
// @version 1.00

module TSprite
{
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

    /** Defines a rectanglular area */
    export class Rectangle
    {
        constructor(public x = 0, public y = 0, public w = 0, public h = 0)
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
    }

    // Used to keep track of next UID internally for sprites
    var nextUID = 0;

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
        * @param x Initial x position
        * @param y Initial y position
        * @param w Width of the sprite
        * @param h Height of the sprite
        * @param vx Initial x velocity in pixels per second
        * @param vy Initial y velocity in pixels per second
        */
        constructor(x?: number, y?: number, w?: number, h?: number, public vx = 0, public vy = 0)
        {
            super(x, y, w, h);
            this._uid = nextUID++;
            this.id = this._uid.toString(10);
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
            var rect = new Rectangle(x, y, w, h);
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
                if (this._colAreas || otherSprite._colAreas) return this._checkCollisionAreas(otherSprite);
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
            var rect = new Rectangle();
            for (var i in this._colAreas)
            {
                var area = this._colAreas[i];
                rect.x = this.x + area.x;
                rect.y = this.y + area.y;
                rect.w = area.w;
                rect.h = area.h;

                if (otherSprite._colAreas)
                {
                    // Check against other sprite's collision areas
                    for (var ca in otherSprite._colAreas)
                    {
                        if (rect.intersects(otherSprite._colAreas[ca])) return true;
                    }
                }
                else
                {
                    // Check against other sprite's bounds
                    if (rect.intersects(otherSprite)) return true;
                }
            }

            return false;
        }
    }
} 