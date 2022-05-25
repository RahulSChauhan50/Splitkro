import React, {useState, useCallback} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {Card, TextInput} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GroupDetail = props => {
  const [groupDetails, setGroupDetails] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [groupType, setGroupType] = useState('Home');
  const groupID = props.route.params.groupID;

  const getGroupDetails = async () => {
    try {
      const value = await AsyncStorage.getItem(groupID.toString());
      if (value !== null) {
        // value previously stored
        const tm = JSON.parse(value);
        setGroupDetails(tm.data);
        setGroupName(tm.groupname);
        setGroupType(tm.groupType);
      }
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };
  const saveChanges = async () => {
    try {
      const val = {
        groupname: groupName,
        groupType: groupType,
        data: groupDetails,
      };
      await AsyncStorage.setItem(groupID.toString(), JSON.stringify(val));
      props.navigation.navigate('Home');
    } catch (e) {
      // saving error
      console.log(e);
    }
  };
  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      getGroupDetails();
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, []),
  );

  return (
    <View style={{flex: 1}}>
      <Card
        style={{
          width: '100%',
          height: 50,
          elevation: 5,
          backgroundColor: 'white',
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingStart: 10,
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 20, color: 'black'}}>
            {groupName}
          </Text>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 17,
              color: 'black',
              marginStart: 10,
            }}>
            {groupType}
          </Text>
        </View>
      </Card>
      <ScrollView contentContainerStyle={{alignItems: 'center'}}>
        {groupDetails.map((item, ind) => (
          <Card
            key={ind}
            style={{
              borderRadius: 10,
              width: '95%',
              elevation: 5,
              height: 70,
              marginVertical: 10,
            }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}>
              <View>
                <Text>{item.displayName}</Text>
                <Text>{item.phoneNumbers[0].number}</Text>
              </View>
              <TextInput
                mode="outlined"
                value={item.amount}
                onChangeText={e => {
                  const tm = groupDetails;
                  tm[ind].amount = e;
                  setGroupDetails([...tm]);
                }}
                theme={{
                  colors: {
                    text: parseInt(item.amount) >= 0 ? '#06d6a0' : 'red',
                  },
                }}
              />
            </View>
          </Card>
        ))}
      </ScrollView>
      <TouchableOpacity
        onPress={() => {
          saveChanges();
        }}
        style={{
          backgroundColor: '#06d6a0',
          borderRadius: 5,
          width: '90%',
          alignSelf: 'center',
          position: 'absolute',
          bottom: 10,
          alignItems: 'center',
          padding: 5,
        }}>
        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 15}}>
          SAVE CHANGES
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default GroupDetail;
