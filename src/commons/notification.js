import Noty from "noty";
import "noty/lib/noty.css";
import "noty/lib/themes/bootstrap-v4.css";
import "../assets/css/animate.css";

import infoMIDI from '../assets/sounds/infoMIDI.wav';
import warningMIDI from '../assets/sounds/alertMIDI.mp3';
import errorMIDI from '../assets/sounds/errorMIDI.wav';

const notifConfig = {
  layout: "topRight",
  theme: "bootstrap-v4",
  timeout: 3000,
  closeWith: ["click", "timeout"],
  animation: {
    open: "animated bounceInRight",
    close: "animated bounceOutRight",
    easing: "swing",
    speed: 500,
  },
};

const MIDI = (type) => {
  const midiConfig = {
    success: infoMIDI,
    warning: warningMIDI,
    info   : infoMIDI,
    error  : errorMIDI,
  }

  let midi = new Audio(midiConfig[type]);
  midi.play();
}

class PushAlert {
  static play = {
    sound: {
      success() { MIDI('success') },
      warning() { MIDI('warning') },
      info() { MIDI('info') },
      error() { MIDI('error') },
    }
  }

  static success(text, isMuted = false) {
    new Noty({
      type: "success",
      text,
      ...notifConfig,
    }).show();
    !isMuted && PushAlert.play.sound.success();
  }

  static warning(text, isMuted = false) {
    new Noty({
      type: "warning",
      text,
      ...notifConfig,
    }).show();
    !isMuted && PushAlert.play.sound.warning();
  }

  static error(text, isMuted = false) {
    new Noty({
      type: "error",
      text,
      ...notifConfig,
    }).show();
    !isMuted && PushAlert.play.sound.error();
  }

  static info(text, isMuted = false) {
    new Noty({
      type: "info",
      text,
      ...notifConfig,
    }).show();
    !isMuted && PushAlert.play.sound.info();
  }
}

export default PushAlert;
