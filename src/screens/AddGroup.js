import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Contacts from 'react-native-contacts';
import {Card, Checkbox, TextInput, Chip} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AddGroup = props => {
  const [groupId, setGroupId] = useState(-1);
  const [contactList, setContactList] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [groupType, setGroupType] = useState('Home');
  const getGroups = async () => {
    try {
      const value = await AsyncStorage.getItem('Groups');
      if (value !== null) {
        // value previously stored
        const tm = JSON.parse(value);
        tm.push({
          groupId: groupId,
          groupName: groupName,
          groupType: groupType,
          member: contactList.filter(e => e.checked === 'checked').length,
        });
        try {
          await AsyncStorage.setItem('Groups', JSON.stringify(tm));
        } catch (e) {
          console.log(e);
        }
      } else {
        try {
          await AsyncStorage.setItem(
            'Groups',
            JSON.stringify([
              {
                groupId: groupId,
                groupName: groupName,
                groupType: groupType,
                member: contactList.filter(e => e.checked === 'checked').length,
              },
            ]),
          );
        } catch (e) {
          console.log(e);
        }
      }
      createGroup();
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };
  const createGroup = async () => {
    try {
      const val = {
        groupname: groupName,
        groupType: groupType,
        data: contactList.filter(e => e.checked === 'checked'),
      };
      await AsyncStorage.setItem(groupId.toString(), JSON.stringify(val));
      props.navigation.navigate('Home');
    } catch (e) {
      // saving error
      console.log(e);
    }
  };
  const fetchContact = async () => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: 'Contacts',
      message: 'This app would like to view your contacts.',
      buttonPositive: 'allow',
      buttonNegative: 'deny',
    })
      .then(e => {
        Contacts.getAll()
          .then(contacts => {
            // work with contacts
            const tmp = contacts.map((item, ind) => {
              return {checked: 'unchecked', amount: '0', ...item};
            });
            setContactList(tmp);
          })
          .catch(e => {
            console.log(e);
          });
      })
      .catch(e => console.log(e));
  };
  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      setGroupId(+new Date());
      fetchContact();
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, []),
  );

  return (
    <View style={{flex: 1}}>
      <TextInput
        mode="outlined"
        placeholder="Enter Group Name"
        style={{width: '95%', marginVertical: 10, alignSelf: 'center'}}
        value={groupName}
        onChangeText={e => setGroupName(e)}
      />
      <View
        style={{
          width: '95%',
          alignSelf: 'center',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}>
        <Chip
          onPress={() => setGroupType('Home')}
          style={{
            backgroundColor: groupType === 'Home' ? '#06d6a0' : 'grey',
          }}
          textStyle={{color: 'white'}}>
          Home
        </Chip>
        <Chip
          onPress={() => setGroupType('Trip')}
          style={{
            backgroundColor: groupType === 'Trip' ? '#06d6a0' : 'grey',
          }}
          textStyle={{color: 'white'}}>
          Trip
        </Chip>
        <Chip
          onPress={() => setGroupType('Office')}
          style={{
            backgroundColor: groupType === 'Office' ? '#06d6a0' : 'grey',
          }}
          textStyle={{color: 'white'}}>
          Office
        </Chip>
        <Chip
          onPress={() => setGroupType('Others')}
          style={{
            backgroundColor: groupType === 'Others' ? '#06d6a0' : 'grey',
          }}
          textStyle={{color: 'white'}}>
          Others
        </Chip>
      </View>
      <ScrollView contentContainerStyle={{alignItems: 'center'}}>
        {contactList.map((item, ind) => (
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
              <Checkbox
                status={item.checked}
                onPress={() => {
                  const tm = contactList;
                  tm[ind].checked =
                    tm[ind].checked === 'checked' ? 'unchecked' : 'checked';
                  setContactList([...tm]);
                }}
              />
              <View>
                <Text>{item.displayName}</Text>
                <Text>{item.phoneNumbers[0].number}</Text>
              </View>
              <TextInput
                mode="outlined"
                value={item.amount}
                onChangeText={e => {
                  const tm = contactList;
                  tm[ind].amount = e;
                  setContactList([...tm]);
                }}
              />
            </View>
          </Card>
        ))}
      </ScrollView>
      <TouchableOpacity
        onPress={() => {
          getGroups();
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
          CREATE GROUP
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddGroup;
