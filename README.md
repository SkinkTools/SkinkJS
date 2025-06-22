# SkinkJS

<!-- Temp workaround for JsDoc lakcing GitHub Markdown image syntax -->

<a href="https://opensource.org/license/mit"><img src="https://img.shields.io/badge/License-MIT-License.svg"></a>
<a href="https://github.com/pushfoo/PegboardJS/PegboardJS/actions/workflows/test.yaml?branch=main"><img src="https://github.com/PegboardJS/PegboardJS/actions/workflows/test.yaml/badge.svg?branch=main"></a>
<a href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"></a>

Python-inspired helper functions for JavaScript.

<!-- JsDoc does not seem to support callouts so we'll go with this. :( -->
|️ ⚠️ Version 0.0.1 (Expect rough edges) |
|--------------------------------------|

## Not a Framework

It's a small library which works *with* JavaScript features:

```javascript
// SkinkJS
for(const [x, y] of product(range(width), range(height))) {
    console.log({'x': x, 'y': y});
}

// Without SkinkJS: more keystrokes, more tiny punctuation (: vs ;)
for(let y = 0; y < height; y++) {
    for(let x = 0; x < width; x++) {
        console.log({'x': x, 'y': y});
    }
}
```

There's no compiler or preprocessor. Just import SkinkJS functions to:

1. reduce RSI risks through tab completion
2. make code more readable to beginners and experts
3. give Python developers an on-ramp for front-end

## Usage Overview

* Experienced developers can use ES6 [modules][]
* Beginners have a friendly `skink` global

To keep things simple, the template is public domain with **zero**
copyright or license restrictions ([CC0][]) on the HTML and CSS. See
the [live preview][Preview] to learn more.

[CC0]: https://creativecommons.org/publicdomain/zero/1.0/
[modules]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
[Preview]: ./static/template/

### I'm Impatient


