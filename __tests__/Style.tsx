import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { Style } from '../src/Style';
import { DEFAULT_OPTIONS, setGlobalOptions } from '../src/options';

import type { ReactNode } from 'react';

function Wrapper({ children }: { children: ReactNode }) {
  return <div data-testid="test">{children}</div>;
}

function getRenderedStyleTag(jsx: JSX.Element): HTMLElement {
  const { getByTestId } = render(jsx, {
    wrapper: Wrapper,
  });

  const container = getByTestId('test');

  let owner: HTMLElement | null = container;

  while (owner && owner.constructor.name !== 'HTMLHtmlElement') {
    owner = owner.parentElement;
  }

  // @ts-expect-error - I'm really introspecting internals here, but its hard to traverse
  // to the `document.head` otherwise.
  return Array.from(owner.firstChild.children)[0]!;
}

describe('Style', () => {
  afterEach(() => {
    setGlobalOptions({ ...DEFAULT_OPTIONS, hasSourceMap: false });
  });

  describe('global options', () => {
    describe('hasSourceMap', () => {
      it('will set a `link` tag when it has a source map', () => {
        setGlobalOptions({ hasSourceMap: true });

        const style = '.foo { display: flex; }';
        const styleTag = getRenderedStyleTag(<Style>{style}</Style>);

        expect(styleTag.nodeName).toBe('LINK');
        expect(styleTag.getAttribute('rel')).toBe('stylesheet');
        expect(styleTag.getAttribute('href')).toMatch(/data:[A-z0-9]/);
      });

      it('will set a `style` tag when it does not have a source map', () => {
        setGlobalOptions({ hasSourceMap: false });

        const style = '.foo { display: flex; }';
        const styleTag = getRenderedStyleTag(<Style>{style}</Style>);

        expect(styleTag.nodeName).toBe('STYLE');
        expect(styleTag).toHaveTextContent(
          '.foo { display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; }'
        );
      });
    });

    describe('isMinified', () => {
      it('will minify the output when true', () => {
        setGlobalOptions({ isMinified: true });

        const style = '.foo { display: flex; }';
        const styleTag = getRenderedStyleTag(<Style>{style}</Style>);

        expect(styleTag.nodeName).toBe('STYLE');
        expect(styleTag).toHaveTextContent(
          '.foo{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;}'
        );
      });

      it('will not minify the output when false', () => {
        setGlobalOptions({ isMinified: false });

        const style = '.foo { display: flex; }';
        const styleTag = getRenderedStyleTag(<Style>{style}</Style>);

        expect(styleTag.nodeName).toBe('STYLE');
        expect(styleTag).toHaveTextContent(
          '.foo { display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; }'
        );
      });
    });

    describe('isPrefixed', () => {
      it('will prefix the output when true', () => {
        setGlobalOptions({ isPrefixed: true });

        const style = '.foo { display: flex; }';
        const styleTag = getRenderedStyleTag(<Style>{style}</Style>);

        expect(styleTag.nodeName).toBe('STYLE');
        expect(styleTag).toHaveTextContent(
          '.foo { display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; }'
        );
      });

      it('will not prefix the output when false', () => {
        setGlobalOptions({ isPrefixed: false });

        const style = '.foo { display: flex; }';
        const styleTag = getRenderedStyleTag(<Style>{style}</Style>);

        expect(styleTag.nodeName).toBe('STYLE');
        expect(styleTag).toHaveTextContent(style);
      });
    });
  });

  describe('local options', () => {
    describe('hasSourceMap', () => {
      it('will set a `link` tag when it has a source map', () => {
        const style = '.foo { display: flex; }';
        const styleTag = getRenderedStyleTag(
          <Style hasSourceMap>{style}</Style>
        );

        expect(styleTag.nodeName).toBe('LINK');
        expect(styleTag.getAttribute('rel')).toBe('stylesheet');
        expect(styleTag.getAttribute('href')).toMatch(/data:[A-z0-9]/);
      });

      it('will set a `style` tag when it does not have a source map', () => {
        const style = '.foo { display: flex; }';
        const styleTag = getRenderedStyleTag(
          <Style hasSourceMap={false}>{style}</Style>
        );

        expect(styleTag.nodeName).toBe('STYLE');
        expect(styleTag).toHaveTextContent(
          '.foo { display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; }'
        );
      });
    });

    describe('isMinified', () => {
      it('will minify the output when true', () => {
        const style = '.foo { display: flex; }';
        const styleTag = getRenderedStyleTag(<Style isMinified>{style}</Style>);

        expect(styleTag.nodeName).toBe('STYLE');
        expect(styleTag).toHaveTextContent(
          '.foo{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;}'
        );
      });

      it('will not minify the output when false', () => {
        const style = '.foo { display: flex; }';
        const styleTag = getRenderedStyleTag(
          <Style isMinified={false}>{style}</Style>
        );

        expect(styleTag.nodeName).toBe('STYLE');
        expect(styleTag).toHaveTextContent(
          '.foo { display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; }'
        );
      });
    });

    describe('isPrefixed', () => {
      it('will prefix the output when true', () => {
        setGlobalOptions({ isPrefixed: true });

        const style = '.foo { display: flex; }';
        const styleTag = getRenderedStyleTag(<Style isPrefixed>{style}</Style>);

        expect(styleTag.nodeName).toBe('STYLE');
        expect(styleTag).toHaveTextContent(
          '.foo { display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; }'
        );
      });

      it('will not prefix the output when false', () => {
        setGlobalOptions({ isPrefixed: false });

        const style = '.foo { display: flex; }';
        const styleTag = getRenderedStyleTag(
          <Style isPrefixed={false}>{style}</Style>
        );

        expect(styleTag.nodeName).toBe('STYLE');
        expect(styleTag).toHaveTextContent(style);
      });
    });
  });
});
