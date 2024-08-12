import React, { useState } from "react";
import { View, Text, TouchableHighlight } from "react-native";
import { Stopwatch } from "react-native-stopwatch-timer";
import { timerStyles } from "../styles";
import KeepAwake from "react-native-keep-awake";

const StopwatchComponent = () => {
  const [isStopwatchStart, setIsStopwatchStart] = useState(false);
  const [resetStopwatch, setResetStopwatch] = useState(false);

  return (
    <View style={timerStyles.timerContainer}>
      <Stopwatch
        laps
        msecs
        hours={false}
        start={isStopwatchStart}
        reset={resetStopwatch}
        options={stopwatchOptions}
        getTime={(time) => console.log(time)}
      />
      <View style={timerStyles.controlButtons}>
        <TouchableHighlight
          style={timerStyles.button}
          onPress={() => {
            setIsStopwatchStart(!isStopwatchStart);
            setResetStopwatch(false);
          }}
        >
          <Text style={timerStyles.buttonText}>
            {!isStopwatchStart ? "START" : "STOP"}
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={timerStyles.button}
          onPress={() => {
            setIsStopwatchStart(false);
            setResetStopwatch(true);
          }}
        >
          <Text style={timerStyles.buttonText}>RESET</Text>
        </TouchableHighlight>
      </View>
      {/* <KeepAwake /> */}
    </View>
  );
};

const stopwatchOptions = {
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    height: "fit-content",
    flexGrow: 1,
    padding: 20,
  },
  text: {
    fontSize: 90,
    color: "#AF1717",
    fontFamily: "DSEG14Classic",
  },
};

export default StopwatchComponent;
