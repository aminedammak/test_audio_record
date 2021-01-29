import React, { useEffect } from "react";
import axios from "axios";

export default function RecordVoice() {
  const recording = () => {
    let constraintObj = {
      audio: true,
      video: false,
    };

    //handle older browsers that might implement getUserMedia in some way
    if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {};
      navigator.mediaDevices.getUserMedia = function (constraintObj) {
        let getUserMedia =
          navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        if (!getUserMedia) {
          return Promise.reject(
            new Error("getUserMedia is not implemented in this browser")
          );
        }
        return new Promise(function (resolve, reject) {
          getUserMedia.call(navigator, constraintObj, resolve, reject);
        });
      };
    } else {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          devices.forEach((device) => {
            console.log(device.kind.toUpperCase(), device.label);
            //, device.deviceId
          });
        })
        .catch((err) => {
          console.log(err.name, err.message);
        });
    }

    navigator.mediaDevices
      .getUserMedia(constraintObj)
      .then(function (mediaStreamObj) {
        //connect the media stream to the audio element

        //add listeners for saving video/audio
        let start = document.getElementById("btnStart");
        let stop = document.getElementById("btnStop");
        let audioSave = document.getElementById("saved-audio");
        let mediaRecorder = new MediaRecorder(mediaStreamObj);
        let chunks = [];

        start.addEventListener("click", (ev) => {
          mediaRecorder.start();
          console.log(mediaRecorder.state);

          //tesssssssssssssssssssssssssssssssssst

          //   var myBlob = new Blob(["This is my blob content"], {
          //     type: "text/plain",
          //   });
          //   console.log(myBlob);

          //   var fd = new FormData();
          //   fd.append("upl", myBlob, "blobby.txt");

          //   fetch("http://localhost:4000/record", {
          //     method: "post",
          //     body: fd,
          //   });
        });
        stop.addEventListener("click", (ev) => {
          mediaRecorder.stop();
          console.log(mediaRecorder.state);
        });
        mediaRecorder.ondataavailable = function (ev) {
          //Store the recorded voice in chunks array
          chunks.push(ev.data);
        };
        mediaRecorder.onstop = async (ev) => {
          let blob = new Blob(chunks, { type: "audio/wav;" });
          console.log("record blob", blob);

          //Clear the previous recorded voice (needed when repeating recording)
          chunks = [];
          let videoURL = window.URL.createObjectURL(blob);
          audioSave.src = videoURL;

          let formdata = new FormData(); //create a from to of data to upload to the server
          formdata.append("soundBlob", blob, "myfiletosave.wav");

          var textBlob = new Blob(["This is my blob content"], {
            type: "text/plain",
          });

          formdata.append("textfile", textBlob);
          axios("http://localhost:4000/record", {
            method: "post",
            data: formdata,

            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        };
      })
      .catch(function (err) {
        console.log(err.name, err.message);
      });

    /*********************************
			getUserMedia returns a Promise
			resolve - returns a MediaStream Object
			reject returns one of the following errors
			AbortError - generic unknown cause
			NotAllowedError (SecurityError) - user rejected permissions
			NotFoundError - missing media track
			NotReadableError - user permissions given but hardware/OS error
			OverconstrainedError - constraint video settings preventing
			TypeError - audio: false, video: false
			*********************************/
  };

  useEffect(() => {
    recording();
  }, []);
  return (
    <div>
      <p>
        <button id="btnStart">START RECORDING</button>
        <br />
        <button id="btnStop">STOP RECORDING</button>
      </p>
      <audio id="saved-audio" controls>
        Your browser does not support the
        <code>audio</code> element.
      </audio>
    </div>
  );
}
