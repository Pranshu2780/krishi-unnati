import React from 'react';
import { View, Text, StyleSheet, Button, Alert, Image, TouchableOpacity } from 'react-native';
import Firebase from '../config/firebaseconfig';
import * as ImagePicker from 'expo-image-picker';
import bird_req from '../config/request'
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import data from '../Json/Cure';

class Profile extends React.Component {

state = {
        image_src: '',
        title: 'Hello, World!',
        content: '',
        image: null,
        disease: '',
        pro:'',
        cure:'',
}

    cure = async () => {
      {data.map((details,index)=>{
         {details.Name };
      }
   )}
}

    handleSignout = () => {
        Firebase.auth().signOut()
        this.props.navigation.navigate('Login')
    }

    deleteUser = () => {
        var user = Firebase.auth().currentUser;
        user.delete().then(() => {
            this.props.navigation.navigate('Login')
        }).catch(function (error) {
            console.log('this is the error')
        });
    }

    writeUserData = () => {
        var userId = Firebase.auth().currentUser.uid;
        Firebase.database().ref('users/' + userId).set({
            username: 'Saur',
            email: 'email'
        });
    }

    onClickImagePress = async () => {
        let result = await ImagePicker.launchCameraAsync();

        if (!result.cancelled) {

            this.uploadImage(result.uri, "test-image")
                .then(() => {
                    Alert.alert("Success");
                })
                .catch((error) => {
                    Alert.alert('error');
                });
        }
    }

    onChooseImagePress = async () => {

        let result = await ImagePicker.launchImageLibraryAsync();
        
        this.setState({disease:'loading...'})
        this.setState({pro:''})
        if (!result.cancelled) {
            let localUri = result.uri;
            let filename = localUri.split('/').pop();
            const base64 = await FileSystem.readAsStringAsync(localUri, { encoding: 'base64' });
            
            
            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image`;
            let form_data = new FormData();
            
            this.setState({ image_src: result.uri })
            
            form_data.append('title', this.state.title);
            form_data.append('content', base64);
            
            let url = 'http://192.168.29.207/api/posts/';
            await axios.post(url, form_data, {
                headers: {
                    'content_type': 'multipart/form-data'
                }
            })
                .then(res => {
                    this.setState({disease:res.data.disease_name})
                    this.setState({pro:res.data.probability})
                    this.setState({cure:res.data.disease_details.Cure})
                    console.log(this.state.cure);
                })
                .catch(err => console.log(err))

            
        }
    }

    

    dataURItoBlob = (dataURI) => {
        var binary = atob(dataURI.split(',')[1]);
        var array = [];
        for(var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
    }
    
    information = () => {
        this.props.navigation.navigate('Cure', {
            cure: this.state.cure,
        })
        this.setState({ pro: '' })
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.image_src == '' ? <Image source={require('../assets/test1.jpeg')} style={{ width: 400, height: 400 }} /> :
                    <Image source={{ uri: this.state.image_src }} style={{ width: 400, height: 400 }} />}
             
                <View style={styles.button}>
                     <View style={styles.buttontext}>
                        <Button style={styles.btndes} title="Capture" onPress={this.onClickImagePress} />
                     </View>
                  
                     <View style={styles.buttontext}>
                        <Button style={{borderRadius:50}} title="Choose from Gallery" onPress={this.onChooseImagePress} />
                     </View>
                    
                    <View style={styles.buttontext}>
                          <Button title='Logout' onPress={this.handleSignout} />
                    </View>
                </View>

                     <Text> Disease Name : - {this.state.disease}</Text>
                     <Text>Probability:- {this.state.pro} %</Text>

                      {/* <Button title="CURE" onPress={this.cure} />   */}
                      {this.state.pro == '' ? null : <Button title="Cure" onPress={this.information} >Cure</Button>}
            
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',

    },
    button: {
        flexDirection: 'row',
        padding: 10,
        borderRadius:50,
    },
    buttontext: {
        marginHorizontal: 10
    },
    design3:{
        backgroundColor:'gray',
        borderRadius:50,
        padding:10,
        color:'white'
    }

})

export default Profile