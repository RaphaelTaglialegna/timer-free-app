import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { timerStyles, timerOptions } from "../styles";
import { Timer } from "react-native-stopwatch-timer";
import ScrollPicker from "react-native-wheel-scrollview-picker";

const TimerDisplay = ({
  isTimerStart,
  timerDuration,
  resetTimer,
  handleFinish,
  minutes,
  seconds,
  hours,
  handlePickerChange,
}) => {
  const generatePickerData = () => {
    return Array.from({ length: 60 }, (v, i) => i.toString().padStart(2, "0"));
  };

  const heightPicker = 120;

  useEffect(() => {
    setPickerIndices({
      hours: parseInt(hours),
      minutes: parseInt(minutes),
      seconds: parseInt(seconds),
    });
  }, [hours, minutes, seconds]);

  const [pickerIndices, setPickerIndices] = React.useState({
    hours: parseInt(hours),
    minutes: parseInt(minutes),
    seconds: parseInt(seconds),
  });

  if (isTimerStart) {
    return (
      <Timer
        totalDuration={timerDuration}
        start={isTimerStart}
        reset={resetTimer}
        options={timerOptions}
        handleFinish={handleFinish}
      />
    );
  } else {
    return (
      <View style={timerStyles.pickerContainer}>
        {["hours", "minutes", "seconds"].map((unit) => (
          <React.Fragment key={unit}>
            <ScrollPicker
              dataSource={generatePickerData()}
              selectedIndex={pickerIndices[unit]}
              renderItem={(data) => (
                <Text style={timerStyles.selectedText}>{data}</Text>
              )}
              onValueChange={(data) => handlePickerChange(data, unit)}
              wrapperHeight={heightPicker}
              itemHeight={heightPicker}
              highlightColor="#000000"
              wrapperColor="#000000"
              wrapperBackground="#000000"
              highlightBorderWidth={2}
            />
            {unit !== "seconds" && <Text style={timerStyles.colon}>:</Text>}
          </React.Fragment>
        ))}
      </View>
    );
  }
};

export default TimerDisplay;
