/**
 * @module skinkjs/dom
 *
 * @description # Document Object Model (DOM)
 *
 * Tools to help find and create page elements (HTML, etc).
 *
 * | ℹ️ [Step-by-step instructions](../#step-by-step) are available for users new to HTML or JavaScript. |
 * |:---------------------------------------------------------------------------------------------------:|
 *
 * ## What's a DOM?
 * The "Document Object Model" is all of the HTML tags and
 * other elements like ``::after`` or list bullet points.
 *
 * If you're confused, don't worry. The following pages will help
 * explain:
 * 
 * 1. [What is the HTML DOM?][w3-dom] (w3schools)
 * 2. [The Document Object Model (DOM)][MDN-dom] (MDN)
 *
 * [w3-dom]: https://www.w3schools.com/whatis/whatis_htmldom.asp
 * [MDN-dom]: https://developer.mozilla.org/en-US/docs/Glossary/DOM
 *
 */

/**
 * Convenience wrapper around [`Document.querySelector()`][querySelector].
 *
 * [querySelector]: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
 *
 * **Example**
 * 
 * ```javascript
 * const {query} = skink.dom;
 *
 * const specialNode = query('#special-id');
 *
 * if(titleHeading === null) {
 *   console.log("Couldn't find #special-id!");
 * }
 * ``` 
 *
 * @param {string} selector the query to run against `root`.
 * @param {HTMLElement|document} root The context to run the query in.
 * @returns {null|HTMLElement} An HTML element if found.
 */
export function query(selector, root = document) {
    return root.querySelector(selector);
}


/**
 * Returns at most one element as either the result of string query or the passed element.
 * 
 * 1. If `elementOrSelector` has a [`tagName`][tagName] attribute,
 *    it will be treated as an [`HTMLElement`][HTMLElement]
 * 2. If it is a string, it will be treated as a selector string
 *
 * [tagName]: https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName
 * [HTMLElement]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement
 *
 * **Example**
 *
 * ```javascript
 * const {resolve} = skink.dom;
 *
 * const titleHeading = resolve('h1');
 *
 * if(titleHeading === null) {
 *   console.log('Couldn't find heading!');
 * }
 * ```
 * 
 * @param {HTMLElement|string} elementOrSelector An element or query to find one.
 * @param {HTMLElement|document} root A context to run any queries in.
 * @returns {null|HTMLElement} Any matching HTMLElement if found.
 */
export function resolve(elementOrSelector, root = document) {
    let element = null;
    if(elementOrSelector) {
        if(elementOrSelector['tagName'] !== undefined) {
            if(! Object.is(root, document)) {
                throw new RangeError(
                    `Cannot run an element (${JSON.stringify(elementOrSelector)}) as a query against node ${JSON.stringify(root)}`);
            }
            element = elementOrSelector;
        }
        else if (typeof elementOrSelector === 'string') {
            element = query(elementOrSelector, root);
        }
    } else {
       throw new TypeError(
        `elementOrSelector expects a selector string or an Element, not ${JSON.stringify(elementOrSelector)}`);
    }
    return element;
}


/**
 * Shorthand for [`document.createTextNode()`][createTextNode].
 * 
 * [createTextNode]: https://developer.mozilla.org/en-US/docs/Web/API/Document/createTextNode
 *
 * @param {*} asString Item to convert to inner text.
 * @returns {Text} A text node.
 */
export function text(asString) {
    const textNode = document.createTextNode(asString.toString());
    return textNode;
}

/**
 * @description Attach all elements in `iterable` to `element`.
 *
 * **Example**
 *
 * ```javascript
 * appendAll(document.body, [
 *      tag('h1', 'Title'),
 *      tag('p',  'An example use case.')
 * ]);
 * ```
 *
 * @param {HTMLElement} parent The target element.
 * @param {Iterable<HTMLElement|Text>} newChildren The iterable
 */
export function appendAll(parent, newChildren) {
    for(const item of newChildren) {
        parent.appendChild(item);
    }
}

/**
 * Attempt to nest the given elements within an existing node or query result.
 *
 * **Example**
 * If we have the following HTML:
 * ```HTML
 * <ul id="results-list"></ul>
 * ```
 * This JavaScript code will populate the list with cat and dog item.
 * ```javascript
 * const {nest, tag} = skink.dom;
 *  
 * nest('#results-list', [
 *  tag('li', 'cat'),
 *  tag('li', 'dog')
 * ]);
 * ```
 * The result will be equivalent to this HTML:
 * ```HTML
 * <ul id="results-list">
 *      <li>cat</li>
 *      <li>dog</li>
 * </ul>
 * ```
 * 
 * @param {string|T} elementOrSelector An HTML element or query.
 * @param {Iterable<HTMLElement|Text>} iterableOrCallable An iterable of nodes or a function returning them.
 * @returns {T} An HTML Element.
 */
export function nest(elementOrSelector, iterableOrCallable) {
    const element = resolve(elementOrSelector);
    const iterable = (typeof iterableOrCallable === 'function')
        ? iterableOrCallable(elementOrSelector)
        : iterableOrCallable;
    if(! hasSymbolIterator(iterable)) throw new TypeError(`Could not resolve iterable for ${JSON.stringify(iterableOrCallable)}`);
    appendAll(element, iterable);

    return element;
}


