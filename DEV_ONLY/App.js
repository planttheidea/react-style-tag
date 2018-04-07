import 'babel-polyfill';

import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';

import Style, {hashKeys} from '../src';

const keys = ['test', 'foo', 'bar'];

const {foo, test} = hashKeys(keys);

/**
 * get a random color for the text
 *
 * @returns {string}
 */
const getRandomColor = () => {
  const randomR = Math.floor(Math.random() * 255);
  const randomG = Math.floor(Math.random() * 255);
  const randomB = Math.floor(Math.random() * 255);

  return `rgb(${randomR}, ${randomG}, ${randomB})`;
};

Style.setGlobalOptions({
  hasSourceMap: true
});

const RegularDiv = ({color}) => (
  <div>
    <div className={foo}>I do not toggle</div>

    <Style>
      {`
        .${foo} {
          color: ${color};
          transition: color 250ms ease-in-out;
        }
      `}
    </Style>
  </div>
);

RegularDiv.propTypes = {
  color: PropTypes.string
};

const CustomAutoprefixerDiv = ({color}) => (
  <div>
    <div className={foo}>I have no flexbox prefixes</div>

    <Style
      isPrefixed={false}
    >
      {`
        .${foo} {
          color: ${color};
          display: inline-flex;
          transition: color 250ms ease-in-out;
        }
      `}
    </Style>
  </div>
);

CustomAutoprefixerDiv.propTypes = {
  color: PropTypes.string
};

const ToggledDiv = ({color, id}) => (
  <div>
    <div className={test}>I toggle</div>

    <Style id={id}>
      {`
        .${test} {
          color: ${color};
          display: inline-flex;
          transition: color 250ms ease-in-out;
        }
      `}
    </Style>
  </div>
);

ToggledDiv.propTypes = {
  color: PropTypes.string,
  id: PropTypes.string
};

class App extends PureComponent {
  state = {
    hasSourceMap: false,
    isToggledDivShown: false,
    isVisible: true
  };

  componentDidMount() {
    setInterval(() => {
      this.setState(({hasSourceMap}) => ({
        hasSourceMap: !hasSourceMap
      }));
    }, 5000);
  }

  onClickToggleDiv = () => {
    const {isToggledDivShown} = this.state;

    this.setState({
      isToggledDivShown: !isToggledDivShown
    });
  };

  onToggleVisible = () => {
    this.setState(({isVisible}) => ({
      isVisible: !isVisible
    }));
  };

  render() {
    const {hasSourceMap, isToggledDivShown, isVisible} = this.state;

    const color = getRandomColor();

    console.log(hasSourceMap);

    return (
      <div>
        <h1>App</h1>

        <span className="foo">When hovered, I turn red.</span>

        <button
          onClick={this.onClickToggleDiv}
          type="button"
        >
          Toggle div
        </button>

        <br />

        <RegularDiv color={color} />

        <br />

        <CustomAutoprefixerDiv color={color} />

        <br />

        {isToggledDivShown && <ToggledDiv
          color={color}
          id="toggle-one"
                              />}

        <br />

        {isToggledDivShown && <ToggledDiv
          color={color}
          id="toggle-two"
                              />}

        <button onClick={this.onToggleVisible}>Click to toggle style</button>

        {isVisible && (
          <Style
            hasSourceMap={hasSourceMap}
            // isMinified
          >
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
}

export default App;
