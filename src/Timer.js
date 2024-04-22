import React, { useEffect, useState } from "react";
import { View, Text, TouchableHighlight } from "react-native";
import { timerStyles } from "../styles";
import { Audio } from "expo-av";
import TimerDisplay from "./TimerDisplay";
import KeepAwake from "react-native-keep-awake";

const TimerComponent = ({ resetTimmerComponent }) => {
  const [timerDuration, setTimerDuration] = useState(0);
  const [isTimerStart, setIsTimerStart] = useState(false);
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const [sound, setSound] = useState();

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/audio/mixkit-basketball-buzzer-1647.wav")
    );
    setSound(sound);

    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const handlePickerChange = (item, type) => {
    if (type === "minutes") {
      setMinutes(item);
    } else if (type === "seconds") {
      setSeconds(item);
    } else if (type === "hours") {
      setHours(item);
    }
  };

  useEffect(() => {
    setTimerDuration(
      parseInt(hours) * 3600000 +
        parseInt(minutes) * 60000 +
        parseInt(seconds) * 1000
    );
  }, [hours, minutes, seconds]);

  const resetTimer = () => {
    setIsTimerStart(false);
    setTimerDuration(0);
    setHours("00");
    setMinutes("00");
    setSeconds("00");
    resetTimmerComponent();
  };

  const handleFinish = () => {
    playSound();
    setIsTimerStart(false);
  };

  return (
    <View style={timerStyles.timerContainer}>
      <TimerDisplay
        isTimerStart={isTimerStart}
        timerDuration={timerDuration}
        resetTimer={resetTimer}
        minutes={minutes}
        seconds={seconds}
        hours={hours}
        handlePickerChange={handlePickerChange}
        handleFinish={handleFinish}
      />
      <View style={timerStyles.controlButtons}>
        <TouchableHighlight
          onPress={() => setIsTimerStart(!isTimerStart)}
          style={timerStyles.button}
          disabled={timerDuration === 0}
        >
          <Text
            style={{
              ...timerStyles.buttonText,
              color: timerDuration === 0 ? "white" : "green",
            }}
          >
            {isTimerStart ? "STOP" : "START"}
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => resetTimer()}
          style={timerStyles.button}
          disabled={isTimerStart}
        >
          <Text style={timerStyles.buttonText}>RESET</Text>
        </TouchableHighlight>
      </View>
      <KeepAwake />
    </View>
  );
};

export default TimerComponent;
