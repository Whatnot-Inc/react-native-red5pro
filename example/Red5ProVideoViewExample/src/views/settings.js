import React, { useState, useEffect, Fragment } from 'react'
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
  TextInput
} from 'react-native'
import { Icon } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'flex-start'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 10,
    marginTop: 15
  },
  subcontainer: {
    paddingHorizontal: 50,
    paddingVertical: 20
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15
  },
  switchLabel: {
    fontSize: 15
  },
  loggingConfigContainer: {
    paddingLeft: '25%'
  },
  input: {
    borderWidth: 1,
    borderColor: 'grey',
    width: 70,
    height: 30,
    padding: 0,
    marginRight: 0,
    textAlign: 'center'
  }
})

export default function Settings(props) {
  const [state, setState] = useState({
    autoFocusEnabled: false,
    autoReconnectEnabled: false,
    adaptiveBitrateEnabled: false,
    doubleBitrateEnabled: false,
    statsLogEnabled: false,
    resetLogs: false,
    logsInterval: 5000,
  })
  const [intervalValue, setIntervalValue] = useState("")

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    storeData()
  }, [state])

  const storeData = async () => {
    try {
      const json = JSON.stringify(state)
      await AsyncStorage.setItem('@settings', json)

    } catch (error) {
      console.log(error)
    }
  }
  
  const getData = async () => {
    try {
      const jsonData = await AsyncStorage.getItem('@settings')

      if (jsonData != null) {
        const parsedData = JSON.parse(jsonData)
        setState({...state, ...parsedData})
        setIntervalValue(String(parsedData.logsInterval))
      }

    } catch (error) {
      console.log(error)
    }
  }

  const toggleAutoFocus = () => {
    const newValue = !state.autoFocusEnabled

    setState({
      ...state,
      autoFocusEnabled: newValue
    })
  }

  const toggleAutoReconnect = () => {
    const newValue = !state.autoReconnectEnabled

    setState({
      ...state,
      autoReconnectEnabled: newValue
    })
  }

  const toggleAdaptiveBitrate = () => {
    const newValue = !state.adaptiveBitrateEnabled

    setState({
      ...state,
      adaptiveBitrateEnabled: newValue
    })
  }

  const toggledoubleBitrate = () => {
    const newValue = !state.doubleBitrateEnabled

    setState({
      ...state,
      doubleBitrateEnabled: newValue
    })
  }

  const toggleStatsLogging = () => {
    const newValue = !state.statsLogEnabled

    setState({
      ...state,
      statsLogEnabled: newValue
    })
  }

  const toggleResetLogs = () => {
    const newValue = !state.resetLogs

    setState({
      ...state,
      resetLogs: newValue
    })
  }

  const onSubmitInterval = e => {
    const parsedValue = parseInt(e.nativeEvent.text)
    if (parsedValue && !isNaN(parsedValue)) {
      setState({...state, logsInterval: parsedValue})
    } else {
      setState({...state, logsInterval: 5000})
      setIntervalValue("5000")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={props.onClose}
        >
          <Icon
            name='arrow-back'
            color='#2196F3'
            size={24}
          />
        </TouchableOpacity>
        <Text
          style={{color: '#2196F3', fontSize: 20, marginLeft: 15}}
        >
          Settings
        </Text>
        <View style={{width: 24}} />
      </View>
      <View style={styles.subcontainer}>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Enable auto-focus</Text>
          <Switch
            disabled
            value={false}
            // value={state.autoFocusEnabled}
            onValueChange={toggleAutoFocus}
          />
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Enable auto-reconnect</Text>
          <Switch
            disabled
            value={false}
            //value={state.autoReconnectEnabled}
            onValueChange={toggleAutoReconnect}
          />
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Enable adaptive bitrate</Text>
          <Switch
            value={state.adaptiveBitrateEnabled}
            onValueChange={toggleAdaptiveBitrate}
          />
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Enable double bitrate (1500)</Text>
          <Switch
            value={state.doubleBitrateEnabled}
            onValueChange={toggledoubleBitrate}
          />
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Enable stream logs</Text>
          <Switch
            value={state.statsLogEnabled}
            onValueChange={toggleStatsLogging}
          />
        </View>
        { 
          state.statsLogEnabled &&
          
          <View style={styles.loggingConfigContainer}>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Log interval (ms)</Text>
              <TextInput 
                value={intervalValue}
                keyboardType="numeric"
                onChangeText={(text) => setIntervalValue(text)}
                onEndEditing={onSubmitInterval}
                enablesReturnKeyAutomatically
                maxLength={5}
                style={styles.input}
              />
            </View>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Always reset logs</Text>
              <Switch
                value={state.resetLogs}
                onValueChange={toggleResetLogs}
              />
            </View>
          </View>
        }
      </View>
    </SafeAreaView>
  )
}
