import debounce from "lodash.debounce";
import ReactQuill from "react-quill";
import handleVoiceCommand from "./voiceCommands";

const punctuationMappings: { [key: string]: string } = {
  запетая: ",",
  точка: ".",
  въпросителен: "?",
  удивителен: "!",
  двуеточие: ":",
  точка_и_запетая: ";",
  тире: "-",
  скоби: "()",
  кавички: '"',
  апостроф: "'",
};

let recognitionStarted = false;
let lastRestartAttempt = 0;
const RESTART_DELAY = 1000;
const DEBOUNCE_DELAY = 500;

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
    let interimTranscript = "";
    let finalTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    // Process only final results
    if (finalTranscript) {
      handleSpeechRecognition(finalTranscript.trim());
    }
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);

    recognition.stop();
    recognitionStarted = false;

    const now = Date.now();
    if (now - lastRestartAttempt > RESTART_DELAY) {
      setTimeout(() => {
        restartRecognition();
      }, RESTART_DELAY);
      lastRestartAttempt = now;
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

  // Replace verbal commands with punctuation marks
  const punctuationRegex = new RegExp(
    Object.keys(punctuationMappings).join("|"),
    "gi"
  );

  let cleanedTranscript = trimmedTranscript.replace(
    punctuationRegex,
    (matched) => punctuationMappings[matched.toLowerCase()]
  );

  cleanedTranscript = cleanedTranscript
    .replace(/\s*([,.!?;:])\s*/g, "$1 ") // Ensure one space after punctuation
    .replace(/\s{2,}/g, " ") // Replace multiple spaces with a single space
    .replace(/([,.!?;:])(?=[^\s])/g, "$1 ") // Add space if missing after punctuation
    .trim();

  cleanedTranscript = cleanedTranscript.replace(
    /(^|\.\s+)([a-z])/g,
    (match, p1, p2) => p1 + p2.toUpperCase()
  );

  const words = cleanedTranscript.split(" ");
  const lastWord = words[words.length - 1].toLowerCase();

  if (lastWord === "джесика") {
    setIsCommandMode(!isCommandMode);
    return;
  }

  if (isCommandMode) {
    handleVoiceCommand(trimmedTranscript, setData, editorRef);
  } else {
    const editor = editorRef.current?.getEditor();
    if (!editor) return;

    cleanedTranscript = ` ${cleanedTranscript}`;

    setData((prevData) => {
      const newText = prevData.trim() + cleanedTranscript;
      const sanitizedText = sanitizeText(newText);
      editor.setText(sanitizedText);

      // Move the cursor to the end
      const length = editor.getLength(); // Get length of the current text
      editor.setSelection(length, length); // Move the cursor to the end

      return sanitizedText;
    });
  }
};

const debouncedProcessTranscript = debounce(
  (transcript, setData, isCommandMode, setIsCommandMode, editorRef) => {
    processTranscript(
      transcript,
      setData,
      isCommandMode,
      setIsCommandMode,
      editorRef
    );
  },
  DEBOUNCE_DELAY
);

const startListening = (recognition: SpeechRecognition) => {
  try {
    recognition.start();
    recognitionStarted = true;
  } catch (e) {
    console.error("Failed to start recognition:", e.message);
  }
};

const stopListening = (recognition: SpeechRecognition) => {
  try {
    recognition.stop();
    recognitionStarted = false;
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
