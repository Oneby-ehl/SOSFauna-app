import type { Catalog } from "../translate";

export const rescueSummaryEn = {
  rescueMessage: {
    statePrefix: "• Condition: ", animalTypePrefix: "• Animal: ", positionPrefix: "• Position: ", environmentPrefix: "• Surroundings: ",
    legacyPlacePrefix: "• Where the animal is: ", observedSignsPrefix: "• Observed signs: ", photoAvailable: "• Photograph available", videoAvailable: "• Video available",
    title: "WILDLIFE RESCUE REPORT", introductionPrefix: "I have found an animal that is ", introductionSuffix: " and may need help.",
    situationHeading: "Situation", additionalHeading: "Additional information", attribution: "Information gathered with SOS Fauna España",
  },
  summaryLocation: { referencePrefix: "Location reference: ", coordinatesPrefix: "Coordinates: ", mapPrefix: "Map: " },
  summaryPreview: {
    notSpecified: "Not specified", title: "📋 REPORT SUMMARY", animal: "🐾 Animal", state: "❤️ Condition", position: "📍 Position", environment: "🌍 Surroundings",
    legacyPlace: "📍 Where the animal is", observedSituation: "⚠️ Observed situation", noFlags: "None selected", location: "📍 Location",
    mapIncluded: "Map included in the report", no: "❌ No", photo: "📷 Photograph", yes: "✅ Yes", video: "🎥 Video",
  },
  summaryInstructions: {
    review: "• Check the summary, or go back to make corrections.", whatsappPrefix: "• Use ", whatsappName: "WhatsApp", whatsappSuffix: " to send it to GREFA Madrid or another contact of your choice.",
    copyPrefix: "• Use ", copyName: "Copy", copySuffix: " to save the summary to the clipboard and share it through any app.",
    helpPrefix: "• Use ", helpName: "Help", helpSuffix: " to find the nearest centre in your province or emergency services.",
    finishPrefix: "• Use ", finishName: "Finish", finishSuffix: " once you have informed a specialist, or to close the report.",
  },
} satisfies Pick<Catalog, "rescueMessage" | "summaryLocation" | "summaryPreview" | "summaryInstructions">;
