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
import { Constants } from "expo";

const HANDSOMEINDIVIDUALS = [
  {
    name: "Ken",
    age: 30,
    photo: "https://pbs.twimg.com/profile_images/792591170899681280/uUXOGmgo.jpg"
  },
  {
    name: "Ken",
    age: 30,
    photo: "https://pbs.twimg.com/profile_images/792591170899681280/uUXOGmgo.jpg"
  },
  {
    name: "Ken",
    age: 30,
    photo: "https://pbs.twimg.com/profile_images/792591170899681280/uUXOGmgo.jpg"
  },
  {
    name: "Ken",
    age: 30,
    photo: "https://pbs.twimg.com/profile_images/792591170899681280/uUXOGmgo.jpg"
  },
  {
    name: "Ken",
    age: 30,
    photo: "https://pbs.twimg.com/profile_images/792591170899681280/uUXOGmgo.jpg"
  }
];

const Card = props => (
  <View
    style={[
      styles.card,
      {
        transform: [
          {
            scale: 1 - props.index * 0.01
          }
        ],
        zIndex: HANDSOMEINDIVIDUALS.length - props.index,
        top: props.index * 7
      }
    ]}
  >
    <Image
      source={{
        uri: "https://pbs.twimg.com/profile_images/792591170899681280/uUXOGmgo.jpg"
      }}
      style={{
        height: props.width - 30,
        width: props.width - 30
      }}
    /> <Text style={styles.cardText}> Ken, 30 </Text>
  </View>
);

class ActiveCard extends Component {
  position = new Animated.ValueXY(0, 0);
  rotation = new Animated.Value(0);

  componentWillMount() {
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: (evt, gestureState) => {},
      onPanResponderMove: Animated.event([
        null,
        {
          dx: this.position.x,
          dy: this.position.y
        }
      ]),
      onPanResponderTerminationRequest: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        Animated.spring(this.position, {
          toValue: {
            x: 0,
            y: 0
          }
        }).start();
      },
      onPanResponderTerminate: (evt, gestureState) => {
        this.position.setValue({
          x: 0,
          y: 0
        });
      },
      onShouldBlockNativeResponder: () => {
        return true;
      }
    });
  }

  render() {
    var rotation = this.position.x.interpolate({
      inputRange: [this.props.width * -1, 0, this.props.width],
      outputRange: ["-90deg", "0deg", "90deg"]
    });

    return (
      <Animated.View
        {...this._panResponder.panHandlers}
        style={[
          styles.card,
          {
            zIndex: 100,
            top: -5,
            transform: [
              {
                translateX: this.position.x
              },
              {
                translateY: this.position.y
              },
              {
                rotate: rotation
              }
            ]
          }
        ]}
      >
        <Image
          source={{
            uri: this.props.user.photo
          }}
          style={{
            height: this.props.width - 30,
            width: this.props.width - 30
          }}
        />
        <Text style={styles.cardText}>
          {this.props.user.name}, {this.props.user.age}
        </Text>
      </Animated.View>
    );
  }
}

const Header = props => (
  <View
    style={[
      styles.header,
      {
        width: props.width
      }
    ]}
  >
    <Text style={styles.logo}> kender </Text>
  </View>
);

class Cards extends Component {
  state = {
    cards: [],
    index: 0
  };
  componentWillMount() {
    let cards = [];
    for (var i = this.state.index; i < this.state.index + 3; i++) {
      cards.push(HANDSOMEINDIVIDUALS[i]);
    }
    this.setState({
      cards
    });
  }
  render() {
    return (
      <View
        style={{
          width: this.props.width,
          height: this.props.width
        }}
      >
        {this.state.cards.map((ken, index) => {
          if (index === 2) {
            return (
              <ActiveCard user={ken} index={index} width={this.props.width} />
            );
          }

          return <Card user={ken} index={index} width={this.props.width} />;
        })}
      </View>
    );
  }
}

export default class App extends Component {
  state = {
    width: 300
  };

  componentWillMount() {
    this.setState({
      width: Dimensions.get("window").width
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Header width={this.state.width} />
        <Cards width={this.state.width} />
        <Text style={styles.message}>
          You like me no matter which way you swipe, thats undeniable.
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#cfcfcf",
    position: "absolute",
    left: 15
  },
  cardText: {
    fontSize: 18,
    padding: 15
  },
  header: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#cfcfcf",
    flex: 0,
    marginBottom: 15,
    alignItems: "center"
  },
  logo: {
    fontSize: 24,
    color: "#DB4C2C",
    fontWeight: "bold"
  },
  message: {
    width: 300,
    marginTop: 60,
    fontSize: 18
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1"
  }
});
