import autoprefixer from 'autoprefixer';
import postcss from 'postcss';

const prefixer = postcss([
  autoprefixer({
    remove: false
  })
]);

/**
 * return the minified string css
 *
 * @param {string} cssText
 * @returns {string}
 */
const minify = (cssText) => {
  return cssText.trim()
    .replace(/\/\*[\s\S]+?\*\//g, '')
    .replace(/[\n\r]/g, '')
    .replace(/\s*([:;,{}])\s*/g, '$1')
    .replace(/\s+/g, ' ')
    .replace(/;}/g, '}')
    .replace(/\s+(!important)/g, '$1')
    .replace(/#([a-fA-F0-9])\1([a-fA-F0-9])\2([a-fA-F0-9])\3(?![a-fA-F0-9])/g, '#$1$2$3')
    .replace(/(Microsoft[^;}]*)#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])(?![a-fA-F0-9])/g, '$1#$2$2$3$3$4$4')
    .replace(/\b(\d+[a-z]{2}) \1 \1 \1/gi, '$1')
    .replace(/\b(\d+[a-z]{2}) (\d+[a-z]{2}) \1 \2/gi, '$1 $2')
    .replace(/([\s|:])[0]+px/g, '$10');
};

/**
 * return the css after running through autoprefixer
 *
 * @param {string} cssText
 * @returns {string}
 */
const prefixCss = (cssText) => {
  return prefixer.process(cssText).css;
};

export {minify};
export {prefixCss};
