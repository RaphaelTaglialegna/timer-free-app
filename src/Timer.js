import React, { useEffect, useState } from "react";
import { View, Text, TouchableHighlight } from "react-native";
import { timerStyles } from "../styles";
import { Audio } from "expo-av";
import KeepAwake from "react-native-keep-awake";
import ScrollPicker from "react-native-picker-scrollview";
import finalBuzzer from "../assets/audio/mixkit-basketball-buzzer-1647.wav";
import nbaPiano from "../assets/audio/nba_audio.mp3";
const generatePickerData = (maxValue) => {
  return Array.from({ length: maxValue }, (_, index) =>
    String(index).padStart(2, "0")
  );
};

const pickerData = generatePickerData(60);

const TimerComponent = ({ resetTimmerComponent }) => {
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const [isTimerStart, setIsTimerStart] = useState(false);
  const [sound, setSound] = useState();
  const [lastTimer, setLastTimer] = useState(["00", "00"]);
  const [isMuteAudio, setIsMuteAudio] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isTimerStart) {
      if (minutes === "00" && seconds === "30") {
        playSound(nbaPiano);
      }
      interval = setInterval(() => {
        const totalSeconds = parseInt(minutes) * 60 + parseInt(seconds);

        if (totalSeconds > 0) {
          const newMinutes = Math.floor((totalSeconds - 1) / 60);
          const newSeconds = (totalSeconds - 1) % 60;

          setMinutes(String(newMinutes).padStart(2, "0"));
          setSeconds(String(newSeconds).padStart(2, "0"));
        } else {
          handleFinish();
        }
      }, 1000);
    } else if (!isTimerStart && interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerStart, minutes, seconds]);

  async function playSound(audio) {
    if (isMuteAudio === true || !audio) {
      return;
    }

    // const { sound: finalBuzzer } = await Audio.Sound.createAsync(
    //   require("../assets/audio/mixkit-basketball-buzzer-1647.wav")
    // );
    const { sound } = await Audio.Sound.createAsync(audio);

    setSound(audio);
    await sound.playAsync();
  }

  const handlePickerChange = (item, type) => {
    if (!isTimerStart) {
      if (type === "minutes") {
        setMinutes(item);
        setLastTimer([item, seconds]);
      } else if (type === "seconds") {
        setSeconds(item);
        setLastTimer([minutes, item]);
      }
    }
  };

  const resetTimer = () => {
    setIsTimerStart(false);
    setMinutes("00");
    setSeconds("00");
    resetTimmerComponent();
  };

  const handleFinish = () => {
    playSound(finalBuzzer);
    setMinutes(lastTimer[0]);
    setSeconds(lastTimer[1]);
    setIsTimerStart(false);
  };

  const wrapperHeight = 210;
  const itemHeight = 220;

  const handleStart = () => {
    if (isTimerStart) {
      setIsTimerStart(false);
    } else {
      setIsTimerStart(true);
    }
  };

  return (
    <View style={timerStyles.timerContainer}>
      <View style={timerStyles.pickerContainer}>
        {!isTimerStart ? (
          <React.Fragment>
            <ScrollPicker
              dataSource={pickerData} // 0 to 59 for minutes
              selectedIndex={parseInt(minutes)}
              renderItem={(data) => (
                <Text style={timerStyles.selectedText}>{data}</Text>
              )}
              onValueChange={(data) => handlePickerChange(data, "minutes")}
              wrapperHeight={wrapperHeight}
              itemHeight={itemHeight}
              wrapperColor="#000000"
              key={`minutes-${minutes}`} // Forçar re-render
            />
            <Text style={timerStyles.colon}>:</Text>
            <ScrollPicker
              dataSource={pickerData} // 0 to 59 for seconds
              selectedIndex={parseInt(seconds)}
              renderItem={(data) => (
                <Text style={timerStyles.selectedText}>{data}</Text>
              )}
              onValueChange={(data) => handlePickerChange(data, "seconds")}
              wrapperHeight={wrapperHeight}
              itemHeight={itemHeight}
              wrapperColor="#000000"
              key={`seconds-${seconds}`} // Forçar re-render
            />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Text style={timerStyles.selectedText}>{minutes}</Text>

            <Text style={timerStyles.colon}>:</Text>

            <Text style={timerStyles.selectedText}>{seconds}</Text>
          </React.Fragment>
        )}
      </View>

      <View style={timerStyles.controlButtons}>
        <TouchableHighlight
          onPress={() => handleStart()}
          style={timerStyles.button}
          disabled={minutes === "00" && seconds === "00"}
        >
          <Text
            style={{
              ...timerStyles.buttonText,
              color: minutes === "00" && seconds === "00" ? "white" : "green",
            }}
          >
            {isTimerStart ? "STOP" : "START"}
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => setIsMuteAudio(!isMuteAudio)}
          style={timerStyles.button}
          disabled={isTimerStart}
        >
          <Text style={timerStyles.buttonText}>
            {isMuteAudio ? "UNMUTE" : "MUTE"}
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
