import 'babel-polyfill';

import React, {
  Component,
  PropTypes
} from 'react';
import {
  render
} from 'react-dom';

import Style, {
  hashKeys,
  minifyCss
} from '../src';

console.log(minifyCss);

const keys = [
  'test',
  'foo',
  'bar'
];

const {
  bar,
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

const ToggledDiv = ({color}) => {
  return (
    <div>
      <div className={test}>
        I am display inline-block
      </div>

      <Style id="custom-style-block">{`
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

        {isToggledDivShown && (
          <ToggledDiv color={color}/>
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
}, 1000);

render((
  <App color={getRandomColor()}/>
), div);

document.body.appendChild(div);