/**
 * Create a tag, optionally with the given `contents`.
 * 
 * **Example**
 *
 * ```javascript 
 * // Usage in non-module form from skink.min.js
 * const {tag, appendAll} = skink.dom;
 *
 * const tags = [
 *   // Create a title tag with only text inside.
 *   tag('h1', 'Title here'),
 *
 *   // Create a paragraph with nested values.
 *   tag('p', [
 *      text('Multiple values are '),
 *      tag('strong', 'permitted!')
 *   ])
 * ];
 * 
 * // Remember to append the elements to show them!
 * appendAll(document.body, tags);
 * ```
 *
 * @param {string} name The `tagName` to use.
 * @param  {string|Text|HTMLElement|Iterable<Node>|null} contents Optional inner text to display.
 * @returns {HTMLElement} A tag with the given name and any inner text provided.
 */
export function tag(name, contents = null) {
    const element = document.createElement(name);
    if(contents !== null) {
        if(typeof contents === 'string') {
            element.appendChild(document.createTextNode(contents));
        }
        else if(contents instanceof Element) {
            element.appendChild(contents);
        }
        // inlined for speed
        else if (contents[Symbol.iterator] !== undefined) {
            appendAll(element, contents)
        } else {
            throw TypeError(`Unexpected contents value: ${JSON.stringify(contents)} is not a string, Text, or iterable of nodes.`);
        }
    }
    return element;
}

/**
 * Get the source of a passed element or selector query.
 * 
 * The {@link module:skinkjs/dom.copyElementHTMLToClipboard|copyElementHTMLToClipboard}
 * function may be of use if you need to get started quickly.
 *
 * **Example**
 *
 * ```javascript
 * const {getElementHTML} = skink.dom;
 *
 * function alertSourceFor(eltOrQuery) {
 *     const src = getElementHTML(eltOrQuery);
 *     alert(`Source for ${JSON.stringify(eltOrQuery)}\n${src}`);
 * }
 *
 * alertSourceFor('#your-id-here');
 * ```
 * **Tip**
 * 
 * This function may begin replacing characters in attributes
 * starting in September of 2025:
 * 
 * | Character | Replacement |
 * |-----------|-------------|
 * | `<`       | `&lt;`      |
 * | `>`       | `&gt;`      |
 *  
 * This is [a security-related change][] affecting:
 *
 * * [`HTMLElement.outerHTML`][outerHTML]
 * * [`HTMLElement.innerHTML`][innerHTML]
 *
 * [a security-related change]: https://developer.chrome.com/blog/escape-attributes
 * [outerHTML]: https://developer.mozilla.org/en-US/docs/Web/API/Element/outerHTML
 * [innerHTML]: https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
 * 
 *
 * @param {string|Node} eltOrQuery A string or node to copy.
 * @returns {string} Source as a string.
 */
export function getElementHTML(eltOrQuery) {
    let problem = {type: null, reason: null};
    let elt = resolve(eltOrQuery);
    if(! elt) {
      problem.type = ReferenceError;
      problem.reason = `Could not resolve a node for ${JSON.stringify(eltOrQuery)}`;
    } else if (elt['outerHTML'] === undefined) {
      problem.type = Error;
      problem.reason = 'Failed to read outerHTML';
    }
    if(problem.type !== null) {
        const {errType, reason = undefined} = problem;
        if(errType) throw new errType(reason);
    }
    // Chrome weirdly picky about the prop existing?
    return elt['outerHTML'];
}

/**
 * Attempt to copy the source of a given element or query selector result to the clipboard.
 *
 * **⚠️ Experimental**
 * 
 * This *may* do the following in the near future:
 * 
 * * fail with exceptions
 * * replace the `<` and `>` characters in attributes (see {@link module:skinkjs/dom.getElementHTML|getElementHTML})
 *
 * **Example**
 *
 * ```javascript
 * document.addEventListener("DOMContentLoaded", {
 *      const {copyElementHTMLToClipboard, query} = skink.dom;
 *      const buttonArea = query('#buttons');
 *
 *      // This is called a "delegated" event listener:
 *      // * The #buttons container handles click events for buttons inside it
 *      // * This is more efficient than putting a handler on every button
 *      buttonArea.addEventListener("click", (e) => {
 *          const target = e.target;
 *          if(! target.classList.contains("button")) {
 *              return;
 *          } else {
 *              copyElementHTMLToClipboard(button);
 *
 *              // You may want to replace with nicer UI
 *              alert("Copied button!");
 *          }
 *      });
 * });
 * ```
 * @param {string|Node} elementOrSelector An element or selector.
 */
export async function copyElementHTMLToClipboard(elementOrSelector) {
    const source = getElementHTML(elementOrSelector);
    await navigator.clipboard.writeText(source);
}


export const dom = {
    appendAll: appendAll,
    text: text,
    tag: tag,
    query: query,
    resolve: resolve,
    nest: nest,
    getElementHTML: getElementHTML,
    copyElementHTMLToClipboard: copyElementHTMLToClipboard
}
