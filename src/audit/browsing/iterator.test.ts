import assert from "node:assert";
import sinon from "sinon";
import { Action } from "./action.js";
import { ClickAction } from "./actions/click.js";
import { FillAction } from "./actions/fill.js";
import { GotoAction } from "./actions/goto.js";
import { PageAction } from "./actions/page.js";
import { ProcedureAction } from "./actions/procedure.js";
import { ScenarioAction } from "./actions/scenario.js";
import { WaitAction } from "./actions/wait.js";
import { ActionIterator } from "./iterator.js";
import { Context } from "../context.js";
import { defaultConfig } from "../config.js";

describe("ActionIterator", () => {
    it("should iterate through and run actions", async () => {
        const fakeRun = sinon.fake.returns(Promise.resolve());
        function fake<A extends Action>(action: A): A {
            sinon.replace(action, "run", fakeRun);
            return action;
        }
        const iterator = new ActionIterator(
            [
                fake(new ScenarioAction("", { name: "Profile" })),
                fake(new GotoAction("", { url: "/profile" })),
                fake(new ProcedureAction("", { name: "login" })),
                fake(new WaitAction("", { selector: ".profile" })),
                fake(new PageAction("", { selector: "Profile page" })),
            ],
            {
                "login": [
                    fake(new PageAction("", { name: "Login page" })),
                    fake(new FillAction("", { selector: "#user", value: "user" })),
                    fake(new ClickAction("", { selector: "#submit" })),
                ]
            }
        );
        const ctx = new Context(defaultConfig);
        let i = 0;
        while (iterator.hasNext() && i++ < 10) {
            await iterator.runNext(ctx);
        }
        assert.strictEqual(i, 7);
        assert.strictEqual(fakeRun.callCount, 7);
        assert.rejects(() => iterator.runNext(ctx));
    });
});