import './App.css';
import image from './2'
import {useState, useEffect} from 'react'

let waldoCoords = {coords: [117, 608], reference: [1221, 687]}

function FoundWho(props) {

  function selection(char, event) {
    props.guess(char)
    props.setShow(false)
    props.choose(true)
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

  let [guessChar, setguessChar] = useState('')
  let [containerWidth, setContainerWidth] = useState([0,0])
  let [clickCoords,setClickCoords] = useState([0,0])
  let [clickCoordsOffset,setClickCoordsOffset] = useState([0,0])
  let [show, setShow] = useState(false)
  let [choose, setChoose] = useState(true)

  async function handleClick(event) {
    if(choose){
    await setClickCoordsOffset([event.pageX - event.target.offsetLeft, event.pageY - event.target.offsetTop]);
    setguessChar('')
    setChoose(false)
     } await setClickCoords([event.pageX , event.pageY]);
    let containerWidth = event.target.clientWidth;
    let containerHeight = event.target.clientHeight;
    await setContainerWidth([containerWidth, containerHeight])
    setShow(!show)
  }
  useEffect(() =>
   {
    let dist = Math.hypot((clickCoordsOffset[0]/containerWidth[0]- waldoCoords.coords[0]/waldoCoords.reference[0]), (clickCoordsOffset[1]/containerWidth[1]- waldoCoords.coords[1]/waldoCoords.reference[1]))
    if (dist< 0.025 && guessChar == 'Waldo') {console.log('Got Waldo!')} 
  }
  , clickCoordsOffset, containerWidth, guessChar);
  
  return(
    <div className = 'imageContainerContainer'>
     <div className = 'imageContainer' onClick = {handleClick}>
       <img src = {props.img} ></img>
     </div>
     <FoundWho coords = {clickCoords} show = {show} setShow = {setShow} guess = {setguessChar} choose = {setChoose}></FoundWho>
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
