import React, { Component } from 'react';
import styled from "styled-components";
import _ from 'lodash';

// TODO: Add automatic support for hepburn, nihonshiki, etc.
// TODO: Use a free online API to retrieve random words w/ romanization (and/or use EDICT locally as a fallback)
// TODO: Provide the user with a Words Per Minute statistic at the end of the session
// TODO: Use 3D effects (WebGL)
// TODO: Add a modicum of graphics
// TODO: "You made X typos"
// TODO: Highlight kanji that you've already matched in a compound
// TODO: Add audio hints. The user should have something like 10 audio hints, and each hint reduces score.
// TODO: Add support for JLPT 2. Online high score.

const AppWrapper = styled.div`
  padding: 1%;
  background-image: linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%);
  color: black;
  width: 640px;
  min-height: 480px;
  margin: 30px auto;
  box-sizing: border-box;
  text-align: center;
`;

const Word = styled.div`
  font-size: 80px;
`

const tokenizedWords = _.shuffle([
  [['勉', '強'], ['ben', 'kyou']],
  [['魚'], ['sakana']],
  [['林', '檎'], ['rin', 'go']],
  [['大', '量', '破', '壊', '兵', '器'], ['tai', 'ryou', 'ha', 'kai', 'hei', 'ki']],
  [['三', '位', '一体'], ['san', 'mi', 'ittai']],
  [['一生', '懸', '命'], ['isshou', 'ken', 'mei']],
]);

class App extends Component {
  state = {
    score: 0,
    remainingWords: Object.assign([], tokenizedWords),
    inputValue: '',
    accumulatedUserInput: [],
    hasStarted: false,
    isDone: false,
  }

  componentDidUpdate() {
    if (this.state.remainingWords.length) {
      if (Object.assign([], this.state.accumulatedUserInput).sort().join('') === Object.assign([], this.state.remainingWords[0][1]).sort().join('')) {
        return this.setState(prevValue => {
          return {
            score: prevValue.score + 1,
            words: prevValue.remainingWords.shift(),
            inputValue: '',
            accumulatedUserInput: [],
          };
        });
      }
    } else if (!this.state.isDone) {
      return this.setState(prevState => {
        return {
          isDone: !prevState.isDone
        }
      });
    }
  }

  handleInput = (e) => {
    if (!this.state.hasStarted) {
      this.setState(prevState => {
        return {
          hasStarted: !prevState.hasStarted,
          startTime: Date.now(),
        }
      });
    }

    e.preventDefault();
    const inputValue = e.target.value;

    if (inputValue
      && this.state.remainingWords[0][1].includes(inputValue)
      && !this.state.accumulatedUserInput.includes(inputValue)) {

      const val = inputValue;

      return this.setState(prevState => {
        console.log(val);
        return {
          accumulatedUserInput: prevState.accumulatedUserInput.concat([val]),
          inputValue: '',
        }
      });
    }
    this.setState({ inputValue: inputValue });
  };

  renderTokens = () => {
    if (!this.state.remainingWords.length) { return "Done!" };
    const [sourceTokens, targetTokens] = this.state.remainingWords[0];

    return _.zipWith(sourceTokens, targetTokens, (sourceToken, targetToken) => {
      return (
        <span style={{ color: this.state.accumulatedUserInput.includes(targetToken) ? "green" : "black" }}>{sourceToken}</span>
      )
    });
  }

  render() {
    return (
      <AppWrapper>

        <header>
          <h1>Kanji Attack</h1>
        </header>

        <Word>{!this.state.isDone ? this.renderTokens() : ''}</Word>
        <span>{this.state.isDone && `you finished in ${((Date.now() - this.state.startTime) / 1000).toFixed(2)} seconds`}</span>
        <input type="text" value={this.state.inputValue} onChange={this.handleInput}
          style={{ display: !this.state.remainingWords.length ? "none" : "" }}
          disabled={!this.state.remainingWords.length} />

        <br /><br />

        {!this.state.isDone && this.state.score}

      </AppWrapper>
    );
  }
}

export default App;
