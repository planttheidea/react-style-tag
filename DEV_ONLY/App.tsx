import React, { useCallback, useEffect, useState } from 'react';
import { setGlobalOptions, hashKeys, Style } from '../src';

interface DivProps {
  color: string;
  id?: string;
}

const keys = hashKeys(['test', 'foo', 'bar'] as const);

/**
 * get a random color for the text
 */
function getRandomColor() {
  const randomR = Math.floor(Math.random() * 255);
  const randomG = Math.floor(Math.random() * 255);
  const randomB = Math.floor(Math.random() * 255);

  return `rgb(${randomR}, ${randomG}, ${randomB})`;
}

setGlobalOptions({
  hasSourceMap: true,
});

function RegularDiv({ color }: DivProps) {
  return (
    <div>
      <div className={keys.foo}>I do not toggle</div>

      <Style>
        {`
          .${keys.foo} {
            color: ${color};
            transition: color 250ms ease-in-out;
          }
        `}
      </Style>
    </div>
  );
}

function UnprefixedDiv({ color }: DivProps) {
  return (
    <div>
      <div className={keys.bar}>I have no prefixes</div>

      <Style isPrefixed={false}>
        {`
          .${keys.bar} {
            color: ${color};
            display: inline-flex;
            transition: color 250ms ease-in-out;
          }
        `}
      </Style>
    </div>
  );
}

function ToggledDiv({ color, id }: DivProps) {
  return (
    <div>
      <div className={keys.test}>I toggle</div>

      <Style id={id}>
        {`
      .${keys.test} {
        color: ${color};
        display: inline-flex;
        transition: color 250ms ease-in-out;
      }
    `}
      </Style>
    </div>
  );
}

export default function App() {
  const [minified, setMinified] = useState(false);
  const [sourceMap, hasSourceMap] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [visible, setVisible] = useState(true);

  const color = getRandomColor();

  const onClickToggleDiv = useCallback(
    () => setToggled((toggled) => !toggled),
    []
  );
  const onClickToggleVisible = useCallback(
    () => setVisible((visible) => !visible),
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setMinified((minified) => !minified);
      // hasSourceMap((sourceMap) => !sourceMap);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>App</h1>

      <div>
        <button onClick={onClickToggleVisible}>
          Click to toggle main style
        </button>
      </div>

      <span className="foo">When hovered, I turn red.</span>

      <button onClick={onClickToggleDiv} type="button">
        Toggle div
      </button>

      <br />

      <RegularDiv color={color} />

      <br />

      <UnprefixedDiv color={color} />

      <br />

      {toggled && (
        <>
          <ToggledDiv color={color} id="toggle-one" />
          <br />
          <ToggledDiv color={color} id="toggle-two" />
        </>
      )}

      {visible && (
        <Style hasSourceMap={sourceMap} isMinified={minified}>
          {`
        @keyframes test {
          0% {
            opacity; 1;
          }

          50% {
            opacity: 0.5;
          }

          100% {
            opacity: 1;
          }
        }

        .foo {
          animation: test 1000ms infinite;
          display: block;
          margin-bottom: 15px;

          &:hover {
            background-color: red;
            color: white;
          }
        }

        @media screen and (min-width: 1000px) {
          .foo {
            color: ${getRandomColor()};
          }
        }

        .${keys.bar} {
          display: flex;

          &:focus {
            text-decoration: underline;
          }
        }
      `}
        </Style>
      )}
    </div>
  );
}
