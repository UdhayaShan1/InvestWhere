import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { AssetAllocations, defaultAssetAllocations, defaultNetWorthSummary, NetWorthSummary } from "../../types/wealth.types"
import { db } from "../firebase";
import { calculateCategoryTotalRecursively } from "../../constants/helper";
export async function getNetWorthSummary(uid: string) {
    try {
        const netWorthDocRef = doc(db, "NetWorthSummary", uid);
        const netWorthDoc = await getDoc(netWorthDocRef);
        if (netWorthDoc.exists()) {
            return netWorthDoc.data() as NetWorthSummary
        }
        return createAndSaveDefaultNetWorthSummary(uid);
    } catch (error) {
        console.log("Error retrieving networthsummary", error);
        return null;
    }
}

export async function createAndSaveDefaultNetWorthSummary(uid: string) {
    const newNetWorth = defaultNetWorthSummary(uid);
    await saveNetWorthSummary(newNetWorth);
    return newNetWorth;
}

export async function saveNetWorthSummary(summary: NetWorthSummary): Promise<boolean> {
    console.log(summary);
    try {
        const netWorthDocRef = doc(db, "NetWorthSummary", summary.uid);
        await setDoc(netWorthDocRef, summary);
        return true;
    } catch (error) {
        console.error("Error saving net worth summary:", error);
        return false;
    }
}


export async function getAssetAllocations(uid: string) {
    try {
        const netAssetAllocationsRef = doc(db, "AssetAllocations", uid);
        const netAssetAllocationsDoc = await getDoc(netAssetAllocationsRef);
        if (netAssetAllocationsDoc.exists()) {
            return netAssetAllocationsDoc.data() as AssetAllocations
        }
        return createAndSaveDefaultAssetAllocations(uid);
    } catch (error) {
        console.log("Error retrieving networthsummary", error);
        return null;
    }
}

export async function createAndSaveDefaultAssetAllocations(uid: string): Promise<AssetAllocations> {
    const newAllocations = defaultAssetAllocations(uid);
    await saveAssetAllocations(newAllocations);
    return newAllocations;
}

export async function saveAssetAllocations(allocations: AssetAllocations): Promise<boolean> {
    try {
        const allocationsDocRef = doc(db, "AssetAllocations", allocations.uid);
        await setDoc(allocationsDocRef, allocations);
        return true;
    } catch (error) {
        console.error("Error saving asset allocations:", error);
        return false;
    }
}

export async function deleteWealthProfile(uid : string) {
    try {
        const netWorthDocRef = doc(db, "NetWorthSummary", uid);
        await deleteDoc(netWorthDocRef);

        const allocationsDocRef = doc(db, "AssetAllocations", uid);
        await deleteDoc(allocationsDocRef);
        return true;
    } catch (error) {
        console.log("Error deleting wealth profile", error);
        return false;
    }
}

export function calculateTotalNetWorth(allocations : AssetAllocations) {
    return calculateCategoryTotalRecursively(allocations);
}
