import Stylis from 'stylis';
import { BEAUTIFY_OPTIONS } from './constants';
import { getCoalescedOption } from './options';

import type { Props } from './Style';

interface BeautifyOptions {
  autosemicolon?: boolean;
  indent?: string;
  openbrace?: boolean | string;
}

interface BeautifyState {
  Start: number;
  AtRule: number;
  Block: number;
  Selector: number;
  Ruleset: number;
  Property: number;
  Separator: number;
  Expression: number;
  URL: number;
}

export function beautify(style: string, options: BeautifyOptions = {}) {
  const {
    autosemicolon = false,
    indent = '  ',
    openbrace: openbracesuffix = true,
  } = options;

  let index = 0;
  let length = style.length;
  let blocks: string[];
  let formatted = '';
  let character: string;
  let character2: string;
  let string: string;
  let state;
  let State: BeautifyState = {
    Start: 0,
    AtRule: 1,
    Block: 2,
    Selector: 3,
    Ruleset: 4,
    Property: 5,
    Separator: 6,
    Expression: 7,
    URL: 8,
  };
  let depth = 0;
  let quote;
  let comment;

  function isWhitespace(c: string) {
    return c === ' ' || c === '\n' || c === '\t' || c === '\r' || c === '\f';
  }

  function isQuote(c: string | null | undefined) {
    return c === "'" || c === '"';
  }

  // FIXME: handle Unicode characters
  function isName(c: string) {
    return (
      (character >= 'a' && character <= 'z') ||
      (character >= 'A' && character <= 'Z') ||
      (character >= '0' && character <= '9') ||
      '-_*.:#[]'.indexOf(c) >= 0
    );
  }

  function appendIndent() {
    let i;
    for (i = depth; i > 0; i -= 1) {
      formatted += indent;
    }
  }

  function openBlock() {
    formatted = formatted.trimEnd();
    if (openbracesuffix) {
      formatted += ' {';
    } else {
      formatted += '\n';
      appendIndent();
      formatted += '{';
    }
    if (character2 !== '\n') {
      formatted += '\n';
    }
    depth += 1;
  }

  function closeBlock() {
    let last;
    depth -= 1;
    formatted = formatted.trimEnd();

    if (formatted.length > 0 && autosemicolon) {
      last = formatted.charAt(formatted.length - 1);
      if (last !== ';' && last !== '{') {
        formatted += ';';
      }
    }

    formatted += '\n';
    appendIndent();
    formatted += '}';
    blocks.push(formatted);
    formatted = '';
  }

  state = State.Start;
  comment = false;
  blocks = [];

  // We want to deal with LF (\n) only
  style = style.replace(/\r\n/g, '\n');

  while (index < length) {
    character = style.charAt(index);
    character2 = style.charAt(index + 1);
    index += 1;

    // Inside a string literal?
    if (isQuote(quote)) {
      formatted += character;
      if (character === quote) {
        quote = null;
      }
      if (character === '\\' && character2 === quote) {
        // Don't treat escaped character as the closing quote
        formatted += character2;
        index += 1;
      }
      continue;
    }

    // Starting a string literal?
    if (isQuote(character)) {
      formatted += character;
      quote = character;
      continue;
    }

    // Comment
    if (comment) {
      formatted += character;
      if (character === '*' && character2 === '/') {
        comment = false;
        formatted += character2;
        index += 1;
      }
      continue;
    }
    if (character === '/' && character2 === '*') {
      comment = true;
      formatted += character;
      formatted += character2;
      index += 1;
      continue;
    }

    if (state === State.Start) {
      if (blocks.length === 0) {
        if (isWhitespace(character) && formatted.length === 0) {
          continue;
        }
      }

      // Copy white spaces and control characters
      if (character <= ' ' || character.charCodeAt(0) >= 128) {
        state = State.Start;
        formatted += character;
        continue;
      }

      // Selector or at-rule
      if (isName(character) || character === '@') {
        // Clear trailing whitespaces and linefeeds.
        string = formatted.trimEnd();

        if (string.length === 0) {
          // If we have empty string after removing all the trailing
          // spaces, that means we are right after a block.
          // Ensure a blank line as the separator.
          if (blocks.length > 0) {
            formatted = '\n\n';
          }
        } else {
          // After finishing a ruleset or directive statement,
          // there should be one blank line.
          if (
            string.charAt(string.length - 1) === '}' ||
            string.charAt(string.length - 1) === ';'
          ) {
            formatted = string + '\n\n';
          } else {
            // After block comment, keep all the linefeeds but
            // start from the first column (remove whitespaces prefix).
            while (true) {
              character2 = formatted.charAt(formatted.length - 1);
              if (character2 !== ' ' && character2.charCodeAt(0) !== 9) {
                break;
              }
              formatted = formatted.substr(0, formatted.length - 1);
            }
          }
        }
        formatted += character;
        state = character === '@' ? State.AtRule : State.Selector;
        continue;
      }
    }

    if (state === State.AtRule) {
      // ';' terminates a statement.
      if (character === ';') {
        formatted += character;
        state = State.Start;
        continue;
      }

      // '{' starts a block
      if (character === '{') {
        string = formatted.trimEnd();
        openBlock();
        state = string === '@font-face' ? State.Ruleset : State.Block;
        continue;
      }

      formatted += character;
      continue;
    }

    if (state === State.Block) {
      // Selector
      if (isName(character)) {
        // Clear trailing whitespaces and linefeeds.
        string = formatted.trimEnd();

        if (string.length === 0) {
          // If we have empty string after removing all the trailing
          // spaces, that means we are right after a block.
          // Ensure a blank line as the separator.
          if (blocks.length > 0) {
            formatted = '\n\n';
          }
        } else {
          // Insert blank line if necessary.
          if (string.charAt(string.length - 1) === '}') {
            formatted = string + '\n\n';
          } else {
            // After block comment, keep all the linefeeds but
            // start from the first column (remove whitespaces prefix).
            while (true) {
              character2 = formatted.charAt(formatted.length - 1);
              if (character2 !== ' ' && character2.charCodeAt(0) !== 9) {
                break;
              }
              formatted = formatted.substr(0, formatted.length - 1);
            }
          }
        }

        appendIndent();
        formatted += character;
        state = State.Selector;
        continue;
      }

      // '}' resets the state.
      if (character === '}') {
        closeBlock();
        state = State.Start;
        continue;
      }

      formatted += character;
      continue;
    }

    if (state === State.Selector) {
      // '{' starts the ruleset.
      if (character === '{') {
        openBlock();
        state = State.Ruleset;
        continue;
      }

      // '}' resets the state.
      if (character === '}') {
        closeBlock();
        state = State.Start;
        continue;
      }

      formatted += character;
      continue;
    }

    if (state === State.Ruleset) {
      // '}' finishes the ruleset.
      if (character === '}') {
        closeBlock();
        state = State.Start;
        if (depth > 0) {
          state = State.Block;
        }
        continue;
      }

      // Make sure there is no blank line or trailing spaces inbetween
      if (character === '\n') {
        formatted = formatted.trimEnd();
        formatted += '\n';
        continue;
      }

      // property name
      if (!isWhitespace(character)) {
        formatted = formatted.trimEnd();
        formatted += '\n';
        appendIndent();
        formatted += character;
        state = State.Property;
        continue;
      }
      formatted += character;
      continue;
    }

    if (state === State.Property) {
      // ':' concludes the property.
      if (character === ':') {
        formatted = formatted.trimEnd();
        formatted += ': ';
        state = State.Expression;
        if (isWhitespace(character2)) {
          state = State.Separator;
        }
        continue;
      }

      // '}' finishes the ruleset.
      if (character === '}') {
        closeBlock();
        state = State.Start;
        if (depth > 0) {
          state = State.Block;
        }
        continue;
      }

      formatted += character;
      continue;
    }

    if (state === State.Separator) {
      // Non-whitespace starts the expression.
      if (!isWhitespace(character)) {
        formatted += character;
        state = State.Expression;
        continue;
      }

      // Anticipate string literal.
      if (isQuote(character2)) {
        state = State.Expression;
      }

      continue;
    }

    if (state === State.Expression) {
      // '}' finishes the ruleset.
      if (character === '}') {
        closeBlock();
        state = State.Start;
        if (depth > 0) {
          state = State.Block;
        }
        continue;
      }

      // ';' completes the declaration.
      if (character === ';') {
        formatted = formatted.trimEnd();
        formatted += ';\n';
        state = State.Ruleset;
        continue;
      }

      formatted += character;

      if (character === '(') {
        if (
          formatted.charAt(formatted.length - 2) === 'l' &&
          formatted.charAt(formatted.length - 3) === 'r' &&
          formatted.charAt(formatted.length - 4) === 'u'
        ) {
          // URL starts with '(' and closes with ')'.
          state = State.URL;
          continue;
        }
      }

      continue;
    }

    if (state === State.URL) {
      // ')' finishes the URL (only if it is not escaped).
      if (
        character === ')' &&
        formatted.charAt(
          // @ts-expect-error - testing multiline
          formatted.length - 1 !== '\\' ? 1 : 0
        )
      ) {
        formatted += character;
        state = State.Expression;
        continue;
      }
    }

    // The default action is to copy the character (to prevent
    // infinite loop).
    formatted += character;
  }

  formatted = blocks.join('') + formatted;

  return formatted;
}

/**
 * Get the styles processed for passing through to the element.
 */
export function getProcessedStyles(style: string, props: Props): string {
  return new Stylis({
    compress: getCoalescedOption(props, 'isCompressed'),
    global: false,
    keyframe: false,
    prefix: getCoalescedOption(props, 'isPrefixed'),
  })('', style);
}

/**
 * Get the styles rendered in the HTML tag.
 */
export function getRenderedStyles(style: string, props: Props): string {
  const processed = getProcessedStyles(style, props);

  return props.isMinified ? processed : beautify(processed, BEAUTIFY_OPTIONS);
}
