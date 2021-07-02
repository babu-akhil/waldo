import './App.css';
import image from './2'
import {useState, useEffect} from 'react'

let truth = {coords: [284/1221, 767/687], char: 'Waldo'}

function FoundWho(props) {


  function selection(char, event) {
    props.checkAnswer({coords:[props.coords[0]/props.containerDims[0],props.coords[1]/props.containerDims[1]], char: char})
    props.setShow(false)
  }

  return(
    <div className = 'foundWho' style = {{position:'absolute', top: props.coords[1] + 'px', left: props.coords[0] + 'px', visibility: props.show?'visible':'hidden'}}>
      <ul>
        <li onClick = {(event) => {selection('Waldo', event)}}>
          Waldo
        </li>
        <li onClick = {(event) => {selection('Wizard', event)}}>
          Wizard
        </li>
        <li onClick = {(event) => {selection('Oddball', event)}}>
          Oddball
        </li>
      </ul>
    </div>
  )
}


function ImageContainer(props){

  let [clickCoords, setClickCoords] = useState([0,0])
  let [show, setShow] = useState(false)
  let [containerDims, setContainerDims] = useState([0,0])

  function handleClick(event) {
    setShow(!show)
    setClickCoords([event.pageX, event.pageY])
    setContainerDims([event.target.clientWidth, event.target.clientHeight])
  }

  function checkAnswer(answer) {
    if(answer.char == truth.char) {
       if(Math.hypot(answer.coords[0] - truth.coords[0], answer.coords[1] - truth.coords[1]) < 0.04){
          console.log('You got Waldo!')
       }
    }
  }

  return(
    <div className = 'imageContainerContainer'>
     <div className = 'imageContainer' onClick = {handleClick}>
       <img src = {props.img}></img>
     </div>
     <FoundWho coords = {clickCoords} show = {show} setShow = {setShow} containerDims = {containerDims} checkAnswer = {checkAnswer}></FoundWho>
    </div>
  )
}


function Navbar(){
  return(
    <div className = 'navbar'>
      <h1>findWally v1.0</h1>
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <Navbar/>
      <ImageContainer img = {image}/>
    </div>
  );
}

export default App;
