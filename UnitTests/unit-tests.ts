/// <reference path="TSTest.ts" />

document.addEventListener("DOMContentLoaded", () =>
{
    new TSTest.UnitTestSuite()
        .addLogger(new TSTest.ElementLogger(document.getElementById("results")))
        .addUnitTest(new SpriteTests())
        .addUnitTest(new PanelTests())
        .run();
});
