/// <reference path="../TSprite/Base.ts" />
/// <reference path="../TSprite/Collections.ts" />
/// <reference path="../TSprite/Canvas.ts" />
class SpriteTests extends TSTest.UnitTest
{
    public testCollisions()
    {
        var s1 = new TSprite.Sprite(100, 100);
        var s2 = new TSprite.Sprite(100, 100);

        s1.moveTo(0, 0);
        s2.moveTo(50, 50);
        this.assert.isTrue(s1.intersects(s2), "1.1");
        this.assert.isTrue(s2.intersects(s1), "1.2");

        s2.moveTo(100, 100);
        this.assert.isFalse(s1.intersects(s2));
        this.assert.isFalse(s2.intersects(s1));
    }

    public testBorderCollisions()
    {
        var s1 = new TSprite.Sprite(100, 100);
        var s2 = new TSprite.Sprite(100, 100);

        s1.moveTo(0, 0);
        s2.moveTo(50, 50);
        this.assert.areIdentical(TSprite.BorderFlags.BOTTOM | TSprite.BorderFlags.RIGHT, s1.intersectsBorders(s2), "1.1");
        this.assert.areIdentical(TSprite.BorderFlags.TOP | TSprite.BorderFlags.LEFT, s2.intersectsBorders(s1), "1.2");

        s2.moveTo(100, 100);
        this.assert.areIdentical(TSprite.BorderFlags.NONE, s1.intersectsBorders(s2), "2.1");
    }

    public testCollisionAreas()
    {
        var s1 = new TSprite.Sprite(100, 100);
        s1.addCollisionArea(10, 0, 80, 100);

        var s2 = new TSprite.Sprite(100, 100);

        s1.moveTo(100, 100);
        s2.moveTo(150, 150);
        this.assert.isTrue(s1.intersects(s2), "1.1");
        this.assert.isTrue(s2.intersects(s1), "1.2");

        s2.addCollisionArea(10, 0, 80, 100);
        this.assert.isTrue(s1.intersects(s2), "2.1");
        this.assert.isTrue(s2.intersects(s1), "2.2");

        s2.moveTo(200, 200);
        this.assert.isFalse(s1.intersects(s2), "3.1");
        this.assert.isFalse(s2.intersects(s1), "3.2");

        s2.moveTo(170, 170);
        this.assert.isTrue(s1.intersects(s2), "4.1");
        this.assert.isTrue(s2.intersects(s1), "4.2");
    }

    public testMultipleCollisionAreas()
    {
        var s1 = new TSprite.Sprite(100, 100);
        s1.addCollisionArea(0, 0, 50, 50);
        s1.addCollisionArea(50, 50, 50, 50);

        var s2 = new TSprite.Sprite(100, 100);
        s2.addCollisionArea(0, 0, 50, 50);
        s2.addCollisionArea(50, 50, 50, 50);

        s1.moveTo(100, 100);
        s2.moveTo(150, 150);
        this.assert.isTrue(s1.intersects(s2), "1.1");
        this.assert.isTrue(s2.intersects(s1), "1.2");

        s2.moveTo(149, 100);
        this.assert.isTrue(s1.intersects(s2), "2.1");
        this.assert.isTrue(s2.intersects(s1), "2.2");

        s2.moveTo(51, 100);
        this.assert.isTrue(s1.intersects(s2), "3.1");
        this.assert.isTrue(s2.intersects(s1), "3.2");

        s2.moveTo(5, 100);
        this.assert.isFalse(s1.intersects(s2), "4.1");
        this.assert.isFalse(s2.intersects(s1), "4.2");
    }

    public testVelocity()
    {
        var s1 = new TSprite.Sprite(100, 100, 10, 5);
        s1.moveTo(100, 100);
        s1.update(0);
        this.assert.areIdentical(100, s1.x, "1.1");
        this.assert.areIdentical(100, s1.y, "1.2");

        s1.update(1000);
        this.assert.areIdentical(110, s1.x, "2.1");
        this.assert.areIdentical(105, s1.y, "2.2");

        s1.setVelocity(5, 10);
        s1.update(1000);
        this.assert.areIdentical(115, s1.x, "3.1");
        this.assert.areIdentical(115, s1.y, "3.2");

        s1.active = false;
        s1.update(1000);
        this.assert.areIdentical(115, s1.x, "4.1");
        this.assert.areIdentical(115, s1.y, "4.2");
    }

