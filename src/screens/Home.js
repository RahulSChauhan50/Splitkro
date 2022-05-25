import React, {useState, useCallback} from 'react';
import {View, Text, ScrollView} from 'react-native';
import {Appbar, Card, FAB} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = props => {
  const [groupList, setGroupList] = useState([]);
  const FetchGroupList = async () => {
    try {
      const value = await AsyncStorage.getItem('Groups');
      if (value !== null) {
        // value previously stored
        const tm = JSON.parse(value);
        setGroupList(tm);
      }
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      FetchGroupList();
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
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontWeight: 'bold', fontSize: 20, color: 'black'}}>
            SplitKaro
          </Text>
        </View>
      </Card>
      <View
        style={{
          flex: 1,
          marginHorizontal: 5,
          marginTop: 10,
        }}>
        <ScrollView contentContainerStyle={{alignItems: 'center'}}>
          {groupList.map((item, ind) => (
            <Card
              onPress={() =>
                props.navigation.navigate('GroupDetail', {
                  groupID: item.groupId,
                })
              }
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
                  padding: 10,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View style={{justifyContent: 'space-around'}}>
                  <Text
                    style={{fontWeight: 'bold', fontSize: 15, color: 'black'}}>
                    {item.groupName}
                  </Text>
                  <Text
                    style={{
                      fontWeight: '500',
                      fontSize: 13,
                      color: '#00000090',
                    }}>
                    {item.member} people
                  </Text>
                </View>
                <Text
                  style={{fontWeight: '500', fontSize: 14, color: '#00000090'}}>
                  {item.groupType}
                </Text>
              </View>
            </Card>
          ))}
        </ScrollView>
      </View>
      <FAB
        onPress={() => props.navigation.navigate('AddGroup')}
        icon={'plus'}
        label="CREATE GROUP"
        style={{bottom: 20, width: '45%', alignSelf: 'flex-end', right: 20}}
      />
    </View>
  );
};

export default Home;
