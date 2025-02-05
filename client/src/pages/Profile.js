import React, { Component } from "react";
import EventLocation from '../events'
import axios from "axios";

import './style.css'

export default class Profile extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      user_ID: "",
      points:"",
      fileInputState: "",
      titleInputState: "",
      descriptionState: "",
      previewSource: "",
      selectedFile: "",
      latitude: "",
      longitude: "",
      eventlatitude:"",
      eventlongitude:"",
    }
  }

  getLoginStatus() {
    axios
      .get("http://localhost:3001/api/users/login", { withCredentials: true })
      .then(response => {
        this.setState({
          user_ID: response.data.user._id,
          username: response.data.user.username,
          points: response.data.user.points,
        })
      })
      .catch(error => {
        console.log("check login error", error);
      });
  }

  getEventLocation(){
    var d = new Date();
    var n = d.getDay() - 1;
    this.setState({
      eventlatitude: EventLocation[n].lat,
      eventlongitude: EventLocation[n].lon,
    })
  }

  componentDidMount() {
    this.getLoginStatus();
    if (navigator.geolocation) {
      console.log("Avaliable")
      navigator.geolocation.getCurrentPosition(position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      })
    } else {
      console.log("Not Avaliable")
    }
    this.getEventLocation();
  }

  render() {
    if (this.props.loggedInStatus === "LOGGED_IN") {
      const state = {
        button: 1
      };

      const handleFileInputChange = async (e) => {
        const file = e.target.files[0]
        previewFile(file)
      }

      const handleTitleInputChange = (e) => {
        this.setState({
          titleInputState: e.target.value
        })
      }

      const handleDesInputChange = (e) => {
        this.setState({
          descriptionState: e.target.value
        })
      }

      const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onload = () => {
          this.setState({
            previewSource: reader.result
          })
          // console.log(this.state.previewSource)
        }
      }

      const handleSubmitFile = (e) => {
        e.preventDefault();
        if (!this.state.previewSource) return;
        if (state.button === 1) {
          uploadImage(this.state.previewSource);
          this.setState({
            titleInputState: "",
            descriptionState: "",
            previewSource: "",
          })
        } else if (state.button === 2){
          uploadEventImage(this.state.previewSource)
          this.setState({
            titleInputState: "",
            descriptionState: "",
            previewSource: "",
          })
        }
      }

      const uploadEventImage = async (base64EncodedImage) => {
        // console.log(base64EncodedImage)
        // console.log(JSON.stringify({ Image64: base64EncodedImage }))
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, 0);
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = String(today.getFullYear());
        var nowtoday = mm + dd + yyyy;
        try {
          await axios.post('http://localhost:3001/api/events',
            {
              userId: this.state.user_ID,
              userName: this.state.username,
              title: this.state.titleInputState,
              description: this.state.descriptionState,
              Image64: base64EncodedImage,
              likes: 0,
              postdate: nowtoday,
            },
            { withCredentials: true })
            .then(response => {
              console.log("upload event image")
            })
        } catch (error) {
          console.log("error", error)
        }
      }

      const uploadImage = async (base64EncodedImage) => {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, 0);
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = String(today.getFullYear());
        var nowtoday = mm + dd + yyyy;
        try {
          await axios.post('http://localhost:3001/api/posts',
            {
              userId: this.state.user_ID,
              userName: this.state.username,
              title: this.state.titleInputState,
              description: this.state.descriptionState,
              Image64: base64EncodedImage,
              likes: 0,
              postdate: nowtoday,
            },
            { withCredentials: true })
            .then(response => {
              console.log("upload image")
            })
        } catch (error) {
          console.log("error", error)
        }
      }

      const checkForEvent = () => {
        if (this.state.latitude === "" && this.state.longitude === "") {
          return false
        } else {
          const R = 6371e3;
          const φ1 = this.state.latitude * Math.PI/180;
          const φ2 = this.state.eventlatitude * Math.PI/180;
          const Δφ = (this.state.eventlatitude-this.state.latitude) * Math.PI/180;
          const Δλ = (this.state.eventlongitude-this.state.longitude) * Math.PI/180;
          const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                    Math.cos(φ1) * Math.cos(φ2) *
                    Math.sin(Δλ/2) * Math.sin(Δλ/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          const d = R * c *  0.00062137; // distance between user location and event location
          // 5 miles, range of event, put large number for testing
          if (d < 5) {
            return true
          } else {
            return false
          }
        }
      }

      return (
        <div>
          <div className='imageSubmit'>
          <h1 className='stateUserName'>Welcome: {this.state.username}</h1>
            <div className='imageSubmitGrid'>
              <div>
                {/* <h2>Status: {this.props.loggedInStatus}</h2> */}
                {console.log(this.state)}
                <form className='pictureSubmitForm' onSubmit={handleSubmitFile}>
                  <input type="file" name="image" onChange={handleFileInputChange} />
                  <label className='labels' htmlFor="password">Title</label>
                  <input type="text" name="title" value={this.state.titleInputState} onChange={handleTitleInputChange} />
                  <label className='labels' htmlFor="password">Description</label>
                  <input type="text" name="description" value={this.state.descriptionState} onChange={handleDesInputChange} />
                  <div className='buttonGrid'>
                    <button type="submit" className="btn btn-primary" onClick={() => (state.button = 1)}>Submit</button>
                    {checkForEvent() ? <button type="submit" className="btn btn-primary" onClick={() => (state.button = 2)}>Submit Event</button> : console.log("not in event")}
                  </div>
                  </form>
                <div className='pointsTotal'>
                  <h3>Total Points</h3>
                  <p className='points'>{this.state.points}</p>
                </div>
                <br />
              </div>
              <div>
              {this.state.previewSource && (
                <img className='imagePreview' src={this.state.previewSource} alt="chose" style={{ height: '250px' }} />
              )}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <h1>*Please Login</h1>
        </div>
      )
    }
  }
}