    public testOrderedSpriteList()
    {
        // Need to reset so ids match below
        TSprite.resetUID(0);

        var list = new TSprite.Collections.OrderedSpriteList((s1, s2) =>
        {
            return s2.x - s1.x;
        });

        this.assert.isTrue(list.isEmpty());
        this.assert.areIdentical(list.count, 0);
        list.add(new TSprite.Sprite().moveTo(20, 0)); //id=0
        this.assert.areIdentical(list.count, 1);
        this.assert.isFalse(list.isEmpty());
        list.add(new TSprite.Sprite().moveTo(30, 0)); //id=1
        this.assert.areIdentical(list.count, 2);
        list.add(new TSprite.Sprite().moveTo(10, 0)); //id=2
        this.assert.areIdentical(list.count, 3);
        this.assert.areIdentical("2,0,1", list.toString());
        this.assert.areIdentical(list.itemAt(0).id, "2");
        this.assert.areIdentical(list.itemAt(1).id, "0");
        this.assert.areIdentical(list.itemAt(2).id, "1");

        list.add(new TSprite.Sprite().moveTo(25, 0)); //id=3
        this.assert.areIdentical(list.count, 4);
        this.assert.areIdentical(list.toString(), "2,0,3,1");

        list.add(new TSprite.Sprite().moveTo(1, 0)); //id=4
        this.assert.areIdentical(list.count, 5);
        this.assert.areIdentical(list.toString(), "4,2,0,3,1");

        var s = new TSprite.Sprite().moveTo(100, 0);
        list.add(s); //id=5
        this.assert.areIdentical(list.count, 6);
        this.assert.areIdentical(list.toString(), "4,2,0,3,1,5");
        list.removeSprite(s);
        this.assert.areIdentical(list.count, 5);

        list.removeAt(3);
        list.removeAt(1);
        this.assert.areIdentical(list.count, 3);
        this.assert.areIdentical(list.toString(), "4,0,1");
        list.removeAt(0);
        this.assert.areIdentical(list.count, 2);
        this.assert.areIdentical(list.toString(), "0,1");
        list.removeAt(1);
        this.assert.areIdentical(list.count, 1);
        this.assert.areIdentical(list.toString(), "0");
        list.removeAt(0);
        this.assert.areIdentical(list.count, 0);
        this.assert.areIdentical(list.toString(), "");
        this.assert.isTrue(list.isEmpty());
    }

    public testContains()
    {
        var s1 = new TSprite.Sprite(100, 100)
        s1.moveTo(100, 100);
        this.assert.isTrue(s1.contains(150, 150), "1.1");
        this.assert.isFalse(s1.contains(50, 50), "1.2");
    }

    public testAnimatedSprite()
    {
        var img = new Image();
        img.width = 100;
        img.height = 100;
        var frames = new TSprite.Canvas.ImageAnimationFrames(img, 32, 32, 2, 3);
        var s1 = new TSprite.Canvas.AnimatedSprite(frames, 10);
        this.assert.areIdentical(0, frames["frameIdx"], "1.1");
        s1.update(100);
        this.assert.areIdentical(1, frames["frameIdx"], "1.2");
        s1.update(150);
        this.assert.areIdentical(2, frames["frameIdx"], "1.3");
        s1.update(150);
        this.assert.areIdentical(3, frames["frameIdx"], "1.4");
        s1.update(10);
        this.assert.areIdentical(3, frames["frameIdx"], "1.5");

        frames.moveTo(5);
        this.assert.areIdentical(5, frames["frameIdx"], "1.6");
        // Should circle around back to frame 0
        s1.update(100);
        this.assert.areIdentical(0, frames["frameIdx"], "1.7");
    }
}