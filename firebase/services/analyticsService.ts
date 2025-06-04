import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { LLMSummaryRecord } from "../../types/analytics.types";

export async function findNetWorthSummaryByUid(
  uid: string
): Promise<LLMSummaryRecord | null> {
  try {
    const llmSummaryDocRef = doc(db, "LLMSummary", uid);
    const llmSummaryDoc = await getDoc(llmSummaryDocRef);
    if (llmSummaryDoc.exists()) {
      return llmSummaryDoc.data() as LLMSummaryRecord;
    }
    return null;
  } catch (error) {
    console.log("Error retrieving networthsummary", error);
    return null;
  }
}

export async function saveNetWorthSummaryByUid(
  uid: string,
  summary: LLMSummaryRecord
): Promise<boolean> {
  try {
    const llmSummaryDocRef = doc(db, "LLMSummary", uid);
    await setDoc(llmSummaryDocRef, summary);
    return true;
  } catch (error) {
    console.error("Error saving net worth summary:", error);
    return false;
  }
}
