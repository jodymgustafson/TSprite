module TSTest
{
    class AssertInfo
    {
        actual: any;
        expected: any;
        name: string;
    }

    /** Collection of assertion methods */
    export class Assert
    {
        /** Asserts that a value is true */
        public static isTrue(b: boolean, name: string = ""): void
        {
            Assert.areIdentical(true, b, name);
        }

        /** Asserts that a value is false */
        public static isFalse(b: boolean, name: string = ""): void
        {
            Assert.areIdentical(false, b, name);
        }

        /** Determines if two objects are identical using strict equality operator (===) */
        public static areIdentical(expected: any, actual: any, name: string = ""): void
        {
            if (expected !== actual)
            {
                Assert.fail(expected, actual, name);
            }
        }
        /** Determines if two objects are not identical using strict equality operator (===) */
        public static notIdentical(expected: any, actual: any, name: string = ""): void
        {
            if (expected === actual)
            {
                Assert.fail(expected, actual, name);
            }
        }

        /** Determines if two objects are equal using equality operator (==) */
        public static areEqual(expected: any, actual: any, name: string = ""): void
        {
            if (expected != actual)
            {
                Assert.fail(expected, actual, name);
            }
        }
        /** Determines if two objects are not equal using equality operator (==) */
        public static notEqual(expected: any, actual: any, name: string = ""): void
        {
            if (expected == actual)
            {
                Assert.fail(expected, actual, name);
            }
        }

        /** Throws a fail exception */
        public static fail(expected: any, actual: any, name: string = ""): void
        {
            var info = new AssertInfo();
            info.name = name;
            info.expected = expected;
            info.actual = actual;
            throw info;
        }
    }

    export interface ILogger
    {
        /** Starts a new test group with the specified name */
        startTestGroup(name: string): void;
        /** Ends a test group */
        endTestGroup(): void;
        /** Logs a test failed message */
        testFailed(expected: string, actual: string, name?: string): void;
        /** Logs a test passed message */
        testPassed(name?: string): void;
        /** Logs a message */
        log(msg: string): void;
        /** Logs an error message */
        error(msg: string): void;
    }

    /** Implements a logger that logs to the page */
    export class ElementLogger implements ILogger
    {
        public logElement: HTMLElement;
        private curElement: HTMLElement;

        /** @param $parent (optional) The parent element to append results to. If not defined appends to document */
        constructor(parent?: HTMLElement)
        {
            this.logElement = this.createDiv("", "tstest-log");
            if (!parent)
            {
                document.appendChild(this.logElement);
            }
            else
            {
                parent.appendChild(this.logElement);
            }
            this.curElement = this.logElement;

            this.addStyle();
        }

        public startTestGroup(name: string): void
        {
            var header = this.createDiv(name, "test-header", "test-pass");
            this.curElement.appendChild(header);

            var group = this.createDiv("", "test-group");
            this.curElement.appendChild(group);
            this.curElement = group;
        }

        public endTestGroup(): void
        {
            this.curElement = this.curElement.parentElement;
        }

        public testFailed(expected: string, actual: string, name = "Result"): void
        {
            var msg = (name || "unnamed") + ": Expected: " + expected + ", Actual: " + actual;
            var div = this.createDiv(msg, "test-fail");
            this.curElement.appendChild(div);
            this.propogateFail();
        }

        public testPassed(name = "Result"): void
        {
            var msg = name + ": Passed";
            var div = this.createDiv(msg, "test-pass");
            this.curElement.appendChild(div);
        }

        public log(msg: string): void
        {
            var div = this.createDiv(msg);
            this.curElement.appendChild(div);
        }

        public error(msg: string): void
        {
            var div = this.createDiv(msg, "test-error");
            this.curElement.appendChild(div);
            this.propogateFail();
        }

        private propogateFail()
        {
            // Change the class of each parent group's header to fail
            var header = <HTMLElement>this.curElement.previousElementSibling;
            while (header && header.classList.contains("test-header"))
            {
                header.classList.remove("test-pass");
                header.classList.add("test-fail");
                header = <HTMLElement>header.parentElement.previousElementSibling;
            }
        }

        private createDiv(text: string, ...classNames: string[]): HTMLElement
        {
            var div = document.createElement("div");
            if (text) div.textContent = text;
            classNames.forEach((name) => div.classList.add(name));
            return div;
        }

        private addStyle()
        {
            var style = document.createElement("style");
            style.type = "text/css";
            var css =
                ".tstest-log { font-size: 1em; }" +
                ".tstest-log .test-pass { color: green; }" +
                ".tstest-log .test-fail { color: red; }" +
                ".tstest-log .test-error { color: red; }" +
                ".tstest-log .test-group{padding-left: 2em; border-left: 1px dotted silver;}" +
                ".tstest-log .test-header{font-weight: bold; font-size: 1.2em;}";
            style.appendChild(document.createTextNode(css));

            this.logElement.appendChild(style);
        }
    }

    /** Implements a logger that logs to the console */
    export class ConsoleLogger implements ILogger
    {
        private indent = "";

        public startTestGroup(name: string): void
        {
            this.log(name);
            this.indent += "  ";
        }

        public endTestGroup(): void
        {
            this.indent = this.indent.slice(2);
        }

        public testFailed(expected: string, actual: string, name = "Result"): void
        {
            var msg = (name || "unnamed") + ": Expected: " + expected + ", Actual: " + actual;
            this.error(msg);
        }

        public testPassed(name = "Result"): void
        {
            var msg = name + ": Passed";
            this.log(msg);
        }

        public log(msg: string): void
        {
            console.log(this.indent + msg);
        }

        public error(msg: string): void
        {
            console.error(this.indent + msg);
        }
    }

    /** Base class for all unit test classes. Test methods must be prefixed with "test". */
    export class UnitTest
    {
        public assert = TSTest.Assert;

        /** Setup method called before any tests have been run. Override to provide custom setup. */
        public setUp(): void
        {
        }
        /** Tear down method called after all tests have been run. Override to provide custom teardown. */
        public tearDown(): void
        {
        }

        /** Iterates over all of the test methods (those that start with "test") */
        public each(callback: (fn: Function, name: string) => any): void
        {
            for (var name in this)
            {
                if (name.indexOf("test") === 0 && typeof (this[name]) === 'function')
                {
                    callback(this[name], name);
                }
            }
        }
    }

    /** Defines a unit test suite, which is a collection of unit tests */
    export class UnitTestSuite
    {
        private unitTests: UnitTest[] = [];
        private errorCount = 0;
        private logs: ILogger[] = [];

        constructor()
        {
            this.addLogger(new ConsoleLogger());
        }

        /** Adds a logger to log test output to */
        public addLogger(logger: ILogger): UnitTestSuite
        {
            this.logs.push(logger);
            return this;
        }

        /** Adds a unit test class */
        public addUnitTest(test: UnitTest): UnitTestSuite
        {
            this.unitTests.push(test);
            return this;
        }

        /** Runs all of the unit tests added by addUNitTest() */
        public run(): void
        {
            this.logs.forEach((log) => log.startTestGroup("Starting Tests: " + new Date().toString() + "..."));
            var count = 0;
            this.errorCount = 0;

            this.unitTests.forEach((unitTest) =>
            {
                count += this.runUnitTest(unitTest);
            });

            this.logs.forEach((log) => log.endTestGroup());
            this.logs.forEach((log) => log.startTestGroup(count + " Tests Completed: " + new Date().toString()));
            this.logs.forEach((log) => log.log((count - this.errorCount) + " tests passed"));
            if (this.errorCount)
            {
                this.logs.forEach((log) => log.error(this.errorCount + " tests failed"));
            }
            this.logs.forEach((log) => log.endTestGroup());
        }

        private runUnitTest(unitTest: UnitTest): number
        {
            this.logs.forEach((log) => log.startTestGroup("Test Group: " + unitTest["constructor"]["name"]));
            var count = 0;

            unitTest.setUp();

            unitTest.each((testFn: Function, name: string) =>
            {
                this.logs.forEach((log) => log.startTestGroup("Test: " + name));
                try
                {
                    testFn.call(unitTest);
                    this.logs.forEach((log) => log.testPassed(name));
                }
                catch (ex)
                {
                    this.errorCount++;
                    if (ex instanceof AssertInfo)
                    {
                        // Assertion exception
                        this.logs.forEach((log) => log.testFailed(ex.expected, ex.actual, ex.name));
                    }
                    else
                    {
                        // Must be a system exception
                        this.logs.forEach((log) => log.error(ex));
                    }
                }
                count++;
                this.logs.forEach((log) => log.endTestGroup());
            });

            unitTest.tearDown();

            this.logs.forEach((log) => log.endTestGroup());
            return count;
        }
    }
}