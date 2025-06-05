import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function App() {
  const [lotteryNumber, setLotteryNumber] = useState(generateRandomNumber());
  const [guess, setGuess] = useState('');
  const [bet, setBet] = useState(1);
  const [multiplierEnabled, setMultiplierEnabled] = useState(false);
  const [multiplier, setMultiplier] = useState(2);
  const [resultMessage, setResultMessage] = useState('');
  const [showLotteryNumber, setShowLotteryNumber] = useState(false);

  function generateRandomNumber() {
    return Math.floor(Math.random() * 100) + 1;
  }

  const onSubmitGuess = () => {
    const guessNumber = parseInt(guess);
    if (isNaN(guessNumber) || guessNumber < 1 || guessNumber > 10000) {
      Alert.alert('Invalid input', 'Please enter a number between 1 and 10000.');
      return;
    }
    setShowLotteryNumber(true);
    if (guessNumber === lotteryNumber) {
      const winMultiplier = multiplierEnabled ? multiplier : 1;
      const winnings = bet * 10 * winMultiplier;
      setResultMessage(`🎉 You won! Your winnings: ${winnings} points!`);
    } else {
      setResultMessage(
        guessNumber < lotteryNumber
          ? '❌ Too low!'
          : '❌ Too high!'
      );
    }
  };

  const onNextRound = () => {
    setLotteryNumber(generateRandomNumber());
    setGuess('');
    setResultMessage('');
    setShowLotteryNumber(false);
    setMultiplierEnabled(false);
    setMultiplier(2);
    setBet(1);
  };

  const increaseBet = () => setBet((prev) => (prev < 100 ? prev + 1 : prev));
  const decreaseBet = () => setBet((prev) => (prev > 1 ? prev - 1 : prev));
  const increaseMultiplier = () => setMultiplier((prev) => (prev < 10 ? prev + 1 : prev));
  const decreaseMultiplier = () => setMultiplier((prev) => (prev > 2 ? prev - 1 : prev));

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.title}>Lottery Game</Text>
      <Text style={styles.resultMessage}>{resultMessage}</Text>

      <View style={styles.lotteryNumberContainer}>
        <Text style={styles.lotteryNumberLabel}>Result:</Text>
        <Text style={styles.lotteryNumber}>
          {showLotteryNumber ? lotteryNumber : '???'}
        </Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Your guess (1-10000)"
        placeholderTextColor="#999"
        keyboardType="numeric"
        maxLength={5}
        value={guess}
        onChangeText={setGuess}
        editable={!resultMessage}
      />

      <View style={styles.betContainer}>
        <TouchableOpacity
          style={styles.betButton}
          onPress={decreaseBet}
          disabled={!!resultMessage}
        >
          <Text style={styles.betButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.betText}>Bet: {bet}</Text>
        <TouchableOpacity
          style={styles.betButton}
          onPress={increaseBet}
          disabled={!!resultMessage}
        >
          <Text style={styles.betButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {resultMessage.includes('won') && (
        <View style={styles.multiplierContainer}>
          <Text style={styles.multiplierLabel}>Multiplier</Text>
          <Switch
            value={multiplierEnabled}
            onValueChange={setMultiplierEnabled}
            trackColor={{ false: '#ccc', true: '#4caf50' }}
            thumbColor="#fff"
          />
          {multiplierEnabled && (
            <View style={styles.multiplierControls}>
              <TouchableOpacity style={styles.multiplierButton} onPress={decreaseMultiplier}>
                <Text style={styles.multiplierButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.multiplierValue}>{multiplier}x</Text>
              <TouchableOpacity style={styles.multiplierButton} onPress={increaseMultiplier}>
                <Text style={styles.multiplierButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {!resultMessage ? (
        <TouchableOpacity style={styles.submitButton} onPress={onSubmitGuess}>
          <Text style={styles.submitButtonText}>Submit Guess</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.nextButton} onPress={onNextRound}>
          <Text style={styles.nextButtonText}>Next Round</Text>
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: 12,
  },
  resultMessage: {
    fontSize: 18,
    color: '#16a34a',
    marginBottom: 24,
    minHeight: 24,
    textAlign: 'center',
  },
  lotteryNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  lotteryNumberLabel: {
    fontSize: 18,
    color: '#64748b',
    marginRight: 8,
  },
  lotteryNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0f172a',
    backgroundColor: '#e0e7ef',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    minWidth: 70,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 18,
    width: '80%',
    marginBottom: 24,
    color: '#0f172a',
    backgroundColor: '#fff',
  },
  betContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  betButton: {
    backgroundColor: '#e0e7ef',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  betButtonText: {
    fontSize: 24,
    color: '#2563eb',
    fontWeight: 'bold',
  },
  betText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 36,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  submitButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#e0e7ef',
    paddingHorizontal: 36,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  nextButtonText: {
    fontSize: 20,
    color: '#2563eb',
    fontWeight: 'bold',
  },
  multiplierContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  multiplierLabel: {
    fontSize: 16,
    color: '#64748b',
    marginRight: 8,
  },
  multiplierControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  multiplierButton: {
    backgroundColor: '#e0e7ef',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  multiplierButtonText: {
    fontSize: 18,
    color: '#2563eb',
    fontWeight: 'bold',
  },
  multiplierValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    minWidth: 36,
    textAlign: 'center',
  },
});
