/// <reference path="tsUnit.ts" />
/// <reference path="../src/TSprite/Base.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../src/TSprite/Collections.ts" />

class UnitTests extends tsUnit.TestClass
{
    public testOrderedSpriteList()
    {
        var list = new TSprite.Collections.OrderedSpriteList((s1, s2) =>
        {
            return s2.x - s1.x;
        });

        this.isTrue(list.isEmpty());
        this.areIdentical(list.count, 0);
        list.add(new TSprite.Sprite(20, 0)); //id=0
        this.areIdentical(list.count, 1);
        this.isFalse(list.isEmpty());
        list.add(new TSprite.Sprite(30, 0)); //id=1
        this.areIdentical(list.count, 2);
        list.add(new TSprite.Sprite(10, 0)); //id=2
        this.areIdentical(list.count, 3);
        this.areIdentical(list.toString(), "2,0,1");
        this.areIdentical(list.itemAt(0).id, "2");
        this.areIdentical(list.itemAt(1).id, "0");
        this.areIdentical(list.itemAt(2).id, "1");

        list.add(new TSprite.Sprite(25, 0)); //id=3
        this.areIdentical(list.count, 4);
        this.areIdentical(list.toString(), "2,0,3,1");

        list.add(new TSprite.Sprite(1, 0)); //id=4
        this.areIdentical(list.count, 5);
        this.areIdentical(list.toString(), "4,2,0,3,1");

        list.removeAt(3);
        list.removeAt(1);
        this.areIdentical(list.count, 3);
        this.areIdentical(list.toString(), "4,0,1");
        list.removeAt(0);
        this.areIdentical(list.count, 2);
        this.areIdentical(list.toString(), "0,1");
        list.removeAt(1);
        this.areIdentical(list.count, 1);
        this.areIdentical(list.toString(), "0");
        list.removeAt(0);
        this.areIdentical(list.count, 0);
        this.areIdentical(list.toString(), "");
        this.isTrue(list.isEmpty());
    }
}

$(function ()
{
    var test = new tsUnit.Test();

    // add your test class (you can call this multiple times)
    test.addTestClass(new UnitTests());

    // Use the built in results display
    test.showResults(document.getElementById('results'), test.run());
});
