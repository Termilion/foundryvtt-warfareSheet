
class WarfareSheet extends ActorSheet {

    moduleName = "warfare-sheet";

    changeValue = function(ev) {
        this.actor.setFlag(this.moduleName, ev.target.name, ev.target.value);
    }

    keyDown = function(ev) {
        if (ev.keyCode === 13) {
            this.changeValue(ev);
        }
    }

    async roll(attr) {
        let targets = Array.from(game.user.targets);
        console.log(targets);

        let modifier = await this.actor.getFlag(this.moduleName, attr);
        let r = new Roll("1d20 + @mod", {mod: modifier});
        r.evaluate();
        let total = r.total;
        r.toMessage();

        if (targets.length > 0 && (attr === "atk" || attr === "pow")) {
            targets.forEach(async t => {
                console.log(t);
                let targetAttr = attr === "atk" ? "def" : "tou";
                let dc = await t.actor.getFlag(this.moduleName, targetAttr);
                let type = attr === "atk" ? "Attack Roll" : "Power Roll";
                let success = total >= dc;
                let color = success ? "green": "red";
                let msg = success ? "Success": "Failure";
                ChatMessage.create(
                    {
                        user: game.user._id,
                        speaker: {
                            actor: this.actor,
                            alias: this.actor.name
                        },
                        content: `${type} against ${t.actor.name} (<b>DC ${dc}</b>): <span style="color:${color}">${msg}: ${total}!</span>`
                    }
                );
            });
        }
    }

    get template() {
        // adding the #equals and #unequals handlebars helper
        Handlebars.registerHelper('equals', function (arg1, arg2, options) {
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        });

        Handlebars.registerHelper('unequals', function (arg1, arg2, options) {
            return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
        });

        const path = "./module/templates/actors/";
        if (!game.user.isGM && this.actor.limited) return path + "limited-sheet.html";
        return "modules/warfare-sheet/template/npc-sheet.html";
    }

    static get defaultOptions() {
        const options = super.defaultOptions;

        mergeObject(options, {
            classes: ["sheet actor npc npc-sheet warfare-sheet"],
            width: 750,
            height: 400
        });
        return options;
    }

