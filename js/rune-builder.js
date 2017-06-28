$(document).ready(function () {
    var rune = {
        standardDamageGlyphs: [],
        standardConditionGlyphs: [],
        standardUntypedGlyphs: [],
        modifierGlyphs: [],
        limiterGlyphs: [],
        controlGlyphs: []
    };

    $(".add-standard-damage-glyph").click(function () {
        var glyph = {
            id: $(this).data("id"),
            word: $(this).data("word"),
            threadPoints: $(this).data("threadPoints"),
            damageTypeId: $(this).data("damageTypeId"),
            damageType: $(this).data("damageType"),
            damageDie: $(this).data("damageDie")
        };
        rune.standardDamageGlyphs.push(glyph);

        updateRune(rune);
    });

    $(".add-standard-condition-glyph").click(function () {
        var glyph = {
            id: $(this).data("id"),
            word: $(this).data("word"),
            threadPoints: $(this).data("threadPoints"),
            conditionTypeId: $(this).data("conditionTypeId"),
            conditionType: $(this).data("conditionType"),
            initialIntensity: $(this).data("initialIntensity"),
            additionalIntensity: $(this).data("additionalIntensity"),
            unit: $(this).data("unit")
        };
        rune.standardConditionGlyphs.push(glyph);

        updateRune(rune);
    });

    $(".add-standard-untyped-glyph").click(function () {
        var glyph = {
            id: $(this).data("id"),
            word: $(this).data("word"),
            threadPoints: $(this).data("threadPoints"),
            applicableTimes: $(this).data("applicableTimes"),
            effect: $(this).data("effect"),
            modifiedArmorClass:  $(this).data("modifiedArmorClass"),
            checkAdvantageId: $(this).data("checkAdvantageId"),
            checkAdvantage: $(this).data("checkAdvantage"),
            resistanceId: $(this).data("resistanceId"),
            resistance: $(this).data("resistance"),
            difficultTerrain: $(this).data("difficultTerrain"),
            cessationMultiplier: $(this).data("cessationMultiplier")
        };
        rune.standardUntypedGlyphs.push(glyph);

        updateRune(rune);
    });

    $(".add-modifier-glyph").click(function () {
        var glyph = {
            id: $(this).data("id"),
            word: $(this).data("word"),
            initialThreadPointMultiplier: $(this).data("initialThreadPointMultiplier"),
            multiplierType: $(this).data("multiplierType"),
            applicableTimes: $(this).data("applicableTimes")
        };
        rune.modifierGlyphs.push(glyph);

        updateRune(rune);
    });

    $(".add-limiter-glyph").click(function () {
        var glyph = {
            id: $(this).data("id"),
            word: $(this).data("word"),
            threadPoints: $(this).data("threadPoints"),
            initialThreadPointMultiplier: $(this).data("initialThreadPointMultiplier"),
            additionalThreadPointMultiplier: $(this).data("initialThreadPointMultiplier"),
            applicableTimes: $(this).data("applicableTimes"),
            applicableTypes: $(this).data("applicableTypes"),
            effect: $(this).data("effect"),
            savingThrowId: $(this).data("savingThrowId"),
            savingThrow: $(this).data("savingThrow")
        };
        rune.limiterGlyphs.push(glyph);

        updateRune(rune);
    });

    $(".add-control-glyph").click(function () {
        var glyph = {
            id: $(this).data("id"),
            word: $(this).data("word")
        };
        rune.controlGlyphs.push(glyph);

        updateRune(rune);
    });
});

function updateRune(rune) {
    var threadPoints = generateRuneThreadPoints(rune);
    var words = generateRunePhrase(rune);
    var damage = generateRuneDamage(rune);
    var conditions = generateRuneConditions(rune);

    validate(rune);

    displayRune(threadPoints, words, damage, conditions);
}

function displayRune(threadPoints, words, damage, conditions) {
    $("#thread-points").val(threadPoints);
    $("#words").val(words);
    $("#damage-dice").val(damage);
    $("#conditions").val(conditions);
}

function generateRuneThreadPoints(rune) {
    var threadPoints = 0;

    for (var glyphs in rune) {
        if (rune.hasOwnProperty(glyphs)) {
            for (var glyph in rune[glyphs]) {
                if (rune[glyphs].hasOwnProperty(glyph)) {
                    threadPoints += rune[glyphs][glyph].threadPoints;
                }
            }
        }
    }

    return threadPoints;
}

function generateRunePhrase(rune) {
    var phrase = [];
    var phraseFormatted = "";

    for (var glyphs in rune) {
        if (rune.hasOwnProperty(glyphs)) {
            for (var glyph in rune[glyphs]) {
                if (rune[glyphs].hasOwnProperty(glyph)) {
                    phrase[rune[glyphs][glyph].word] = (phrase[rune[glyphs][glyph].word] || 0) + 1;
                }
            }
        }
    }

    for (var word in phrase) {
        phraseFormatted += word + "(" + phrase[word] + ")";
    }

    return phraseFormatted;
}

function generateRuneDamage(rune) {
    var damageDice = [];
    var damageDiceFormatted = "";

    rune.standardDamageGlyphs.map(
        function(glyph) {
            var die = glyph.damageDie.slice(1, 3) + " " + glyph.damageType;
            var count = Number(glyph.damageDie.slice(0, 1));

            damageDice[die] = (damageDice[die] || 0) + count;
        }
    );

    for(var die in damageDice) {
        damageDiceFormatted += damageDice[die] + die;
    }

    return damageDiceFormatted;
}

function generateRuneConditions(rune) {
    var conditions = [];
    var conditionsFormatted = "";

    rune.standardConditionGlyphs.map(
        function(glyph) {
            if (!(glyph.conditionType in conditions)) {
                conditions[glyph.conditionType] = { intensity: glyph.initialIntensity, unit: glyph.unit }
            } else {
                conditions[glyph.conditionType].intensity += glyph.additionalIntensity;
            }
        }
    );

    for(var condition in conditions) {
        conditionsFormatted += condition + "(" + conditions[condition].intensity + conditions[condition].unit + ")";
    }

    return conditionsFormatted;
}

function validate(rune) {
    if(rune.standardDamageGlyphs.length + rune.standardConditionGlyphs.length > rune.limiterGlyphs.length) {
        $("#status").val("Invalid Rune");
    } else {
        $("#status").val("Valid Rune");
    }
}