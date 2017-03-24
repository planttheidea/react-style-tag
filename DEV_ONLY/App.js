import 'babel-polyfill';

import React, {
  Component,
  PropTypes
} from 'react';
import {
  render
} from 'react-dom';

import Style, {
  hashKeys
} from '../src';

const keys = [
  'test',
  'foo',
  'bar'
];

const {
  foo,
  test
} = hashKeys(keys);

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

const RegularDiv = ({color}) => {
  return (
    <div>
      <div className={foo}>
        I do not toggle
      </div>

      <Style>{`
        .${foo} {
          color: ${color};
          transition: color 250ms ease-in-out;
        }
      `}</Style>
    </div>
  );
};

RegularDiv.propTypes = {
  color: PropTypes.string
};

const ToggledDiv = ({color, id}) => {
  return (
    <div>
      <div className={test}>
        I toggle
      </div>

      <Style id={id}>{`
        .${test} {
          color: ${color};
          display: inline-flex;
          transition: color 250ms ease-in-out;
        }

        @media screen and (min-width: 1000px) {
          html {
            background-color: lightgray;
          }
        }
      `}</Style>
    </div>
  );
};

ToggledDiv.propTypes = {
  color: PropTypes.string,
  id: PropTypes.string
};

class App extends Component {
  static propTypes = {
    color: PropTypes.string
  };

  state = {
    isToggledDivShown: true
  };

  onClickToggle = () => {
    const {
      isToggledDivShown
    } = this.state;

    this.setState({
      isToggledDivShown: !isToggledDivShown
    });
  };

  render() {
    const {
      color
    } = this.props;
    const {
      isToggledDivShown
    } = this.state;

    return (
      <div>
        <button
          onClick={this.onClickToggle}
          type="button"
        >
          Toggle div
        </button>

        <br/>

        <RegularDiv color={color}/>

        <br/>

        {isToggledDivShown && (
          <ToggledDiv
            color={color}
            id="toggle-one"
          />
        )}

        <br/>

        {isToggledDivShown && (
          <ToggledDiv
            color={color}
            id="toggle-two"
          />
        )}
      </div>
    );
  }
}

const div = document.createElement('div');

div.id = 'app-container';

setInterval(() => {
  render((
    <App color={getRandomColor()}/>
  ), div);
}, 2500);

render((
  <App color={getRandomColor()}/>
), div);

document.body.appendChild(div);
