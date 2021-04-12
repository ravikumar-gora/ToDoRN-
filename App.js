import { StatusBar } from 'expo-status-bar';
 import AntIcon from "react-native-vector-icons/AntDesign";
import React,{useEffect, useState}from 'react';
import {FlatList,TouchableOpacity, View, Keyboard, Alert } from 'react-native';
import { Appbar, TextInput, Button,List,Snackbar} from 'react-native-paper';
import firebase from 'firebase';
import "firebase/firestore";


import {LogBox} from 'react-native';
LogBox.ignoreAllLogs(true)


const  firebaseConfig = {
  apiKey: "AIzaSyCqtGSVjLCICohImhgYg7ZvIiyYGh_MjNU",
  authDomain: "todofire-fc270.firebaseapp.com",
  projectId: "todofire-fc270",
  storageBucket: "todofire-fc270.appspot.com",
  messagingSenderId: "359565376011",
  appId: "1:359565376011:web:0743db32648db7a9a6a50e",
  measurementId: "G-JKYRZ9KSP1"
  };
if(firebase.apps.length==0){
 const app =  firebase.initializeApp(firebaseConfig);
 

}
const db = firebase.firestore();
const ToDo = db.collection('dolist');
 

export default function App() {

  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);
  const [visible, setVisible] = React.useState(false);

  const [todo,setTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [todos ,setTodos] = useState([]); 
  
    // adding data to DataBase
    async function addTodo(){
      Keyboard.dismiss();
      if(!todo){
        Alert.alert(
          "Alert",
          "Empty input not allowed.",
          [
            {
              text: "Ok",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
          ]
        );

      }
      else{
      await ToDo.add({
        title:todo,
        complete:false,
        timestamp:new Date()
      });
      setTodo('');
    }
  }
  console.log(todos)
    // reading data from DataBase
    useEffect(() => {
      return ToDo.onSnapshot((querySnapshot) => {
       const list = [];
       querySnapshot.forEach(doc=>{
         const {title,complete,timestamp}  = doc.data();
         list.push({
           id:doc.id,
           title,
           complete,
           timestamp
         });
       });
       setTodos(list);

       if(loading){
         setLoading(false);
       }
      });
    }, []);
    console.log(todos)
    if(loading){
      return null;
    }
 return (
   
  <>

  <StatusBar
     barStyle="light-content" /> 

    <Appbar.Header>
      <Appbar.Content title="ToDoList"  subtitle="Make your day productive" style={{alignItem:"center",justifyContent:'center'}} />
      <Appbar.Action icon="magnify"  onPress={onToggleSnackBar} />
      <Snackbar
        visible={visible}
        // theme={{ colors: {surface: 'black', accent: 'red'},}}
        onDismiss={onDismissSnackBar}
       >Under development</Snackbar>
      <Appbar.Action icon="dots-vertical" onPress={onToggleSnackBar}  />
    </Appbar.Header>
    
    <FlatList 
        style={{flex: 1}}
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Todo {...item}
        />}
      />
     
      <View >
      <TextInput label={'New Todo'} onChangeText={setTodo} value={todo} />
    <Button onPress={() => addTodo()} style={{fontSize:18,marginBotton:10,height:50,color:"white",icon:"camera"}}>Add TODO</Button>
      </View>

  </>
);

function getFormattedTime(timestamp){

  var date = new Date(timestamp.seconds* 1000); 
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();
  var time1 = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  var formattedTime = time1.replace(/[0-9]{1,2}(:[0-9]{2}){2}/, function (time) {
    time = time.replace(/.{3}$/, '');
    var hms = time.split(':'),
        h = +hms[0],
        suffix = (h < 12) ? ' am' : ' pm';
    hms[0] = h % 12 || 12;        
    return hms.join(':') + suffix
});
  var date = new Date(timestamp.seconds*1000).toLocaleDateString("en-US");
  var formattedDate = new Date(date).toString();
  var formattedDate1 = formattedDate.slice(0,16)
  return formattedTime +"  "+ formattedDate1;
  }

//Updating To DataBase
function Todo({ id, title, complete,timestamp }) {

  var time = getFormattedTime(timestamp);
  async function toggleComplete() {
    await ToDo.doc(id).update({
      complete:!complete
    })
    .then(()=>{
  
    })
   
  }
  async function deleteData() {
    
    await Alert.alert(
      "Alert",
      "Are you sure you want to delete? ",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel"
        },
        {
          text: "Ok",
          onPress: ()=>{
           ToDo.doc(id).delete()
            .then(()=>{
        
            })
           
          },
          style: "ok"
        },
      ])}

  return (
    <View>
   <View>
      <List.Item
    horizontal={true}
   
      title={title}
      description={time}
      onPress={() => toggleComplete()}
      left={props => (
        <List.Icon {...props} icon={complete ? 'check' : 'window-close'} />
      )}
      right={props => (
       <View>
         <TouchableOpacity   onPress={() => deleteData()} >
         <AntIcon name="delete" color="red" style={{padding:15}}size={25} />
         </TouchableOpacity>
       </View>
      )}/> 
    </View>
     <View style={{
    borderBottomColor: 'black',
    borderBottomWidth: 0.4,}}/>
   </View>

  );
}
}