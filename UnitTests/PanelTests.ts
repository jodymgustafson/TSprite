/// <reference path="../TSprite/Base.ts" />
/// <reference path="../TSprite/Panel.ts" />

class PanelTests extends TSTest.UnitTest
{
    public testCheckBounds()
    {
        var s1 = new TSprite.Sprite(10, 10, 10, 10);
        var p1 = new TSprite.Panel(10, 10, 100, 100);

        // Touching bounds
        this.assert.areIdentical(TSprite.BorderFlags.TOP | TSprite.BorderFlags.LEFT, p1.checkBounds(s1), "1.1");
        this.assert.isTrue(TSprite.BorderCheck.top(p1.checkBounds(s1)), "1.2");
        this.assert.isTrue(TSprite.BorderCheck.left(p1.checkBounds(s1)), "1.3");
        this.assert.isFalse(TSprite.BorderCheck.bottom(p1.checkBounds(s1)), "1.4");
        this.assert.isFalse(TSprite.BorderCheck.right(p1.checkBounds(s1)), "1.5");
        this.assert.isTrue(TSprite.BorderCheck.topOrBottom(p1.checkBounds(s1)), "1.6");
        this.assert.isTrue(TSprite.BorderCheck.leftOrRight(p1.checkBounds(s1)), "1.7");

        // Move inside bounds
        s1.moveTo(50, 50);
        this.assert.areIdentical(TSprite.BorderFlags.NONE, p1.checkBounds(s1), "2.1");
        this.assert.isFalse(TSprite.BorderCheck.topOrBottom(p1.checkBounds(s1)), "2.2");
        this.assert.isFalse(TSprite.BorderCheck.leftOrRight(p1.checkBounds(s1)), "2.3");

        // Move outside of bounds
        s1.moveTo(150, 150);
        this.assert.areIdentical(TSprite.BorderFlags.BOTTOM | TSprite.BorderFlags.RIGHT, p1.checkBounds(s1), "3.1");
        this.assert.isFalse(TSprite.BorderCheck.top(p1.checkBounds(s1)), "3.2");
        this.assert.isFalse(TSprite.BorderCheck.left(p1.checkBounds(s1)), "3.3");
        this.assert.isTrue(TSprite.BorderCheck.bottom(p1.checkBounds(s1)), "3.4");
        this.assert.isTrue(TSprite.BorderCheck.right(p1.checkBounds(s1)), "3.5");
        this.assert.isTrue(TSprite.BorderCheck.topOrBottom(p1.checkBounds(s1)), "3.6");
        this.assert.isTrue(TSprite.BorderCheck.leftOrRight(p1.checkBounds(s1)), "3.7");
    }

    public testRestrictBounds()
    {
        var s1 = new TSprite.Sprite(0, 0, 10, 10);
        var p1 = new TSprite.Panel(10, 10, 100, 100);

        var bounds = p1.restrictBounds(s1);
        this.assert.areIdentical(10, s1.x, "1.1");
        this.assert.areIdentical(10, s1.y, "1.2");
        this.assert.areIdentical(TSprite.BorderFlags.TOP | TSprite.BorderFlags.LEFT, bounds, "1.3");
        this.assert.isTrue(TSprite.BorderCheck.top(bounds), "1.4");
        this.assert.isTrue(TSprite.BorderCheck.left(bounds), "1.5");

        // Straddle bounds
        s1.moveTo(105, 105);
        var bounds = p1.restrictBounds(s1);
        this.assert.areIdentical(100, s1.x, "2.1");
        this.assert.areIdentical(100, s1.y, "2.2");
        this.assert.areIdentical(TSprite.BorderFlags.BOTTOM | TSprite.BorderFlags.RIGHT, bounds, "2.3");
        this.assert.isTrue(TSprite.BorderCheck.bottom(bounds), "2.4");
        this.assert.isTrue(TSprite.BorderCheck.right(bounds), "2.5");
    }
} 