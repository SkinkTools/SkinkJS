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

const fs = require('fs');

const {getResolverForRoot, matchAllInFile} = require("./console/paths.js");
const here = getResolverForRoot(__dirname);

const {color} = require(here("console/colors.js"));
const presets = color.presets;

// TODO: replace the theme or JsDoc entirely (nastiest stuff ever here D:>)
TARGETS = [
    {
        path: here('../README.md'),
        pattern: /Version ([0-9]+\.[0-9]+\.[0-9]+)/g
    },
    {
        path: here("../jsdoc.json"),
        pattern: /\/skinkjs\/([0-9]+\.[0-9]+\.[0-9]+)/g
    }
];


// Brittle but we'll get there when we need to. :)
const package = require(here("../package.json"));
const {version} = package;

function syncFile(action, {path, pattern, version = version} = {}) {
    const {text, matches} = matchAllInFile(path, pattern);

    if(! matches.length) {
        presets.critical(`CRITICAL: failed to find version in ${JSON.stringify(path)}`);
        process.exit(-1);
    }
    const result = {
        differing: []
    };
    let isOk = true;
    let replaced = 0;
    let currentRevision = text;
    for(const [fileVerFull, fileVerOnly] of matches) {
        if(version !== fileVerOnly) {
            if(action === 'sync') {
                console.log(`SYNC: Replacing ${fileVerOnly} with ${version}!`);
                const fullReplaced = fileVerFull.replace(fileVerOnly, version);
                currentRevision = currentRevision.replace(fileVerFull, fullReplaced);
                replaced += 1;
                presets.okay(`DONE: Replaced version with ${version}!`);
            } else {
                result.differing.push(fileVerOnly),
                isOk = false;
            }
        }
        fs.writeFileSync(path, currentRevision);
    }
    if(replaced === 0) {
        const word = action === 'sync' ? 'SKIP' : 'OKAY';
        presets.okay(`${word}: ${path} already up to date`);
    }
    result.path = path;
    result.status = isOk;

    return result;
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
        presets.error(
            'ERROR: Use exactly one of \'check\' or \'sync\'');
        process.exit(-1);
    }
    const results = [];
    function recordResult(result) {
        results.push(result);
        allOk &= result.status;
    }
    for(const config of TARGETS) {
        recordResult(syncFile(action, {...config, version}));
        if(! allOk) {
            const last = results[results.length - 1];
            const {path, differing} = last;
            presets.error(
                `ERROR: ${path} DIFFERS from ${version}:`, JSON.stringify(differing));
        }
    }
    if(allOk) {
        presets.success(`GOOD: All files synced!`);
    } else {

        // Important: tell beginners how to fix this
        presets.errorTip("# *May* be fixed by:\n# Command            | Comment");
        const tips = [
            `npm run version-sync  # Sync files to package.json`
        ];
        for(const {status, result, path} of results) {
            if(status) continue;
            tips.push(`git add ${path}`);
        }
        tips.push(`git commit           # Add interactive git commit`);
        tips.push(`git push             # Push your branch`);
        presets.warn(tips.join("\n"));
    }
}

main();





