import "./App.css";
import image from "./2";
import { useState, useEffect } from "react";
import ImageContainer from "./Image.js";
import firebase from "firebase";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
};
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();
var id = "";

db.collection("sessions_start")
  .add({
    image: "1",
    time: Date.now(),
  })
  .then((docRef) => {
    id = docRef.id;
  })
  .catch((error) => {
    console.error("Error adding document: ", error);
  });

function Clock() {
  let [date, setDate] = useState(Date.now());
  let [seconds, setSeconds] = useState(0);
  let [minutes, setMinutes] = useState(0);


  function tick() {
    let DateNow = Date.now();
    setSeconds(seconds => (Math.floor((DateNow - date)/1000))%60)
    setMinutes(minutes => (Math.floor((DateNow - date)/60000)))
  }

  useEffect(() => {
    const tickInterval = setInterval(tick, 1000);
    return () => clearInterval(tickInterval)
  }, []);

  return (
    <div className="Clock">
      {minutes.toLocaleString('en-US',{ minimumIntegerDigits: 2 })}:
      {seconds.toLocaleString('en-US',{ minimumIntegerDigits: 2 })}
    </div>
  );
}

function Navbar() {
  return (
    <div className="navbar">
      <h1>findWally v1.0</h1>
      <Clock />
    </div>
  );
}

function App() {

  let [NameEntryVisibility, SetNameEntryVisibility] = useState('hidden')
  let [HighScoresVisibility, SetHighScoresVisibility] = useState('hidden')
  let [PlayerName, setPlayerName] = useState('')
  let [time, setTime] = useState(0);
 
  function answerTime() {
    db.collection("sessions_end")
      .doc(id)
      .set({
        image: "1",
        time: Date.now(),
      })
      .then(timeTaken());
  }

  function appendScore(username, usertime){
    db.collection("highscores")
      .doc(id)
      .set({
        name: username,
        time: usertime
      })
      .then(SetHighScoresVisibility('visible'))
  }

  async function timeTaken() {
    var startDoc = db.collection("sessions_start").doc(id);
    var endDoc = db.collection("sessions_end").doc(id);
    var startTime;
    var endTime;
    await startDoc
      .get()
      .then((doc) => {
        if (doc.exists) {
          startTime = doc.data().time;
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
    await endDoc
      .get()
      .then((doc) => {
        if (doc.exists) {
          endTime = doc.data().time;
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
    setTime(Math.round((endTime - startTime) / 1000));
    SetNameEntryVisibility('visible')
  }


  
  return (
    <div className="App">
      <Navbar />
      <ImageContainer
        img={image}
        truth={{ coords: [96 / 902, 458 / 507], char: "Waldo" }}
        logEnd={answerTime}
      />
      <NameEntry appendScore = {appendScore} time = {time} visibility = {NameEntryVisibility} setPlayerName = {setPlayerName} setVisibility = {SetNameEntryVisibility}/>
      <HighScores visibility = {HighScoresVisibility}/>
    </div>
  );
}

function NameEntry(props) {
  let [InputValue, setInputValue] = useState('')

  function handleInputChange(e){
    let newInput = e.target.value;
    setInputValue(newInput);
  }

  function handleNameSubmit(event){
    event.preventDefault();
    props.setPlayerName(InputValue)
    props.appendScore(InputValue, props.time)
    props.setVisibility('hidden')

  }
  return (
    <div className = {props.visibility ==='visible'?'NameEntry visibile':'NameEntry hidden'}>
      Enter Your Name<br></br>(5 Chars Max)
      <input type = 'text' value = {InputValue} maxLength = {5} onChange = {handleInputChange}></input>
      <button onClick = {handleNameSubmit}> Submit</button>
    </div>
  )
}

function HighScores(props){

  function compare(a , b){
    if(a.time < b.time) {return -1;}
    if(a.time > b.time){return 1;}
    return 0;
  }

  let [highScoreData, setHighScoreData] = useState([])

  useEffect(()=> {
    let highScores;
    db.collection('highscores')
                      .get()
                      .then(querySnapshot => {
                        highScores = querySnapshot.docs.map(doc => doc.data())
                        let scores = highScores;
                        scores.sort(compare);
                        setHighScoreData(scores);
                      })
    
    
  })

  function timeString(time) {
    let minutes  = (Math.floor(time/60)).toLocaleString('en-US', {minimumIntegerDigits: 2});
    let seconds  = (time%60).toLocaleString('en-US', {minimumIntegerDigits : 2});
    return (minutes + ':' + seconds)
  }

  return(
    <div className = {props.visibility === 'visible'?'highscores visible':'highscores hidden'}>
      <div className = 'title'>High Scores</div>
      <ul>
      {highScoreData.map(element => <li>{element.name}<span>{timeString(element.time)}</span></li>)}
      </ul>
    </div>
  )
}

export default App;
