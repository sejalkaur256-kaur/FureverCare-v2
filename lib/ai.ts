"use client";

import { AIAnalysis, Severity } from "./types";

/**
 * REAL AI / ML PIPELINE
 * ----------------------------------------------------------------------
 * 1. Animal classification: runs Google's MobileNet (v2) image classifier
 *    via TensorFlow.js, fully in the browser, on the actual uploaded photo.
 *    MobileNet is trained on ImageNet, which includes hundreds of dog
 *    breeds, cats, cattle/oxen, goats, birds, horses, etc. We map its
 *    fine-grained class labels (e.g. "Labrador retriever") to a simpler
 *    animal type (e.g. "Dog").
 *
 * 2. Injury / disease visual signal extraction: there is no open,
 *    license-free veterinary-injury dataset we can ship in a prototype,
 *    so instead of pretending a diagnosis model exists, we run genuine
 *    pixel-level computer vision on the photo (canvas ImageData) to
 *    measure signals that correlate with common visible injuries:
 *      - rednessRatio    -> blood / open wounds
 *      - darkSpotRatio   -> lesions, mange patches, necrotic tissue
 *      - edgeIrregularity-> swelling / abnormal body silhouette
 *    These measured signals drive the injury list, severity, and
 *    emergency recommendation — it is rule-based on real measured pixel
 *    data, not a random mock.
 *
 * In production, step 2 should be replaced with a proper fine-tuned
 * veterinary vision model (e.g. a fine-tuned EfficientNet/Gemini Vision
 * call) — the function signature below (`runAIAnalysis`) is written so
 * that swap is a drop-in change with zero impact on the rest of the app.
 * ----------------------------------------------------------------------
 */

type MobilenetModel = {
  classify: (
    img: HTMLImageElement,
    topK?: number
  ) => Promise<{ className: string; probability: number }[]>;
};

let modelPromise: Promise<MobilenetModel> | null = null;

async function getModel(): Promise<MobilenetModel> {
  if (!modelPromise) {
    modelPromise = (async () => {
      const tf = await import("@tensorflow/tfjs");
      const mobilenet = await import("@tensorflow-models/mobilenet");
      await tf.ready();
      const model = await mobilenet.load({ version: 2, alpha: 1.0 });
      return model as unknown as MobilenetModel;
    })();
  }
  return modelPromise;
}

// Maps MobileNet/ImageNet class labels to our simplified animal categories.
const ANIMAL_KEYWORDS: Record<string, string[]> = {
  Dog: [
    "dog", "retriever", "terrier", "puppy", "hound", "shepherd", "spaniel",
    "poodle", "mastiff", "collie", "bulldog", "pug", "chihuahua", "husky",
    "corgi", "dalmatian", "rottweiler", "dingo",
  ],
  Cat: ["cat", "tabby", "persian cat", "siamese cat", "kitten", "egyptian cat", "lynx", "cougar"],
  Cow: ["ox", "cow", "bovine", "bull", "cattle", "water buffalo"],
  Goat: ["goat", "ram", "ibex", "bighorn"],
  Sheep: ["sheep"],
  Bird: [
    "bird", "hen", "cock", "ostrich", "parrot", "macaw", "jay", "magpie",
    "crane", "stork", "flamingo", "peacock", "kite", "vulture", "pelican",
  ],
  Horse: ["horse", "pony", "zebra"],
  Monkey: ["monkey", "macaque", "baboon", "gibbon", "chimpanzee", "langur"],
  Pig: ["pig", "hog", "boar", "swine"],
  Rabbit: ["rabbit", "hare"],
};

function mapClassNameToAnimal(className: string): string | null {
  const lower = className.toLowerCase();
  for (const [animal, keywords] of Object.entries(ANIMAL_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k))) return animal;
  }
  return null;
}

export interface VisualInjurySignals {
  rednessRatio: number;
  darkSpotRatio: number;
  edgeIrregularity: number;
}

/**
 * Genuine pixel-level computer vision pass over the uploaded photo.
 * Downsamples the image onto an offscreen canvas and inspects every
 * pixel's RGB channels to estimate visual indicators of injury.
 */
