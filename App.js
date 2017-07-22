import React, { Component } from "react";
import {
  Text,
  Image,
  View,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated
} from "react-native";
import { Constants, Speech } from "expo";
import DogNames from "dog-names";

import SwipeCards from "./SwipeCards";

let Card = React.createClass({
  render() {
    return (
      <View style={styles.card}>
        <Image style={styles.thumbnail} source={{ uri: this.props.image }} />
        <Text style={styles.text}>{this.props.name}</Text>
      </View>
    );
  }
});

let NoMoreCards = React.createClass({
  render() {
    return (
      <View style={styles.noMoreCards}>
        <Text>No more cards</Text>
      </View>
    );
  }
});

function shuffle(a) {
  for (let i = a.length; i; i--) {
    let j = Math.floor(Math.random() * i);
    [a[i - 1], a[j]] = [a[j], a[i - 1]];
  }
}

shuffle(DogNames.all);

const available = [];

export default React.createClass({
  async fetchCards() {
    const prefetchAmount = 50;
    Promise.all(
      DogNames.all.slice(0, prefetchAmount).map(name => this.fetchUrl())
    ).then(urls => {
      const objs = [];
      for (var i = 0; i < urls.length; i += 1) {
        objs.unshift({ name: DogNames.all[i], image: urls[i] });
      }
      this.setState({ cards: objs });
    });
  },

  async fetchUrl() {
    return fetch("https://dog.ceo/api/breeds/image/random")
      .then(r => r.json())
      .then(r => r.message);
  },

  handleYup(card) {
    Speech.speak(`${card.name}, what a good doggo!`);
  },
  handleNope(card) {
    Speech.speak("bork bork");
  },

  render() {
    if (this.state && this.state.cards) {
      console.log(this.state.cards);
      return (
        <SwipeCards
          cards={this.state.cards}
          renderCard={cardData => <Card {...cardData} />}
          renderNoMoreCards={() => <NoMoreCards />}
          handleYup={this.handleYup}
          handleNope={this.handleNope}
          yupText={"14/10"}
          nopeText={"11/10"}
        />
      );
    } else {
      this.fetchCards();
      return <View><Text>oops</Text></View>;
    }
  }
});

const styles = StyleSheet.create({
  card: {
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
    width: 300,
    height: 300
  },
  thumbnail: {
    flex: 1,
    width: 300,
    height: 300
  },
  noMoreCards: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
