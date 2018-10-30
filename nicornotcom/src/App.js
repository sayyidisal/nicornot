import React, { Component } from 'react'
import logo from './NicOrNot.png'
import nicPic from './nicsource.jpeg'
import './App.css'
import * as faceapi from 'face-api.js'

import Dropzone from 'react-dropzone'

class App extends Component {
  state = {
    classification: 'Loading',
    currentImage: null,
    faces: [],
    files: [],
    thing: logo
  }

  checkFaces = async () => {
    // const nic = await faceapi.fetchImage('https://i.imgur.com/ASvFZxs.jpg')
    const nic = await faceapi.fetchImage('https://i.imgur.com/GzBMITw.jpg')
    // const nicDescript = await faceapi.computeFaceDescriptor(nic)
    // NOT EXPOSED
    // const nicDescript = await faceapi.detectAllFaces(nic, faceDetector)
    const nicDescript = await faceapi.allFacesSsdMobilenetv1(nic)
        // .withFaceLandmarks()
        // .withFaceDescriptors()[0]
    console.log('nicDescript', nicDescript)
    // const otherURL = 'https://i.imgur.com/fUm1zSu.jpg' // not
    // const otherURL = 'https://i.imgur.com/fV7Sm6s.jpg' // nic
    const otherURL = this.state.thing

    const other = await faceapi.fetchImage(otherURL)
    // const otherDescript = await faceapi.detectAll
    const otherDescript = await faceapi.allFacesSsdMobilenetv1(other)
    console.log('otherDescript', otherDescript)

    const distance = faceapi.round(
      faceapi.euclideanDistance(nicDescript[0].descriptor, otherDescript[0].descriptor)
    )

    this.setState({
      classification: distance
    })
  }

  async componentDidMount() {
    await faceapi.loadFaceRecognitionModel('/face_model')
    await faceapi.loadSsdMobilenetv1Model('/face_model')
    await faceapi.loadFaceLandmarkModel('/face_model')
    this.setState({
      classification: 'done loading model'
    })
  }

  onDrop = (accepted, rejected) => {
    if (rejected.length > 0) window.alert('JPG or PNG only plz')
    this.setState({ files: accepted })
    this.checkFaces()
  }

  render() {
    this.state.files.map(f => {
      const reader = new FileReader()
      reader.onload = e => {
        this.setState({ thing: e.target.result })
      }

      reader.readAsDataURL(f)
    })
    return (
      <div className="App">
        <p id="opener">
          Identify if a person <em>is</em> or <em>is NOT</em> Nicolas Cage with
          ease.
        </p>
        <header className="App-header">
          <Dropzone
            accept="image/jpeg, image/png"
            className="photo-box"
            onDrop={this.onDrop.bind(this)}
          >
            <img src={this.state.thing} className="dropped-photo" />
            <p>Drop your file here or click to browse.</p>
          </Dropzone>
        </header>
        <div>
          <p>
            {Number(this.state.classification) < 0.5
              ? 'Nic Detected ' + this.state.classification
              : 'No Nic Detected' + this.state.classification}
          </p>
          <h2>Also: Available in Mobile App</h2>
          <img src="nic_clip.gif" />
          <p>
            This is useful when{' '}
            <a
              href="http://declarationofindependencethief.com/"
              target="_blank"
            >
              someone steals the Declaration of Independence
            </a>
            , or if you're just looking to{' '}
            <a
              href="https://shift.infinite.red/cage-against-the-machine-a419b6980424"
              target="_blank"
            >
              learn more about facial recognition
            </a>
            . If either of those are your need, then this is the app for you!{' '}
            <a
              href="https://itunes.apple.com/us/app/nic-or-not/id1437819644?ls=1&mt=8"
              target="_blank"
            >
              This App is <strong>currently available on iOS App Store</strong>
            </a>
            .
          </p>
          <img src="app.png" className="appStore" alt="app store image" />
        </div>
        <footer id="footer">
          <ul>
            <li>Copyright Now(ish)</li>
            <li>
              <a href="http://declarationofindependencethief.com/">
                Declaration of Independence Thief Site
              </a>
            </li>
            <li>
              <a href="https://github.com/gantman/nicornot">GitHub Repo</a>
            </li>
            <li>
              <a href="https://shift.infinite.red/cage-against-the-machine-a419b6980424">
                Blog Post
              </a>
            </li>
            <li>
              <a href="https://slides.com/gantlaborde/cage#/">Slides</a>
            </li>
          </ul>
        </footer>
      </div>
    )
  }
}

export default App
