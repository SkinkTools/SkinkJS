/**
 * Check & sync files against package.json's version.
 *
 * ### Usage
 *
 * | Action                                 | Command                 |
 * |----------------------------------------|-------------------------|
 * | Check (no changes written)             | `npm run version-check` |
 * | Sync (write to README.md / jsdoc.json) | `npm run version-sync`  |
 *
 * These pass `check` and `sync` as the first arg of this script.
 *
 * ### TODO
 *
 * This thing is a brittle workaround which may need to be replaced.
 * It exists because JsDoc and the current theme don't listen to the
 * version config values.
 *
 */

const {resolve} = require('path');
const fs = require('fs');

// TODO: replace the theme or JsDoc entirely (nastiest stuff ever here D:>)
TARGETS = [
    {
        path: resolve(__dirname, '../README.md'),
        pattern: /Version ([0-9]+\.[0-9]+\.[0-9]+)/g
    },
    {
        path: resolve(__dirname, "../jsdoc.json"),
        pattern: /\/skinkjs\/([0-9]+\.[0-9]+\.[0-9]+)/g
    }
];


// Brittle but we'll get there when we need to. :)
const package = require(resolve(__dirname, "../package.json"));
const {version} = package;

// Some styling spaghetti while we learn more about the state of Node's console
const DEFAULT = 0; // Resets all to default
const FG = {
    GREEN  : 32,
    YELLOW : 33,
    RED    : 31,
    WHITE  : 37
};
const BG = {
    RED    : 41,
    GREEN  : 42
}
const BAD = {fg: FG.WHITE, bg: BG.RED};

function _fmtColor(color = DEFAULT) {
    use = [];
    if(typeof color === 'number') use.push(color);
    else {
        const {fg = undefined, bg = undefined} = color;
        if(bg) use.push(bg);
        if(fg) use.push(fg);
    }
    return use
        .map(code => "\x1b[" + code.toString() + "m")
        .join('');
    }
function color(color, ...values) {
    return [
        _fmtColor(color),
        ...values,
        _fmtColor()
    ].join('');
}


function syncFile(action, {path, pattern, version = version} = {}) {
    // Grab data
    const fileText = fs.readFileSync(path, 'utf8');
    const matches = [...fileText.matchAll(pattern)];
    if(! matches.length) {
        console.error(color(BAD,`CRITICAL: failed to find version in ${JSON.stringify(path)}`));
        process.exit(-1);
    }
    let isOk = true;
    let replaced = 0;
    for(const [fileVerFull, fileVerOnly] of matches) {
        if(version !== fileVerOnly) {
            if(action === 'sync') {
                console.log(`SYNC: Replacing ${fileVerOnly} with ${version}!`);
                const fullReplaced = fileVerFull.replace(fileVerOnly, version);
                const replaced = fileText.replace(fileVerFull, fullReplaced);
                fs.writeFileSync(path, replaced);
                replaced += 1;
                console.log(color(FG.GREEN, `DONE: Replaced version with ${version}!`));
            } else {
                isOk = false;
            }
        }
    }
    if(replaced === 0) {
        const word = action === 'sync' ? 'SKIP' : 'OKAY';
        console.log(color(FG.GREEN, `${word}: ${path} already up to date`));
    }
    return {path, status: isOk};
}

function main(argv = process.argv) {
    let action = null;
    let allOk = true;
    if(argv.length === 3) {
        const maybeAction = argv[2];
        switch(maybeAction) {
            case "check":
            case "sync":
                action = maybeAction;
            default:
                break;
        }
    }
    if(! action) {
        console.error(color(
            FG.RED, 'ERROR: Use exactly one of \'check\' or \'sync\''));
        process.exit(-1);
    }
    const results = [];
    function recordResult(result) {
        results.push(result);
        allOk &= result.status;
    }
    for(const config of TARGETS) {
        recordResult(syncFile(action, {...config, version}));
    }
    if(allOk) {
        console.log(
            color({fg: FG.WHITE, bg: BG.GREEN}, `GOOD: All files synced!`));
    } else {
        console.log(
            color(
                FG.RED,
                `ERROR: ${path} ${fileVerOnly} DIFFERS from ${version}!`
            )
        );

        // Important: tell beginners how to fix this
        const tips = [
            `# *May* be fixed by:`,
            `# Command            | Comment`,
            `npm run version-sync  # Sync files to package.json`
        ];
        for(const {status, result} of results) {
            if(status) continue;
            tips.push(`git add ${r.path}`);
        }
        tips.push(`git commit           # Add interactive git commit`);
        tips.push(`git push             # Push your branch`);
        console.error(color(FG.YELLOW, tips.join("\n")));
    }
}

main();





