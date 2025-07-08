/**
 * Check & sync README.md against package.json's version.
 *
 * Usage:
 * | Action                            | Command                 |
 * |-----------------------------------|-------------------------|
 * | Check (no changes written)        | `npm run version-check` |
 * | Sync (write changes to README.md) | `npm run version-sync`  |
 * 
 * These pass `check` and `sync` as the first arg of this script.
 * Yes, it's brittle, but it's *very* colorful.
 */

const path = require('path');
const fs = require('fs');

// Brittle but we'll get there when we need to. :)
const package = require(path.resolve(__dirname, "../package.json"));
const {version} = package;
const VERSION_RE = /Version ([0-9]+\.[0-9]+\.[0-9]+)/;
const README_PATH = path.resolve(__dirname, '../README.md');

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


let action = null;

const args = process.argv.slice(2);
if(args.length === 1) {
    switch(args[0]) {
        case "check":
        case "sync":
            action = args[0]; break;
        default:
    }
}
if(! action) {
    console.error(color(FG.RED, 
        'ERROR: Use exactly one of \'check\' or \'sync\''));
    process.exit(-1);
}

// Grab data
const readme = fs.readFileSync(README_PATH, 'utf8');
const match = readme.match(VERSION_RE);
if(! match) {
    console.error(color(BAD,`CRITICAL: failed to find version in README.md?`))
    process.exit(-1);
}
const [readMeVerFull, readmeVerOnly] = match;

// Actually do something with it
if(version !== readmeVerOnly) {
    if(action === 'sync') {
        console.log(`SYNC: Replacing ${readmeVerOnly} with ${version}!`);
        const fullReplaced = readMeVerFull.replace(readmeVerOnly, version);
        const replaced = readme.replace(readMeVerFull, fullReplaced);
        fs.writeFileSync(README_PATH, replaced);
        console.log(color({fg: FG.WHITE, bg: BG.GREEN}, `DONE: Replaced version with ${version}!`));
    } else {
        console.log([
            color(FG.RED,   `ERROR: ${readmeVerOnly} DIFFERS from ${version}!`),
            // Important: tell beginners how to fix this
            color(FG.YELLOW, [
            `# *May* be fixed by:`,
            `# Command            | Comment`,
            `npm run version-sync  # Sync REAMDE.md to package.json`,
            `git add README.md     # Add to git`,
            `git commit            # Add interactive git commit`,
            `git push              # Push your branch`
            ].join("\n"))
        ].join('\n'));
        process.exit(-1);
    }
}

else {
    console.log(color(FG.GREEN, `SKIP: ${version} already in README.md`));
}