    async getData() {
        const sheetData = super.getData();

        // Base Attributes
        let atkModifier = await this.actor.getFlag(this.moduleName, "atk");
        if (!atkModifier) await this.actor.setFlag(this.moduleName, "atk", 0);
        atkModifier = await this.actor.getFlag(this.moduleName, "atk");

        let powModifier = await this.actor.getFlag(this.moduleName, "pow");
        if (!powModifier) await this.actor.setFlag(this.moduleName, "pow", 0);
        powModifier = await this.actor.getFlag(this.moduleName, "pow");

        let morModifier = await this.actor.getFlag(this.moduleName, "mor");
        if (!morModifier) await this.actor.setFlag(this.moduleName, "mor", 0);
        morModifier = await this.actor.getFlag(this.moduleName, "mor");

        let comModifier = await this.actor.getFlag(this.moduleName, "com");
        if (!comModifier) await this.actor.setFlag(this.moduleName, "com", 0);
        comModifier = await this.actor.getFlag(this.moduleName, "com");

        let defDC = await this.actor.getFlag(this.moduleName, "def");
        if (!defDC) await this.actor.setFlag(this.moduleName, "def", 10);
        defDC = await this.actor.getFlag(this.moduleName, "def");

        let touDC = await this.actor.getFlag(this.moduleName, "tou");
        if (!touDC) await this.actor.setFlag(this.moduleName, "tou", 10);
        touDC = await this.actor.getFlag(this.moduleName, "tou");

        // Other Attributes

        let tierValue = await this.actor.getFlag(this.moduleName, "tier");
        if (!tierValue) await this.actor.setFlag(this.moduleName, "tier", 1);
        tierValue = await this.actor.getFlag(this.moduleName, "tier");
        
        let dmgValue = await this.actor.getFlag(this.moduleName, "dmg");
        if (!dmgValue) await this.actor.setFlag(this.moduleName, "dmg", 1);
        dmgValue = await this.actor.getFlag(this.moduleName, "dmg");

        let sizeValue = await this.actor.getFlag(this.moduleName, "size");
        if (!sizeValue) await this.actor.setFlag(this.moduleName, "size", 6);
        sizeValue = await this.actor.getFlag(this.moduleName, "size");

        let numAtkValue = await this.actor.getFlag(this.moduleName, "numAtk");
        if (!numAtkValue) await this.actor.setFlag(this.moduleName, "numAtk", 1);
        numAtkValue = await this.actor.getFlag(this.moduleName, "numAtk");

        let attributes = await this.actor.getFlag(this.moduleName, "attributes");
        if (!attributes) await this.actor.setFlag(this.moduleName, "attributes", "regular, light, human, infantry");
        attributes = await this.actor.getFlag(this.moduleName, "attributes");

        let commander = await this.actor.getFlag(this.moduleName, "commander");
        if (!commander) await this.actor.setFlag(this.moduleName, "commander", "");
        commander = await this.actor.getFlag(this.moduleName, "commander");

        // Traits

        let trait_one = await this.actor.getFlag(this.moduleName, "trait_one");
        if (!trait_one) await this.actor.setFlag(this.moduleName, "trait_one", "adaptable");
        trait_one = await this.actor.getFlag(this.moduleName, "trait_one");

        let trait_two = await this.actor.getFlag(this.moduleName, "trait_two");
        if (!trait_two) await this.actor.setFlag(this.moduleName, "trait_two", "");
        trait_two = await this.actor.getFlag(this.moduleName, "trait_two");

        let trait_three = await this.actor.getFlag(this.moduleName, "trait_three");
        if (!trait_three) await this.actor.setFlag(this.moduleName, "trait_three", "");
        trait_three = await this.actor.getFlag(this.moduleName, "trait_three");

        let trait_four = await this.actor.getFlag(this.moduleName, "trait_four");
        if (!trait_four) await this.actor.setFlag(this.moduleName, "trait_four", "");
        trait_four = await this.actor.getFlag(this.moduleName, "trait_four");

        let trait_five = await this.actor.getFlag(this.moduleName, "trait_five");
        if (!trait_five) await this.actor.setFlag(this.moduleName, "trait_five", "");
        trait_five = await this.actor.getFlag(this.moduleName, "trait_five");


        // Sheet Data Base Attributes

        sheetData.atk = atkModifier;
        sheetData.pow = powModifier;
        sheetData.mor = morModifier;
        sheetData.com = comModifier;

        sheetData.def = defDC;
        sheetData.tou = touDC;


        // Sheet Data Other Attributes 
        switch (tierValue) {
            case 1:
                sheetData.tier = "I";
                break;
            case 2:
                sheetData.tier = "II";
                break;
            case 3:
                sheetData.tier = "III";
                break;
            case 4:
                sheetData.tier = "IV";
                break;
            case 5:
                sheetData.tier = "V";
                break;
            default:
                sheetData.tier = tierValue;
        }

        sheetData.dmg = dmgValue;
        sheetData.numAtk = numAtkValue;
        sheetData.size = sizeValue;

        sheetData.attributes = attributes;
        sheetData.commander = commander;

        sheetData.trait_one = trait_one;
        sheetData.trait_two = trait_two;
        sheetData.trait_three = trait_three;
        sheetData.trait_four = trait_four;
        sheetData.trait_five = trait_five;

        // Return data for rendering
        return sheetData;
    }

    /* -------------------------------------------- */
    /*  Event Listeners and Handlers
    /* -------------------------------------------- */

    /**
     * Activate event listeners using the prepared sheet HTML
     * @param html {HTML}   The prepared HTML object ready to be rendered into the DOM
     */
    activateListeners(html) {
        super.activateListeners(html);

        html.find('input').on("blur", ev => this.changeValue(ev));
        html.find('input').on("keydown", ev => this.keyDown(ev));

        html.find('#atkHandle').click(ev => this.roll("atk"));
        html.find('#powHandle').click(ev => this.roll("pow"));
        html.find('#morHandle').click(ev => this.roll("mor"));
        html.find('#comHandle').click(ev => this.roll("com"));
    }
}

//Register the Merchant sheet
Actors.registerSheet("core", WarfareSheet, {
    types: ["npc"],
    makeDefault: false
});

Hooks.once("init", () => {

    console.log("WARFARE | initialized");

    Handlebars.registerHelper('ifeq', function (a, b, options) {
        if (a == b) { return options.fn(this); }
        return options.inverse(this);
    });

    /*
    game.settings.register("warfare-sheet", "showStackWeight", {
        name: "Show Stack Weight?",
        hint: "If enabled, shows the weight of the entire stack next to the item weight",
        scope: "world",
        config: true,
        default: false,
        type: Boolean
    });
    */

});