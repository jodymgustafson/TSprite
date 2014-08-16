(function ()
{
    // Normalize requestAnimationFrame
    window.requestAnimationFrame = window.requestAnimationFrame || window.msRequestAnimationFrame || window["webkitRequestAnimationFrame"] || window["mozRequestAnimationFrame"] ||
    function (callback: FrameRequestCallback)
    {
        return setTimeout(callback, 0);
    };
    window.cancelAnimationFrame = window.cancelAnimationFrame || window.msCancelRequestAnimationFrame || window["mozCancelAnimationFrame"] || function (handle: number) { };
})();

module TSprite
{
    /**
     * Manages an animation loop using requestAnimationFrame.
     * For each animation frame a callback function is executed passing it the number of milliseconds
     * that have elapsed since the last frame.
     */
    export class AnimationLoop
    {
        private _isRunning = false;
        private _lastUpdate = 0;
        private _ttlTime = 0;
        private _frameCnt = 0;
        private _callback: (dt: number) => any;
        private _maxDelta: number;

        /**
        * @param callback The function to call for each frame of the animation loop
        * @param maxDelta (optional) The max delta allowed before a frame is dropped
        */
        constructor(callback: (dt: number) => any, maxDelta = 100)
        {
            this._callback = callback;
            this._maxDelta = maxDelta;
        }

        public start(): AnimationLoop
        {
            if (!this._isRunning)
            {
                this._isRunning = true;
                this._lastUpdate = 0;
                requestAnimationFrame(() => this.onFrameRequest());
            }
            return this;
        }

        public stop(): AnimationLoop
        {
            this._isRunning = false;
            return this;
        }

        public get isRunning(): boolean
        {
            return this._isRunning;
        }

        /** Gets the number of ms the animation loop has been running */
        public get elapsedTime(): number
        {
            return this._ttlTime;
        }
        /** Gets the number of frames the animation loop has requested */
        public get frameCount(): number
        {
            return this._frameCnt;
        }
        /** Gets the number of frames per second over the life of the loop */
        public get framesPerSecond(): number
        {
            return 1000 / (this._ttlTime / this._frameCnt);
        }

        private onFrameRequest(): void
        {
            var now = new Date().getTime();
            if (this._lastUpdate > 0 && this._isRunning)
            {
                var dt = now - this._lastUpdate;
                if (dt < this._maxDelta)
                {
                    this._ttlTime += dt;
                    this._frameCnt++;
                    this._callback(dt);
                }
                else console.log("Animation frame dropped, dt=" + dt);
            }
            this._lastUpdate = now;

            // Request next frame if not stopped
            if (this._isRunning)
            {
                requestAnimationFrame(() => this.onFrameRequest());
            }
        }
    }
} 