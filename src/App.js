import React, { Component } from 'react';
import styled from "styled-components";

const AppWrapper = styled.div`
  padding: 1%;
  background-color: lime;
  color: grey;
  width: 640px;
  min-height: 480px;
  margin: 30px auto;
  box-sizing: border-box;
  text-align: center;
`;

const Word = styled.div`
  font-size: 80px;
`

const words = [
  [ "勉強", "benkyou" ],
  [ "魚", "sakana" ],
  [ "林檎", "ringo" ],
];

class App extends Component {

  state = {
    score: 0,
    remainingWords: Object.assign([], words),
    value: '',
  }

  handleInput = (e) => {
    console.log(e)
    e.preventDefault();
    if(e.target.value === this.state.remainingWords[0][1]) {
      return this.setState(prevValue => {
        return {
          score: prevValue.score + 1,
          words: prevValue.remainingWords.shift(),
          value: '',
        };
      });
    }
    this.setState({ value: e.target.value });
  }

  render() {
    return (
      <AppWrapper>

        <header>
          <h1 >Welcome to Kanji Attack</h1>
        </header>

        <Word>{this.state.remainingWords[0][0] || "none"}</Word>
          <input type="text" value={this.state.value} onChange={this.handleInput} />

        <br/><br/>

        {this.state.score}

      </AppWrapper>
    );
  }
}

export default App;
