/**
 * CLI helpers for color visibility.
 *
 */

// Defaults for *nix CLI

const _base = {};
for (const [i, name] of [
    'BLACK',
    'RED',
    'GREEN',
    'YELLOW',
    'BLUE',
    'MAGENTA',
    'CYAN',
    'WHITE'
].entries()) {
    _base[name] = i;
}

/**
 * Map the color codes into a final range by shifting the value.
 *
 * For example, the default red integer is 31 (decimal) for a
 * `shiftBase` of 30 and a `codeBase` object of `{RED: 1}`.
 *
 * @param {Number} shiftBase A number to shift each value by.
 * @param {Object} codeBase An object mapping a name to an int base.
 * @returns {Object} An object of constants for each name.
 */
function generateCodeObject(shiftBase, codeBase) {
    const obj = {};
    for(const [k, variantInt] of Object.entries(codeBase)) {
        obj[k] = shiftBase + variantInt;
    }
    return obj;
}


// Ugly but simple code, good enough
const FG = generateCodeObject(30, _base);
for(const [k, v] of Object.entries(generateCodeObject(90, _base))) {
    FG[`BRIGHT_${k}`] = v;
}
const BG = generateCodeObject(40, _base);
for(const [k, v] of Object.entries(generateCodeObject(10, _base))) {
    BG[`BRIGHT_${k}`] = v;
}


const COLORS = {
    DEFAULT: 0,
    FG: FG,
    BG: BG,
    PRESETS: {
        CRITICAL:   {fg: FG.RED,   bg: BG.RED},
        ERROR:      {fg: FG.WHITE, bg: BG.RED},
        WARNING:    {fg: FG.YELLOW,},
        OKAY:       {fg: FG.GREEN},
        SUCCESS:    {fg: FG.WHITE, bg: BG.GREEN},
        TIP_HEADER: {fg: FG.BLACK, bg: BG.YELLOW}
    }
}


/**
 * Format a color's integer form to an escape code.
 *
 * @param {Number} unixIntConstant An integer constant for a terminal color escape code.
 * @returns {string} A color code escape sequence.
 */
function escapeColor(unixIntConstant) {
    const s = unixIntConstant.toString();
    return "\x1b[" + s + "m";
}


function _fmtColor(color = COLORS.DEFAULT) {
    use = [];
    if(typeof color === 'number') use.push(color);
    else {
        const {fg = undefined, bg = undefined} = color;
        if(bg !== undefined) use.push(bg);
        if(fg !== undefined) use.push(fg);
    }

    return use
        .map(escapeColor)
        .join('');
}

/**
 * Prefix a *NIX color code, then reset after printing.
 *
 * **NOTE:** This isn't efficent and making it be is not a high priority.
 *
 * @param {Number} color a color as an integer Number.
 * @param {*} values The values to show.
 * @returns {string} A string which includes color escapes.
 */
function fmt(color, ...values) {
    return [
        _fmtColor(color),
        ...values,
        _fmtColor()
    ].join('');
}

/**
 * Call `fn(colorEscape, ...value, resetEscape)`.
 *
 * @param {*} fn A variadic logging function.
 * @param {*} color A color code to escape as an integer. 
 * @param  {...any} values The values to return.
 */
function asColor(fn, color, ...values) {
    // TODO: turn this into a context handler like vitest's?
    fn(
        _fmtColor(color),
        ...values,
        _fmtColor()
    );
}

/**
 * Wraps `console.log` in color formatting.
 *
 * @param {Number} color A color code to escape.
 * @param  {...any} values The values to log.
 */
function log(color, ...values) {
    asColor(
        console.log,
        color,
        ...values,
    );
}

function error(...values) {
    asColor(console.error, COLORS.PRESETS.ERROR, ...values);
}

function critical(...values) {
    asColor(console.error, COLORS.PRESETS.CRITICAL, ...values);
}

function warn(...values) {
    asColor(console.warn, COLORS.PRESETS.WARNING, ...values);
}

function errorTip(...values) {
    asColor(console.error, COLORS.PRESETS.TIP_HEADER, ...values);
}

function okay(...values) {
    log(COLORS.PRESETS.OKAY, ...values);
}

function success(...values) {
    log(COLORS.PRESETS.SUCCESS, ...values);
}


module.exports = {
    COLORS: COLORS,
    escapeColor: escapeColor,
    color: {
        asColor: asColor,
        log: log,
        fmt: fmt,
        presets: {
            okay: okay,
            error: error,
            success: success,
            warn: warn,
            critical: critical,
            errorTip: errorTip
        } 
    },
}
