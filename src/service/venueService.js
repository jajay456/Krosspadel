import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export const getVenues = async () => {
    const snapshot = await getDocs(collection(db, "venues"));
    const list = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
    }));
    list.sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
    return list;
};