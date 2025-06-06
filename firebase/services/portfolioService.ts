import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import {
  AssetAllocations,
  AssetAllocationsList,
  defaultAssetAllocations,
  defaultNetWorthSummary,
  NetWorthSummary,
} from "../../types/wealth.types";
import { db } from "../firebase";
import { calculateCategoryTotalRecursively } from "../../constants/helper";
import { getCurrentDateString } from "../../constants/date_helper";
export async function getNetWorthSummary(uid: string) {
  try {
    const netWorthDocRef = doc(db, "NetWorthSummary", uid);
    const netWorthDoc = await getDoc(netWorthDocRef);
    if (netWorthDoc.exists()) {
      return netWorthDoc.data() as NetWorthSummary;
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

export async function saveNetWorthSummary(
  summary: NetWorthSummary
): Promise<boolean> {
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
      return netAssetAllocationsDoc.data() as AssetAllocations;
    }
    return createAndSaveDefaultAssetAllocations(uid);
  } catch (error) {
    console.log("Error retrieving asset allocations", error);
    return null;
  }
}

export async function createAndSaveDefaultAssetAllocations(
  uid: string
): Promise<AssetAllocations> {
  const newAllocations = defaultAssetAllocations(uid);
  await saveAssetAllocations(newAllocations);
  return newAllocations;
}

export async function saveAssetAllocations(
  allocations: AssetAllocations
): Promise<boolean> {
  try {
    const allocationsDocRef = doc(db, "AssetAllocations", allocations.uid);
    await setDoc(allocationsDocRef, allocations);
    return true;
  } catch (error) {
    console.error("Error saving asset allocations:", error);
    return false;
  }
}

export async function getAssetAllocationsList(uid: string) {
  try {
    const assetAllocationsListRef = doc(db, "AssetAllocationsList", uid);
    const assetAllocationsListDoc = await getDoc(assetAllocationsListRef);
    if (assetAllocationsListDoc.exists()) {
      return assetAllocationsListDoc.data() as AssetAllocationsList;
    }
    return createAndSaveDefaultAssetAllocationsList(uid);
  } catch (error) {
    console.log("Error retrieving asset allocations list", error);
    return null;
  }
}

export async function saveRecommendedAllocation(
  uid: string,
  assetAllocation: AssetAllocations
) {
  try {
    const allocationsDocRef = doc(db, "AssetAllocationsList", uid);
    let assetAllocationsListDoc = await getDoc(allocationsDocRef);
    if (!assetAllocationsListDoc.exists()) {
      await createAndSaveDefaultAssetAllocationsList(uid);
      assetAllocationsListDoc = await getDoc(allocationsDocRef);
    }

    let assetAllocationsList =
      assetAllocationsListDoc.data() as AssetAllocationsList;
    if (!assetAllocationsList.recommended) {
      assetAllocationsList.recommended = {};
    }

    const listOfKeys = Object.keys(assetAllocationsList.recommended).map(
      Number
    );
    let maxId = -1;
    if (listOfKeys.length === 0) {
      maxId = 0;
    } else {
      maxId = Math.max(...listOfKeys) + 1;
    }
    console.log(maxId, "maxId");
    assetAllocationsList.recommended[maxId] = {
      assetAllocations: assetAllocation,
      createdOn: getCurrentDateString(),
    };

    console.log(assetAllocationsList, "New assetAllocationsList");
    await setDoc(allocationsDocRef, assetAllocationsList);

    return true;
  } catch (error) {
    console.error("Error saving asset allocations list:", error);
    return false;
  }
}

export async function createAndSaveDefaultAssetAllocationsList(
  uid: string
): Promise<AssetAllocationsList> {
  const newAllocations = defaultAssetAllocations(uid);
  const newAllocationList: AssetAllocationsList = {
    uid: uid,
    current: newAllocations,
    recommended: {},
  };
  await saveAssetAllocationsList(newAllocationList);
  return newAllocationList;
}

export async function saveAssetAllocationsList(
  allocationsList: AssetAllocationsList
): Promise<boolean> {
  try {
    if (!allocationsList.uid) {
      throw new Error("allocationsList.uid is undefined");
    }
    const allocationsDocRef = doc(
      db,
      "AssetAllocationsList",
      allocationsList.uid
    );
    await setDoc(allocationsDocRef, allocationsList);
    return true;
  } catch (error) {
    console.error("Error saving asset allocations list:", error);
    return false;
  }
}

export async function saveAssetAllocationsListWithCurrentAllocation(
  assetAllocation: AssetAllocations
): Promise<boolean> {
  try {
    if (!assetAllocation.uid) {
      throw new Error("uid is undefined");
    }

    const uid = assetAllocation.uid;
    let assetAllocationsList = await getAssetAllocationsList(uid);

    if (!assetAllocationsList) {
      assetAllocationsList = {
        uid: uid,
        current: assetAllocation,
        recommended: {},
      };
    } else {
      assetAllocationsList.current = assetAllocation;
    }

    const allocationsDocRef = doc(db, "AssetAllocationsList", uid);
    await setDoc(allocationsDocRef, assetAllocationsList);
    return true;
  } catch (error) {
    console.error("Error saving asset allocations list:", error);
    return false;
  }
}

export async function deleteWealthProfile(uid: string) {
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

export function calculateTotalNetWorth(allocations: AssetAllocations) {
  return calculateCategoryTotalRecursively(allocations);
}
