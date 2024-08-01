import debounce from "lodash.debounce";
import handleVoiceCommand from "./voiceCommands";
import punctuationMappings from "./punctuationMappings.json";
import ReactQuill from "react-quill";

const getPunctuation = (word: string) => {
  return punctuationMappings[word.toLowerCase()] || word;
};

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
  recognition.lang = "en-US";

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let interimTranscript = "";
    let finalTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    if (finalTranscript) {
      handleSpeechRecognition(finalTranscript.trim());
    } else if (interimTranscript) {
      handleSpeechRecognition(interimTranscript.trim());
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

let lastProcessedTranscript = "";
const DEBOUNCE_DELAY = 500;

const sanitizeText = (text: string): string => {
  return text.replace(/<[^>]*>/g, "").trim();
};

const processTranscript = (
  transcript: string,
  setData: (data: string) => void,
  isCommandMode: boolean,
  setIsCommandMode: (mode: boolean) => void,
  editorRef: React.RefObject<ReactQuill>
) => {
  const trimmedTranscript = sanitizeText(transcript.trim());

  if (trimmedTranscript === lastProcessedTranscript) return;
  lastProcessedTranscript = trimmedTranscript;

  const punctuationMappings: { [key: string]: string } = {
    comma: ",",
    period: ".",
    question: "?",
    exclamation: "!",
    colon: ":",
    semicolon: ";",
    dash: "-",
    parenthesis: "()",
    quote: '"',
    apostrophe: "'",
  };

  const punctuationRegex = new RegExp(
    Object.keys(punctuationMappings).join("|"),
    "gi"
  );

  const cleanedTranscript = trimmedTranscript.replace(
    punctuationRegex,
    (matched) => punctuationMappings[matched.toLowerCase()]
  );

  const words = cleanedTranscript.split(" ");
  const lastWord = words[words.length - 1].toLowerCase();

  if (lastWord === "jessica") {
    setIsCommandMode(!isCommandMode);
    return;
  }

  if (lastWord === "text mode" && isCommandMode) {
    setIsCommandMode(false);
    return;
  }

  if (isCommandMode) {
    handleVoiceCommand(trimmedTranscript, setData, editorRef);
    return;
  } else {
    let updatedText = cleanedTranscript
      .replace(/\s*([,.!?])/g, "$1")
      .replace(/(?:^|\.\s+)([a-z])/g, (match) => match.toUpperCase());

    const editor = editorRef.current?.getEditor();
    if (!editor) return;

    const currentText = editor.getText().trim();
    const lastCharacter = currentText.charAt(currentText.length - 1);

    if (lastCharacter && !/[.!?]$/.test(lastCharacter)) {
      updatedText = ` ${updatedText}`;
    }

    setData((prevData) => {
      const newText = prevData.trim()
        ? `${prevData}${updatedText}`
        : updatedText;
      editor.setText(sanitizeText(newText));
      return sanitizeText(newText);
    });
  }
};

const debouncedProcessTranscript = debounce(processTranscript, DEBOUNCE_DELAY);

const startListening = (recognition: SpeechRecognition) => {
  try {
    recognition.start();
  } catch (e) {
    console.error("Failed to start recognition:", e.message);
  }
};

const stopListening = (recognition: SpeechRecognition) => {
  try {
    recognition.stop();
  } catch (e) {
    console.error("Failed to stop recognition:", e.message);
  }
};

export {
  initSpeechRecognition,
  startListening,
  stopListening,
  debouncedProcessTranscript,
};
