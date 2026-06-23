// Browser SpeechRecognition + SpeechSynthesis helpers.

type AnyWindow = Window & { SpeechRecognition?: any; webkitSpeechRecognition?: any };

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  const w = window as AnyWindow;
  return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
}

export function createRecognizer(onResult: (text: string) => void, onEnd: () => void) {
  const w = window as AnyWindow;
  const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
  if (!Ctor) return null;
  const recog = new Ctor();
  recog.lang = "en-US";
  recog.interimResults = false;
  recog.maxAlternatives = 1;
  recog.onresult = (e: any) => {
    const transcript = e.results[0][0].transcript as string;
    onResult(transcript);
  };
  recog.onend = onEnd;
  recog.onerror = onEnd;
  return recog as { start: () => void; stop: () => void };
}

export function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 1;
  utter.pitch = 1;
  window.speechSynthesis.speak(utter);
}

export function stopSpeaking() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}