1. [Download the template][template.zip]
2. Skip to the [Step-by-Step](#step-by-step) guide

### A Concrete Example

Here is what the iteration and page element sytnax looks like:

```html
<html>
<head>
</title>A one-page example</title>
<!-- 1. Add an include -->
<script src="skink.min.js" type="text/javascript"></script>
</head>
<body>

<!-- 2. Add some page HTML to populate with JS -->
<ul id="skinks-ul">
</ul>

<!-- 3. Add your script -->
<script type="text/javascript">
// Inline JS doesn't permit the defer attribute, so we use an event.
document.addEventListener("DOMContentLoaded", () => {
    // Unpack any helpers from the inner "namespaces"
    const {enumerate} = skink.iteration;
    const {tag, query, nest} = skink.dom;
    
    // Declare our data and find the element we'll put it into
    const species = ['blue-tailed', 'blue-tongued', 'fire'];
    const skinksList = query('#skinks-ul');

    // Like Python's enumerate function, Skink's enumerate() yields [index, value] pairs
    for(const [i, name] in enumerate(species)) {
        const numSkinks = i + 1;
        // Add an 's' if we have more than two skinks
        const plural = (numSkinks < 2)
            ? ''  // Fewer than 2
            : 's' // 2 or more!
        nest(skinksList,
            tag('li', `${numMembers} ${name} skink${plural}`);
        );
    }
});
</script>
<body>
<html>
```

The result will be:

<ul id="skinks-ul">
    <li>1 blue-tailed skink</li>
    <li>2 blue-tongued skinks</li>
    <li>3 fire skinks</li>
</ul>

<span id="step-by-step"></span>

## Step-by-Step

| ℹ️ This guide caters to beginners                                                                                        |
|--------------------------------------------------------------------------------------------------------------------------|
| It assumes you want a one-file `<script></script>` tag. Fans of ES6 modules may want to install from [the GitHub repo][] |

[the GitHub repo]: https://github.com/Skinktools/SkinkJS

If you don't know or care what an ES6 module is, you're in the right place.

We'll cover these steps below:

1. A local live preview
2. Getting SkinkJS via the template or a `<script>` tag
3. Skimming the module documentation for anything promising
4. Unpacking and using items from `skink`

### 1. A Local Live Preview

A local live preview setup will save you a lot of time and pain.

For VS Code users, Microsoft's [Live Preview extension][vs-preview]
is a popular choice despite being unfinished. There are also popular
command-line tools in various languages.

Two of the most popular language-specific development servers are:

* Python's built-in [`http.server`][py-server]
* Node's third-party [`http-server`][npm-http-server]

Since Python [`http.server`][py-server] comes with the language,
installing Python should be enough to get you both the server and
Python itself.

```shell
python3 -m http.server
```

Be sure to turn it off once you're done via <kbd>Ctrl-C</kbd> in the terminal window!

#### Why Local Previews Are Important

Some features never work correctly when loaded directly from a
file on a drive (see [CORS: Request not HTTP][MDN-cors]).

A local preview setup is the easiest way to side-step both
that issue and many other common troubles, including:

1. waiting for uploaded content to sync
2. waiting for your connection or web host to stop being flaky
3. having to pay to explore building your own APIs and web apps

#### Neocities: Extra Flaky

[Neocities][] has a long-standing issue where pages fail to
update after upload. A local preview setup will let you quickly
test whether it's your code or just neocities being flaky again.

[MDN-cors]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors/CORSRequestNotHttp
[Neocities]: https://neocities.org/
[vs-preview]: https://marketplace.visualstudio.com/items?itemName=ms-vscode.live-server
[py-server]: https://docs.python.org/3/library/http.server.html#command-line-interface
[npm-http-server]: https://www.npmjs.com/package/http-server


### 2. Get SkinkJS

Choose an option:

| A. Edit the template | B. Add `skink.min.js` to your pages |
|:--------------------:|:-----------------------------------:|

#### A. Edit the template

1. [Preview it][Preview]
2. [Download it][template.zip]
3. Unzip to a new project directory

#### B. Add `skink.min.js` to your pages

1. [Download `skink.min.js.zip`][skink.min.js.zip]
2. Unzip it into your project directory
3. Add an include in your `<head>` tag

The include's `src` attribute will depend on where you put
your scripts.

If you put it a the top level, it would be:
```html
<script type="text/javascript" src="./skink.min.js"></script>
```
If you use a `scripts/` folder, it would be:
```html
<script type="text/javascript" src="./scripts/skink.min.js"></script>
```

[the template]: ./static/template/
[template.zip]: ./static/template/template.zip
[skink.min.js.zip]: ./static/template/skink.min.js.zip

### 2. Skim the API pages

We saw the `skink.iteration` and `skink.dom` "namespaces" earlier
in this page.

Each module of SkinkJS has an equivalent namespace object in the minfied
single-file version. That means the module documentation still describes
the contents of each namespace.

The main differences are convenient for casual use:

* namespace objects can be unpacked "locally"
* namespace objects support destructuring  


#### Which Pages and How?

The `iteration` and `dom` namespaces are the most useful.

Start by:

1. Skimming through their module pages for anything that looks cool
2. Note it down to try later
3. Experiment!

The details are covered in the sections below.

[p5.js]: https://p5js.org/

### 3. Unpack the helpers you want

"Destructuring" is a convenient way to "auto-fill" variables from
JavaScript objects:
```javascript
// Destructuring matches fills each constant from the attribute name on an object
const { range, product } = skink.iteration;
const { tag, query, resolve } = skink.dom;

// "Old-school" assignment equivalent of the above
const range = skink.iteration.range
const product = skink.iteration.product
const tag = skink.dom.iteration;
const query = skink.dom.query;
const resolve = skink.dom.resolve;
```

Experiment and have Fun!

#### Tell Me More?

To learn more about destructuring, see:

* [w3school's intro to destructuring](https://www.w3schools.com/js/js_destructuring.asp)
* [MDN's page on destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring)


As to SkinkJS itself, there are two other modules aside from `iteration` and `dom`:

| Namespace / module | Purpose                                                     |
|--------------------|-------------------------------------------------------------|
| `iteration`        | Make `for` loops and other iteration nicer                  |
| `dom`              | Finding, reading, and writing page content                  | 
| `operators`        | Turn some operators into external functions                 |
| `keyed`            | Helpers for bracket-access objects ([`Array`][Array], etc) |

[Array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array

## Strengths and Target Audiences

SkinkJS benefits both beginners and seasoned devs.

1. The syntax is gentler on your hands and eyes:

   * <kbd>Tab</kbd>-completable words require fewer keystrokes than more verbose code
   * less eyestrain from trying to distinguish small punctuation characters
   * no pre-processors or cross-compilers required

2. Code comes in both:

   * ES6 modules for the seasoned tree-shakers
   * Beginner-friendly forms with no modules required

3. A small and nimble library, not a framework:

   * JavaScript beginners can use it as training wheels
   * Python developers can use it as scaffolding
   * The library is only 6.1 kilobytes