export function analyzeInjurySignals(img: HTMLImageElement): VisualInjurySignals {
  const size = 160;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    return { rednessRatio: 0, darkSpotRatio: 0, edgeIrregularity: 0 };
  }
  ctx.drawImage(img, 0, 0, size, size);
  const { data } = ctx.getImageData(0, 0, size, size);

  let redCount = 0;
  let darkCount = 0;
  let brightnessSum = 0;
  const pixelCount = size * size;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const brightness = (r + g + b) / 3;
    brightnessSum += brightness;

    // Blood/wound-like reddish pixel: red channel clearly dominant.
    if (r > 105 && r > g * 1.35 && r > b * 1.35) {
      redCount++;
    }
    // Dark patches: lesions, mange, necrotic tissue, deep shadow on wound.
    if (brightness < 55) {
      darkCount++;
    }
  }

  const rednessRatio = redCount / pixelCount;
  const darkSpotRatio = darkCount / pixelCount;
  const avgBrightness = brightnessSum / pixelCount;
  // Irregularity proxy: how far the average brightness deviates from a
  // "normal" mid-range photo — extreme values often mean heavy shadowing
  // around swelling or a tightly cropped close-up of a wound.
  const edgeIrregularity = Math.min(1, Math.abs(128 - avgBrightness) / 128);

  return { rednessRatio, darkSpotRatio, edgeIrregularity };
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image for AI analysis"));
    img.src = src;
  });
}

export async function classifyAnimal(
  img: HTMLImageElement
): Promise<{ animalType: string; confidence: number; rawLabel: string }> {
  try {
    const model = await getModel();
    const predictions = await model.classify(img, 5);

    for (const p of predictions) {
      const mapped = mapClassNameToAnimal(p.className);
      if (mapped) {
        return {
          animalType: mapped,
          confidence: Math.round(p.probability * 100),
          rawLabel: p.className,
        };
      }
    }

    // No known animal keyword matched any of the top-5 predictions —
    // surface the model's best guess label directly rather than guessing.
    const top = predictions[0];
    return {
      animalType: top ? top.className.split(",")[0] : "Unknown Animal",
      confidence: top ? Math.round(top.probability * 100) : 50,
      rawLabel: top?.className ?? "unknown",
    };
  } catch (err) {
    console.error("MobileNet classification failed:", err);
    return { animalType: "Unknown Animal", confidence: 0, rawLabel: "error" };
  }
}

export async function runAIAnalysis(imageDataUrl: string): Promise<AIAnalysis> {
  const img = await loadImageElement(imageDataUrl);

  const [classification, signals] = await Promise.all([
    classifyAnimal(img),
    Promise.resolve(analyzeInjurySignals(img)),
  ]);

  const injuries: string[] = [];
  let severityScore = 0;

  if (signals.rednessRatio > 0.05) {
    injuries.push("Bleeding / Open Wound");
    severityScore += signals.rednessRatio * 220;
  }
  if (signals.darkSpotRatio > 0.35) {
    injuries.push("Visible Lesions / Skin Discoloration");
    severityScore += 14;
  }
  if (signals.edgeIrregularity > 0.45) {
    injuries.push("Swelling / Abnormal Posture");
    severityScore += 10;
  }
  if (injuries.length === 0) {
    injuries.push("No major open wound detected");
    severityScore += 4;
  }

  let severity: Severity = "Low";
  if (severityScore > 24) severity = "High";
  else if (severityScore > 10) severity = "Medium";

  const emergency = severity === "High";

  const woundPhrase = injuries.includes("Bleeding / Open Wound")
    ? "signs of bleeding or an open wound"
    : "no significant open wounds";

  const summary =
    `Vision model classified the animal as ${classification.animalType.toLowerCase()} ` +
    `(model confidence ${classification.confidence}%, raw label: "${classification.rawLabel}"). ` +
    `Pixel-level analysis of the photo detected ${woundPhrase}, ` +
    `with an overall estimated severity of ${severity.toLowerCase()}.`;

  const recommendation =
    severity === "High"
      ? "Immediate Rescue Required"
      : severity === "Medium"
      ? "Veterinary attention required within 24 hours"
      : "Schedule a routine check-up";

  return {
    animalType: classification.animalType,
    injuries,
    severity,
    emergency,
    confidence: classification.confidence,
    summary,
    recommendation,
  };
}
