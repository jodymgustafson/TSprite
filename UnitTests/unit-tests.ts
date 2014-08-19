/// <reference path="TSTest.ts" />
/// <reference path="../TSprite/Base.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../TSprite/Collections.ts" />

$(function ()
{
    var test = new TSTest.UnitTestSuite();
    test.addLogger(new TSTest.ElementLogger(<HTMLElement>document.querySelector("#results")));
    test.addUnitTest(new SpriteTests());
    test.addUnitTest(new PanelTests());
    test.run();
});
