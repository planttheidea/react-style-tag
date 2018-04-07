import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';

import Style, {hashKeys} from '../src';

const keys = hashKeys(['bar', 'baz']);

class App extends PureComponent {
  state = {
    hasSourceMap: false,
    isVisible: true
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState(({hasSourceMap}) => ({
        hasSourceMap: !hasSourceMap
      }));
    }, 5000);
  }

  onToggleVisible = () => {
    this.setState(({isVisible}) => ({
      isVisible: !isVisible
    }));
  };

  render() {
    const {hasSourceMap, isVisible} = this.state;

    console.log(hasSourceMap);

    return (
      <div>
        <h1>App</h1>

        <span className="foo">When hovered, I turn red.</span>

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
            }
          }

          @media screen and (min-width: 1000px) {
            .foo {
              background-color: blue;
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
