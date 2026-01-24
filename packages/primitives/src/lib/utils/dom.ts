/**
 * DOM utilities for browser interactions and element checking
 */

/**
 * Copy text to clipboard with fallback for older browsers
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Try modern Clipboard API first
    if (
      typeof navigator !== 'undefined' &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === 'function'
    ) {
      await navigator.clipboard.writeText(text)
      return true
    }

    // Fallback for older browsers using execCommand
    if (typeof document !== 'undefined') {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.setAttribute('readonly', '')

      // Avoid scrolling to bottom and hide element
      textarea.style.position = 'fixed'
      textarea.style.top = '0'
      textarea.style.left = '0'
      textarea.style.opacity = '0'
      textarea.style.pointerEvents = 'none'

      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()

      const success = document.execCommand
        ? document.execCommand('copy')
        : false
      document.body.removeChild(textarea)
      return success
    }

    return false
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

/**
 * Unescape HTML special characters
 */
export function unescapeHtml(html: string): string {
  const map: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
  }

  return html.replace(/&(?:amp|lt|gt|quot|#39);/g, (m) => map[m] ?? m)
}

/**
 * Check if string is HTML tag
 */
export function isHtmlTag(str: string): boolean {
  const htmlTags = [
    'a',
    'abbr',
    'address',
    'area',
    'article',
    'aside',
    'audio',
    'b',
    'base',
    'bdi',
    'bdo',
    'blockquote',
    'body',
    'br',
    'button',
    'canvas',
    'caption',
    'cite',
    'code',
    'col',
    'colgroup',
    'data',
    'datalist',
    'dd',
    'del',
    'details',
    'dfn',
    'dialog',
    'div',
    'dl',
    'dt',
    'em',
    'embed',
    'fieldset',
    'figcaption',
    'figure',
    'footer',
    'form',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'head',
    'header',
    'hr',
    'html',
    'i',
    'iframe',
    'img',
    'input',
    'ins',
    'kbd',
    'label',
    'legend',
    'li',
    'link',
    'main',
    'map',
    'mark',
    'meta',
    'meter',
    'nav',
    'noscript',
    'object',
    'ol',
    'optgroup',
    'option',
    'output',
    'p',
    'param',
    'picture',
    'pre',
    'progress',
    'q',
    'rp',
    'rt',
    'ruby',
    's',
    'samp',
    'script',
    'section',
    'select',
    'small',
    'source',
    'span',
    'strong',
    'style',
    'sub',
    'summary',
    'sup',
    'table',
    'tbody',
    'td',
    'template',
    'textarea',
    'tfoot',
    'th',
    'thead',
    'time',
    'title',
    'tr',
    'track',
    'u',
    'ul',
    'var',
    'video',
    'wbr',
  ]
  return htmlTags.includes(str.toLowerCase())
}

/**
 * Check if string is SVG tag
 */
export function isSvgTag(str: string): boolean {
  const svgTags = [
    'svg',
    'g',
    'path',
    'rect',
    'circle',
    'ellipse',
    'line',
    'polyline',
    'polygon',
    'text',
    'tspan',
    'tref',
    'textPath',
    'defs',
    'clipPath',
    'mask',
    'pattern',
    'image',
    'switch',
    'foreignObject',
    'use',
    'symbol',
    'marker',
    'linearGradient',
    'radialGradient',
    'stop',
    'animate',
    'animateMotion',
    'animateTransform',
    'set',
    'metadata',
    'title',
    'desc',
  ]
  return svgTags.includes(str.toLowerCase())
}

/**
 * Check if string is MathML tag
 */
export function isMathmlTag(str: string): boolean {
  const mathmlTags = [
    'math',
    'maction',
    'maligngroup',
    'malignmark',
    'menclose',
    'merror',
    'mfenced',
    'mfrac',
    'mglyph',
    'mi',
    'mlabeledtr',
    'mlongdiv',
    'mmultiscripts',
    'mn',
    'mo',
    'mover',
    'mpadded',
    'mphantom',
    'mroot',
    'mrow',
    'ms',
    'mscarries',
    'mscarry',
    'msgroup',
    'msline',
    'mspace',
    'msqrt',
    'msrow',
    'mstack',
    'mstyle',
    'msub',
    'msup',
    'msubsup',
    'mtable',
    'mtd',
    'mtext',
    'mtr',
    'munder',
    'munderover',
    'semantics',
    'annotation',
    'annotation-xml',
  ]
  return mathmlTags.includes(str.toLowerCase())
}

/**
 * Check if string is ARIA attribute
 */
export function isAriaAttribute(str: string): boolean {
  return str.startsWith('aria-')
}

/**
 * Check if string is data attribute
 */
export function isDataAttribute(str: string): boolean {
  return str.startsWith('data-')
}

/**
 * Check if string is role attribute
 */
export function isRoleAttribute(str: string): boolean {
  return str === 'role'
}

/**
 * Check if string is event attribute
 */
export function isEventAttribute(str: string): boolean {
  return str.startsWith('on')
}

/**
 * Check if string is style attribute
 */
export function isStyleAttribute(str: string): boolean {
  return str === 'style'
}

/**
 * Check if string is class attribute
 */
export function isClassAttribute(str: string): boolean {
  return str === 'class'
}

/**
 * Check if string is id attribute
 */
export function isIdAttribute(str: string): boolean {
  return str === 'id'
}

/**
 * Check if string is href attribute
 */
export function isHrefAttribute(str: string): boolean {
  return str === 'href'
}

/**
 * Check if string is src attribute
 */
export function isSrcAttribute(str: string): boolean {
  return str === 'src'
}

/**
 * Check if string is alt attribute
 */
export function isAltAttribute(str: string): boolean {
  return str === 'alt'
}

/**
 * Check if string is title attribute
 */
export function isTitleAttribute(str: string): boolean {
  return str === 'title'
}

/**
 * Check if string is value attribute
 */
export function isValueAttribute(str: string): boolean {
  return str === 'value'
}

/**
 * Check if string is name attribute
 */
export function isNameAttribute(str: string): boolean {
  return str === 'name'
}

/**
 * Check if string is type attribute
 */
export function isTypeAttribute(str: string): boolean {
  return str === 'type'
}

/**
 * Check if string is placeholder attribute
 */
export function isPlaceholderAttribute(str: string): boolean {
  return str === 'placeholder'
}

/**
 * Check if string is disabled attribute
 */
export function isDisabledAttribute(str: string): boolean {
  return str === 'disabled'
}

/**
 * Check if string is readonly attribute
 */
export function isReadonlyAttribute(str: string): boolean {
  return str === 'readonly'
}

/**
 * Check if string is required attribute
 */
export function isRequiredAttribute(str: string): boolean {
  return str === 'required'
}

/**
 * Check if string is checked attribute
 */
export function isCheckedAttribute(str: string): boolean {
  return str === 'checked'
}

/**
 * Check if string is selected attribute
 */
export function isSelectedAttribute(str: string): boolean {
  return str === 'selected'
}

/**
 * Check if string is multiple attribute
 */
export function isMultipleAttribute(str: string): boolean {
  return str === 'multiple'
}

/**
 * Check if string is accept attribute
 */
export function isAcceptAttribute(str: string): boolean {
  return str === 'accept'
}

/**
 * Check if string is autocomplete attribute
 */
export function isAutocompleteAttribute(str: string): boolean {
  return str === 'autocomplete'
}

/**
 * Check if string is autofocus attribute
 */
export function isAutofocusAttribute(str: string): boolean {
  return str === 'autofocus'
}

/**
 * Check if string is form attribute
 */
export function isFormAttribute(str: string): boolean {
  return str === 'form'
}

/**
 * Check if string is formaction attribute
 */
export function isFormactionAttribute(str: string): boolean {
  return str === 'formaction'
}

/**
 * Check if string is formenctype attribute
 */
export function isFormenctypeAttribute(str: string): boolean {
  return str === 'formenctype'
}

/**
 * Check if string is formmethod attribute
 */
export function isFormmethodAttribute(str: string): boolean {
  return str === 'formmethod'
}

/**
 * Check if string is formnovalidate attribute
 */
export function isFormnovalidateAttribute(str: string): boolean {
  return str === 'formnovalidate'
}

/**
 * Check if string is formtarget attribute
 */
export function isFormtargetAttribute(str: string): boolean {
  return str === 'formtarget'
}

/**
 * Check if string is height attribute
 */
export function isHeightAttribute(str: string): boolean {
  return str === 'height'
}

/**
 * Check if string is width attribute
 */
export function isWidthAttribute(str: string): boolean {
  return str === 'width'
}

/**
 * Check if string is max attribute
 */
export function isMaxAttribute(str: string): boolean {
  return str === 'max'
}

/**
 * Check if string is maxlength attribute
 */
export function isMaxlengthAttribute(str: string): boolean {
  return str === 'maxlength'
}

/**
 * Check if string is min attribute
 */
export function isMinAttribute(str: string): boolean {
  return str === 'min'
}

/**
 * Check if string is minlength attribute
 */
export function isMinlengthAttribute(str: string): boolean {
  return str === 'minlength'
}

/**
 * Check if string is pattern attribute
 */
export function isPatternAttribute(str: string): boolean {
  return str === 'pattern'
}

/**
 * Check if string is step attribute
 */
export function isStepAttribute(str: string): boolean {
  return str === 'step'
}

/**
 * Check if string is wrap attribute
 */
export function isWrapAttribute(str: string): boolean {
  return str === 'wrap'
}

/**
 * Check if string is contenteditable attribute
 */
export function isContenteditableAttribute(str: string): boolean {
  return str === 'contenteditable'
}

/**
 * Check if string is draggable attribute
 */
export function isDraggableAttribute(str: string): boolean {
  return str === 'draggable'
}

/**
 * Check if string is hidden attribute
 */
export function isHiddenAttribute(str: string): boolean {
  return str === 'hidden'
}

/**
 * Check if string is spellcheck attribute
 */
export function isSpellcheckAttribute(str: string): boolean {
  return str === 'spellcheck'
}

/**
 * Check if string is translate attribute
 */
export function isTranslateAttribute(str: string): boolean {
  return str === 'translate'
}

/**
 * Check if string is accesskey attribute
 */
export function isAccesskeyAttribute(str: string): boolean {
  return str === 'accesskey'
}

/**
 * Check if string is dir attribute
 */
export function isDirAttribute(str: string): boolean {
  return str === 'dir'
}

/**
 * Check if string is lang attribute
 */
export function isLangAttribute(str: string): boolean {
  return str === 'lang'
}

/**
 * Check if string is tabindex attribute
 */
export function isTabindexAttribute(str: string): boolean {
  return str === 'tabindex'
}

/**
 * Check if string is XML name
 */
export function isXmlName(str: string): boolean {
  const xmlNameRegex = /^[a-zA-Z_:][a-zA-Z0-9_:.-]*$/
  return xmlNameRegex.test(str)
}

/**
 * Check if string is XML NCName
 */
export function isXmlNcname(str: string): boolean {
  const xmlNcnameRegex = /^[a-zA-Z_][a-zA-Z0-9_.-]*$/
  return xmlNcnameRegex.test(str)
}

/**
 * Check if string is XML QName
 */
export function isXmlQname(str: string): boolean {
  const xmlQnameRegex = /^[a-zA-Z_][a-zA-Z0-9_.-]*(:[a-zA-Z_][a-zA-Z0-9_.-]*)?$/
  return xmlQnameRegex.test(str)
}

/**
 * Check if string is XML NMTOKEN
 */
export function isXmlNmtoken(str: string): boolean {
  const xmlNmtokenRegex = /^[a-zA-Z0-9_.-]+$/
  return xmlNmtokenRegex.test(str)
}

/**
 * Check if string is XML NMTOKENS
 */
export function isXmlNmtokens(str: string): boolean {
  const xmlNmtokensRegex = /^[a-zA-Z0-9_.-\s]+$/
  return xmlNmtokensRegex.test(str)
}

/**
 * Check if string is XML ID
 */
export function isXmlId(str: string): boolean {
  const xmlIdRegex = /^[a-zA-Z_][a-zA-Z0-9_.-]*$/
  return xmlIdRegex.test(str)
}

/**
 * Check if string is XML IDREF
 */
export function isXmlIdref(str: string): boolean {
  const xmlIdrefRegex = /^[a-zA-Z_][a-zA-Z0-9_.-]*$/
  return xmlIdrefRegex.test(str)
}

/**
 * Check if string is XML IDREFS
 */
export function isXmlIdrefs(str: string): boolean {
  const xmlIdrefsRegex = /^[a-zA-Z_][a-zA-Z0-9_.-\s]+$/
  return xmlIdrefsRegex.test(str)
}

/**
 * Check if string is XML ENTITY
 */
export function isXmlEntity(str: string): boolean {
  const xmlEntityRegex = /^[a-zA-Z_][a-zA-Z0-9_.-]*$/
  return xmlEntityRegex.test(str)
}

/**
 * Check if string is XML ENTITIES
 */
export function isXmlEntities(str: string): boolean {
  const xmlEntitiesRegex = /^[a-zA-Z_][a-zA-Z0-9_.-\s]+$/
  return xmlEntitiesRegex.test(str)
}

/**
 * Check if string is XML NOTATION
 */
export function isXmlNotation(str: string): boolean {
  const xmlNotationRegex = /^[a-zA-Z_][a-zA-Z0-9_.-]*$/
  return xmlNotationRegex.test(str)
}
