import debounce from "lodash.debounce";
import { NavigateFunction } from "react-router-dom";
import { navigationCommands } from "./navigationCommands";
let recognitionStarted = false;
let lastRestartAttempt = 0;
const RESTART_DELAY = 1000;
const initSpeechRecognition = (
  handleSpeechRecognition: (transcript: string) => void
) => {
  const SpeechRecognition =
    window.SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognition) {
    throw new Error("SpeechRecognition is not supported in this browser.");
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "bg-BG";

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let finalTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      }
    }

    if (finalTranscript) {
      handleSpeechRecognition(finalTranscript.trim());
    }
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);

    if (event.error === "aborted") {
      restartRecognition();
    } else {
      recognition.stop();
      recognitionStarted = false;
      const now = Date.now();
      if (now - lastRestartAttempt > RESTART_DELAY) {
        setTimeout(() => {
          restartRecognition();
        }, RESTART_DELAY);
        lastRestartAttempt = now;
      }
    }
  };

  recognition.onend = () => {
    if (recognitionStarted) {
      restartRecognition();
    }
  };

  const restartRecognition = () => {
    try {
      if (!recognitionStarted) {
        recognition.start();
        recognitionStarted = true;
      }
    } catch (e) {
      console.error("Failed to restart recognition:", e.message);
    }
  };
  return recognition;
};

export const debouncedProcessTranscript = debounce(
  async (
    transcript: string,
    navigate: NavigateFunction,
    setIsCreateFileModalOpen: (open: boolean) => void,
    setIsCreateFolderModalOpen: (open: boolean) => void,
    setIsTrialCreateFileModalOpen: (open: boolean) => void,
    isTrial: boolean,
    userId: string
  ) => {
    await navigationCommands(
      transcript,
      navigate,
      setIsCreateFileModalOpen,
      setIsCreateFolderModalOpen,
      setIsTrialCreateFileModalOpen,
      isTrial,
      userId
    );
  },
  300
);

export { initSpeechRecognition };
