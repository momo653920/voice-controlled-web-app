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
let processing = false;

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
  if (processing) return;
  processing = true;

  const trimmedTranscript = sanitizeText(transcript.trim());

  if (trimmedTranscript === lastProcessedTranscript) {
    processing = false;
    return;
  }

  lastProcessedTranscript = trimmedTranscript;

  const punctuationRegex = new RegExp(
    Object.keys(punctuationMappings).join("|"),
    "gi"
  );

  let cleanedTranscript = trimmedTranscript.replace(
    punctuationRegex,
    (matched) => punctuationMappings[matched.toLowerCase()]
  );
  cleanedTranscript = cleanedTranscript
    .replace(/([,.!?;:])\s*/g, "$1 ")
    .replace(/\s{2,}/g, " ");

  cleanedTranscript = cleanedTranscript.replace(
    /(^|\.\s+)([a-z])/g,
    (match, p1, p2) => p1 + p2.toUpperCase()
  );

  const words = cleanedTranscript.split(" ");
  const lastWord = words[words.length - 1].toLowerCase();

  if (lastWord === "джесика") {
    setIsCommandMode(!isCommandMode);
    processing = false;
    return;
  }

  if (isCommandMode) {
    handleVoiceCommand(trimmedTranscript, setData, editorRef);
    processing = false;
    return;
  } else {
    const editor = editorRef.current?.getEditor();
    if (!editor) {
      processing = false;
      return;
    }

    const currentText = editor.getText().trim();
    const lastCharacter = currentText.charAt(currentText.length - 1);

    if (currentText && !/[.!?]\s*$/.test(currentText)) {
      cleanedTranscript = ` ${cleanedTranscript}`;
    }

    setData((prevData) => {
      const newText = prevData.trim() + cleanedTranscript;
      if (sanitizeText(newText).endsWith(sanitizeText(cleanedTranscript))) {
        processing = false;
        return sanitizeText(newText);
      }
      processing = false;
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
