import ReactQuill from "react-quill";

const handleVoiceCommand = (
  command: string,
  setData: (data: string) => void,
  editorRef: React.RefObject<ReactQuill>
) => {
  const editor = editorRef.current?.getEditor();
  if (!editor) return;

  const selection = editor.getSelection();
  const selectedText = editor.getText(selection.index, selection.length);

  if (command.includes("назад")) {
    window.history.back();
    return;
  }

  if (command.includes("маркирай последното изречение")) {
    const text = editor.getText();
    const lastSentenceStart = text.lastIndexOf(".", text.length - 2) + 1;
    const lastSentenceEnd = text.length - 1;
    editor.setSelection(lastSentenceStart, lastSentenceEnd - lastSentenceStart);
    return;
  }
  if (command.includes("маркирай последната дума")) {
    const text = editor.getText();
    const lastSentenceStart = text.lastIndexOf(" ", text.length - 2) + 1;
    const lastSentenceEnd = text.length - 1;
    editor.setSelection(lastSentenceStart, lastSentenceEnd - lastSentenceStart);
    return;
  }
  if (command.includes("удебели")) {
    if (selectedText) {
      editor.format("bold", true, "user");
    }
    return;
  }

  if (command.includes("курсив")) {
    if (selectedText) {
      editor.format("italic", true, "user");
    }
    return;
  }

  if (command.includes("изтрий")) {
    if (selectedText) {
      editor.deleteText(selection.index, selection.length);
    } else {
      const currentText = editor.getText();
      const lastWordStart = currentText.lastIndexOf(" ") + 1;
      const newText = currentText.slice(0, lastWordStart).trim();
      setData(newText);
      editor.setText(newText);
    }
    return;
  }
};

export default handleVoiceCommand;
