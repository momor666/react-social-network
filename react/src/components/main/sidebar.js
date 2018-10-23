import React, { Component } from 'react';
import Updates from './updates'
import {app} from "../../config/firebase_config"

// side bar component for main page
class Sidebar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            loading: true
        }
    }



    // Called immediately before mounting occurs, and before Component#render
    componentWillMount = () => { 
        // for each user being followed,
        this.props.following.forEach((user) => {
            // find their profile information
            app.database().ref(`/profile/${user}`).once("value", (snapshot) => {
                if(snapshot.val()) {    
                    // get their profile pic, username, and last update
                    app.storage().ref(`profile/${user}`).child("profile").getDownloadURL().then((url) => {
                        let value = {
                            profile_pic: url,
                            username: snapshot.key,
                            last_update: snapshot.val().last_update}
                        // add that information to the list of updates
                        this.setState({data: [...this.state.data, value]})
                    }).catch((error) => {
                        // if no profile pic, use the default pic
                        let value = {
                            profile_pic: "https://firebasestorage.googleapis.com/v0/b/react-social-network-7e88b.appspot.com/o/assets%2Fdefault.png?alt=media",
                            username: snapshot.key,
                            last_update: snapshot.val().last_update}
                        // add that information to the list of updates
                        this.setState({data: [...this.state.data, value]})
                    })
                }
            })
        })
        // now component can be loaded
        this.setState({loading: false})
    }


    
    render() {
        if(this.state.loading) {
            return null
        } else {
            return(
                <div className="sidebar">
                    <nav className="panel" styles="background-color: white;">
                        <p className="panel-heading has-text-centered">
                            Updates
                        </p>
                        <Updates data={this.state.data}/>
                    </nav>
                </div>
            )
        }
    }
}

export default Sidebar;