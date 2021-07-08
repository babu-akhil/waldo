import { useEffect, useState } from "react";

function FoundWho(props) {
  function selection(char, event) {
    console.log(props.coords, props.containerDims);
    props.checkAnswer({
      coords: [
        props.coords[0] / props.containerDims[0],
        props.coords[1] / props.containerDims[1],
      ],
      char: char,
    });
    props.setShow(false);
  }

  return (
    <div
      className="foundWho"
      style={{
        position: "absolute",
        top: props.boxCoords[1] + "px",
        left: props.boxCoords[0] + "px",
        visibility: props.show ? "visible" : "hidden",
      }}
    >
      <ul>
        <li
          onClick={(event) => {
            selection("Waldo", event);
          }}
        >
          Waldo
        </li>
        <li
          onClick={(event) => {
            selection("Wizard", event);
          }}
        >
          Wizard
        </li>
        <li
          onClick={(event) => {
            selection("Oddball", event);
          }}
        >
          Oddball
        </li>
      </ul>
    </div>
  );
}

function ImageContainer(props) {
  let [clickCoords, setClickCoords] = useState([0, 0]);
  let [boxCoords, setBoxCoords] = useState([0, 0]);
  let [show, setShow] = useState(false);
  let [containerDims, setContainerDims] = useState([0, 0]);
  let [PopupMessage, setPopupMessage] = useState("");
  let [PopupVisibility, setPopupVisibility] = useState("hidden");

  function handleClick(event) {
    setShow(!show);
    setClickCoords([
      event.pageX - event.target.offsetLeft,
      event.pageY - event.target.offsetTop,
    ]);
    setBoxCoords([event.pageX, event.pageY]);
    setContainerDims([event.target.clientWidth, event.target.clientHeight]);
  }

  function checkAnswer(answer) {
    console.log(
      Math.hypot(
        answer.coords[0] - props.truth.coords[0],
        answer.coords[1] - props.truth.coords[1]
      )
    );
    if (answer.char == props.truth.char) {
      if (
        Math.hypot(
          answer.coords[0] - props.truth.coords[0],
          answer.coords[1] - props.truth.coords[1]
        ) < 0.04
      ) {
        setPopupMessage("You found Waldo!");
        setPopupVisibility("visible");
        setTimeout(() => {
          setPopupVisibility("hidden");
          console.log("ay!");
        }, 3000);
        props.logEnd();
      } else {
        setPopupMessage("Waldo's not there");
        setPopupVisibility("visible");
        setTimeout(() => {
          setPopupVisibility("hidden");
        }, 3000);
      }
    }
  }

  return (
    <div className="imageContainerContainer">
      <div className="imageContainer" onClick={handleClick}>
        <img src={props.img}></img>
        <Popup visibility={PopupVisibility} message={PopupMessage} />
      </div>
      <FoundWho
        coords={clickCoords}
        boxCoords={boxCoords}
        show={show}
        setShow={setShow}
        containerDims={containerDims}
        checkAnswer={checkAnswer}
      ></FoundWho>
    </div>
  );
}

function Popup(props) {
  return (
    <div
      className={
        props.visibility === "visible" ? "popup visible" : "popup hidden"
      }
      style={{
        backgroundColor: props.message === "You found Waldo!" ? "green" : "red",
      }}
    >
      {props.message}
    </div>
  );
}

export default ImageContainer;
