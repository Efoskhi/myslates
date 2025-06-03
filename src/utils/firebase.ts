import {
    collection,
    getDocs,
    doc,
    deleteDoc,
    setDoc,
    updateDoc,
    query,
    where,
    limit,
    startAfter,
    orderBy,
    getCountFromServer,
    getAggregateFromServer,
    sum,
    Timestamp,
    getDoc,
    addDoc,
    writeBatch,
    Query,
    OrderByDirection,
    CollectionReference,
    DocumentData,
    QueryDocumentSnapshot,
} from "firebase/firestore";
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} from "firebase/storage";
import { db, storage } from "../firebase.config";

interface CountDocumentReference {
    collection: string;
    field: string;
    countFieldName: string;
}

interface FindOption {
    collection: string;
    field: string;
    value: string;
}

interface AddFirebaseData {
    collection: string;
    data?: Record<string, any>;
    id?: string;
    subCollectionData?: Record<string, any>;
    successMessage?: string;
}

interface UpdateFirebaseData {
    collection: string;
    data?: Record<string, any>;
    id: string;
    title?: string;
    subCollectionData?: Record<string, any>;
}

interface DeleteFirebaseData {
    collection: string;
    id: string;
    subCollection?: Record<string, any>;
    title?: string;
    subCollectionData?: Record<string, any>;
    deleteMainDocument?: boolean;
}

type WhereFilterOp =
    | "<"
    | "<="
    | "=="
    | "!="
    | ">="
    | ">"
    | "array-contains"
    | "in"
    | "array-contains-any";

export interface GetFirebaseDataOptions {
    collection: string;
    query?: Array<[string, WhereFilterOp, any, string?]>;
    refFields?: string[];
    selectFields?: string[];
    selectRefFields?: string[];
    findOne?: boolean;
    countDocuments?: boolean;
    pageSize?: number;
    page?: number;
    orderBy?: [string, "asc" | "desc"];
    find?: FindOption | null;
    sumFields?: string[];
    countDocumentReference?: CountDocumentReference | null;
    subcollections?: string[];
}

interface GetFirebaseDataResponse {
    status: string;
    message: string;
    data?: any;
}

interface GetFirebaseInnerCollectionDataOptions {
    collection: string;
    query?: Array<[string, WhereFilterOp, any, string?]>;
    innerCollection: string;
    page: number;
    pageSize: number;
    refFields?: string[];     // any fields in the inner docs that are DocumentReferences
  }

const getFirebaseData = async (
    options: GetFirebaseDataOptions
): Promise<GetFirebaseDataResponse> => {
    // Destructure options with defaults:
    const {
        collection: coll,
        query: queryConditions,
        refFields = [],
        selectFields = [],
        selectRefFields = [],
        findOne = false,
        countDocuments = false,
        pageSize = 10,
        page = null,
        orderBy: order,
        find = null,
        sumFields = [],
        countDocumentReference = null,
        subcollections = [],
    } = options;

    let data: any;
    let totalResult = 0;
    let totalPages = 0;
    // You can adjust isEmptySearchResult if you need to support that logic.
    const isEmptySearchResult = false;

    try {
        // Start with a reference to the collection.
        let collectionRef = collection(db, coll);
        let fbQueryRef: any = collectionRef; // Will be used to build our query

        // Apply filters (query conditions)
        if (queryConditions && Array.isArray(queryConditions)) {
            queryConditions.forEach(([field, operator, value, timestamp]) => {
                const transformedValue =
                    timestamp === "timestamp"
                        ? Timestamp.fromDate(new Date(value))
                        : value;
                fbQueryRef = query(
                    fbQueryRef,
                    where(field, operator, transformedValue)
                );
            });
        }

        // Apply ordering if provided.
        if(order){
            fbQueryRef = query(fbQueryRef, orderBy(order[0], order[1] as OrderByDirection));
        }
        // At this point, firebase query (fbQueryRef) holds our base query.
        // We'll define a final query that differs if we want to count documents or limit results.
        let finalQuery = countDocuments
            ? query(fbQueryRef)
            : query(fbQueryRef, limit(pageSize));

        // Handle the "find" option: if provided, override the query accordingly.
        if (find) {
            const { collection: findColl, field, value } = find;
            const findDocRef = doc(db, coll, value);
            fbQueryRef = query(
                collection(db, findColl),
                where(field, "==", findDocRef)
            );
            finalQuery = fbQueryRef;
        }

        // Handle pagination: if a page number is provided beyond page 1,
        // fetch the last document of the previous "page" to then use startAfter.
        if (page && page > 1) {
            // fetch the last doc of the *previous* page
            const prevPageQuery = query(fbQueryRef, limit(pageSize * (page - 1)));
            const prevSnap = await getDocs(prevPageQuery);
            const lastVisible = prevSnap.docs[prevSnap.docs.length - 1];
            finalQuery = query(
                finalQuery,
                startAfter(lastVisible),
                limit(pageSize)
            );
        } else {
            finalQuery = query(finalQuery, limit(pageSize));
        }

        // If we only need the document count, use getCountFromServer.
        if (countDocuments) {
            const countSnapshot = await getCountFromServer(finalQuery);
            return {
                status: "success",
                message: "Document count fetched",
                data: countSnapshot.data().count,
            };
        } else if (sumFields.length > 0) {
            // If you need to sum fields, assume you have a custom aggregation helper:
            const aggregated: Record<string, number> = {};
            await Promise.all(
                sumFields.map(async (field) => {
                    const snapshot = await getAggregateFromServer(fbQueryRef, {
                        total: sum(field),
                    });
                    aggregated[field] = snapshot.data().total;
                })
            );
            return {
                status: "success",
                message: "Aggregated data fetched",
                data: aggregated,
            };
        } else if (isEmptySearchResult && !queryConditions) {
            data = [];
        } else {
            // When not counting or aggregating, perform a full fetch.
            // For pagination metadata, if a page is provided, recalc total documents.

            if (page) {
                const fullQuery = query(fbQueryRef);
                const countSnapshot = await getCountFromServer(fullQuery);
                totalResult = countSnapshot.data().count;
                totalPages = Math.ceil(totalResult / pageSize);
            }

            const snapshot = await getDocs(finalQuery);

            data = await Promise.all(
                snapshot.docs.map(async (docSnapshot) => {
                    let docData = {
                        id: docSnapshot.id,
                        ref: docSnapshot.ref,
                        ...docSnapshot.data(),
                    };

                    // If any fields are references, fetch their data.
                    if (refFields.length > 0) {
                        for (const refField of refFields) {
                            const refDoc = docData[refField];
                            if (refDoc) {
                                const refSnapshot = await getDoc(refDoc);
                                if (refSnapshot.exists()) {
                                    docData[refField] = {
                                        id: refSnapshot.id,
                                        ...refSnapshot.data(),
                                    };
                                }
                            }
                        }
                    }

                    if (subcollections.length > 0) {
                        for (const subName of subcollections) {
                            const subRef = collection(docSnapshot.ref, subName);
                            const subSnap = await getDocs(subRef);

                            docData[subName] = subSnap.docs.map((subDoc) => ({
                                id: subDoc.id,
                                ...subDoc.data(),
                            }));
                        }
                    }

                    // Count document references if required.
                    if (countDocumentReference) {
                        const {
                            collection: refCollection,
                            field,
                            countFieldName,
                        } = countDocumentReference;
                        const refQuery = query(
                            collection(db, refCollection),
                            where(field, "==", docData.ref)
                        );
                        const countSnapshot = await getCountFromServer(
                            refQuery
                        );
                        docData[countFieldName] = countSnapshot.data().count;
                    }

                    return docData;
                })
            );
        }

        // If findOne is true, pick only the first document.
        if (findOne) {
            data = Array.isArray(data) && data.length > 0 ? data[0] : null;
        }

        return {
            status: "success",
            message: "Data fetched",
            data: {
                [coll]: data,
                pagination: { page, pageSize, totalResult, totalPages },
            },
        };
    } catch (e: any) {
        console.error("Error:", e);
        return {
            status: "error",
            message: "An error occurred: " + e.message,
        };
    }
};

const getFirebaseInnerCollectionData = async ({
    collection: coll,
    query: queryConditions,
    innerCollection,
    page,
    pageSize,
    refFields = [],
  }: GetFirebaseInnerCollectionDataOptions): Promise<GetFirebaseDataResponse> => {
    try {

        console.log("queryConditions", { coll, innerCollection, queryConditions })

        const collectionRef = collection(db, coll);
        let fbQueryRef = collectionRef as any;

        if (queryConditions && Array.isArray(queryConditions)) {
            queryConditions.forEach(([field, operator, value, timestamp]) => {
                const transformedValue =
                    timestamp === "timestamp"
                        ? Timestamp.fromDate(new Date(value))
                        : value;

                fbQueryRef = query(
                    fbQueryRef,
                    where(field, operator, transformedValue)
                );
            });
        }

        const parentQ = query(
            fbQueryRef,
            limit(1)
        );

        const parentSnap = await getDocs(parentQ);
        console.log("parentSnap.empty", parentSnap.empty)
        if (parentSnap.empty) {
            return {
                status: "success",
                message: "Data fetched",
                data: {
                    [innerCollection]: [],
                    pagination: { page, pageSize, totalResult: 0, totalPages: 0 },
                },
            };
        }

        const parentDoc = parentSnap.docs[0];
    
        // 2) Build a reference to the inner collection
        const innerColRef = collection(
            db,
            coll,
            parentDoc.id,
            innerCollection
        ) as CollectionReference<DocumentData>;
    
        // 3) Pagination setup
        let pageQuery = query(innerColRef, limit(pageSize));
    
        if (page > 1) {
            // fetch up to the end of the previous page
            const prevQ = query(innerColRef, limit(pageSize * (page - 1)));
            const prevSnap = await getDocs(prevQ);
            const lastVisible = prevSnap.docs[prevSnap.docs.length - 1];
            pageQuery = query(innerColRef, startAfter(lastVisible), limit(pageSize));
        }
    
        // 4) Total count for pagination
        const countSnap = await getCountFromServer(query(innerColRef));
        const totalResult = countSnap.data().count;
        const totalPages = Math.ceil(totalResult / pageSize);
    
        // 5) Fetch the page of inner docs
        const snap = await getDocs(pageQuery);
        const data = await Promise.all(
            snap.docs.map(async (docSnap: QueryDocumentSnapshot<DocumentData>) => {
            const docData: any = { id: docSnap.id, ...docSnap.data() };
    
            // 6) Resolve any DocumentReference fields
            for (const refField of refFields) {
                const refDoc = docData[refField];
                if (refDoc) {
                    const refSnapshot = await getDoc(refDoc);
                    if (refSnapshot.exists()) {
                        docData[refField] = { id: refSnapshot.id, ...refSnapshot.data()};
                    }
                }
            }
    
            return docData;
            })
        );
    
        return {
            status: "success",
            message: "Data fetched",
            data: {
                [innerCollection]: data,
                pagination: { page, pageSize, totalResult, totalPages },
            },
        };
    } catch (error: any) {
        console.error("Error in getFirebaseInnerCollectionData:", error);
        return {
            status: "error",
            message: error.message,
            data: null,
        };
    }
};

const addFirebaseData = async ({
    collection: coll,
    data,
    id,
    subCollectionData,
    successMessage,
}: AddFirebaseData) => {
    try {
        const preparedData = data
            ? {
                  ...prepareDataWithReferences(data),
                  created_date: Timestamp.fromDate(new Date()),
              }
            : null;

        const docRef = id ? doc(db, coll, id) : doc(collection(db, coll));

        if (preparedData) {
            const docSnapshot = await getDoc(docRef);

            // Only create the doc if it doesn't exist
            if (!docSnapshot.exists()) {
                await setDoc(docRef, preparedData);
            }
        }

        // Handle subcollections
        if (subCollectionData && typeof subCollectionData === "object") {
            for (const [subCollName, subData] of Object.entries(
                subCollectionData
            )) {
                const subDocs = Array.isArray(subData) ? subData : [subData];

                for (const item of subDocs) {
                    const subRef = item.id
                        ? doc(docRef, subCollName, item.id)
                        : doc(collection(docRef, subCollName));

                    const preparedSubData = {
                        ...prepareDataWithReferences(item),
                        created_time: Timestamp.fromDate(new Date()),
                    };
                    await setDoc(subRef, preparedSubData);
                }
            }
        }

        const newDocSnapshot = await getDoc(docRef);

        return {
            status: "success",
            message: successMessage ?? "Data has been added",
            data: {
                id: docRef.id,
                ...newDocSnapshot.data(),
            }
        };
    } catch (error) {
        console.error("error", error);
        return {
            status: "error",
            message: "Something went wrong adding data",
        };
    }
};

const BATCH_LIMIT = 500;

const chunkArray = (array, chunkSize) => {
  const chunks = [] as any;
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

const addBulkFirebaseData = async ({ collection: coll, data }) => {
    const ref = collection(db, coll);
    const chunks = chunkArray(data, BATCH_LIMIT);

    for (const chunk of chunks) {
        const batch = writeBatch(db);

        chunk.forEach((record) => {
            const data = prepareDataWithReferences(record)
            const docRef = doc(ref); // auto-generated ID
            batch.set(docRef, data);
        });

        await batch.commit(); // commit each batch
    }
};

const prepareDataWithReferences = (data) => {
    const preparedData = { ...data };

    for (const key in preparedData) {
        const value = preparedData[key];

        if (value && value.isRef === true && value.collection && value.id) {
            preparedData[key] = doc(db, value.collection, value.id);
        }

        if (value && value.isDate && value.date) {
            preparedData[key] = Timestamp.fromDate(value.date);
        }
    }

    return preparedData;
};

const uploadFileToFirebase = async (file, path) => {
    if (!file) {
        console.error("No file selected.");
        return "";
    }

    try {
        const storageRef = ref(storage, `${path}/${file.name}`);

        const uploadResult = await uploadBytes(storageRef, file);

        const downloadURL = await getDownloadURL(uploadResult.ref);

        return downloadURL;
    } catch (error) {
        return "";
        // console.error("Error uploading image:", error);
    }
};

const deleteFileFromFirebase = async (filePath) => {
    const fileRef = ref(storage, filePath);

    try {
        await deleteObject(fileRef);
    } catch (error) {
        // console.error("Error deleting file:", error);
    }
};

const deleteFirebaseData = async ({
    collection: collectionName,
    id,
    subCollection,
    subCollectionData,
    title,
    deleteMainDocument = true,
}: DeleteFirebaseData) => {
    try {
        const docRef = doc(db, collectionName, id);

        // 1. Delete specific subcollection docs by ID
        if (subCollectionData && typeof subCollectionData === "object") {
            for (const [subCollName, subDocInfo] of Object.entries(
                subCollectionData
            )) {
                if (subDocInfo?.id) {
                    const subDocRef = doc(docRef, subCollName, subDocInfo.id);
                    await deleteDoc(subDocRef);
                }
            }
        }

        // 2. Optional: query-based deletion
        if (subCollection) {
            const { collection: subCollectionName, field } = subCollection;
            const subCollectionRef = collection(db, subCollectionName);
            const q = query(subCollectionRef, where(field, "==", docRef));
            const querySnapshot = await getDocs(q);

            const deletePromises = querySnapshot.docs.map((doc) =>
                deleteDoc(doc.ref)
            );
            await Promise.all(deletePromises);
        }

        // 3. Delete the main doc only if allowed
        if (deleteMainDocument) {
            await deleteDoc(docRef);
        }

        return {
            status: "success",
            message: `${title} has been deleted`,
        };
    } catch (error) {
        console.error(error);
        return {
            status: "error",
            message: `Could not delete ${title}`,
        };
    }
};

const updateFirebaseData = async ({
    collection: coll,
    data,
    id,
    title = "Customer",
    subCollectionData,
}: UpdateFirebaseData) => {
    try {
        const docRef = doc(db, coll, id);

        // Update main document
        if (data) {
            const updatedData = prepareDataWithReferences(data);
            await updateDoc(docRef, updatedData);
        }

        // Handle subcollection updates
        if (subCollectionData && typeof subCollectionData === "object") {
            for (const [subCollName, subData] of Object.entries(
                subCollectionData
            )) {
                const subDocs = Array.isArray(subData) ? subData : [subData];

                for (const subDoc of subDocs) {
                    if (!subDoc.id) {
                        console.warn(
                            `Skipping subdocument without id in ${subCollName}`
                        );
                        continue;
                    }

                    // Correct: Get document reference in subcollection
                    const subDocRef = doc(
                        collection(docRef, subCollName),
                        subDoc.id
                    );

                    const preparedSubData = {
                        ...prepareDataWithReferences(subDoc),
                        created_time: Timestamp.fromDate(new Date()),
                    };

                    await updateDoc(subDocRef, preparedSubData);
                }
            }
        }

        return {
            status: "success",
            message: `${title} updated successfully`,
        };
    } catch (error) {
        console.error("Error updating document: ", error);
        return {
            status: "error",
            message: `Something went wrong while updating the ${title}`,
        };
    }
};

export {
    getFirebaseData,
    addFirebaseData,
    uploadFileToFirebase,
    deleteFirebaseData,
    updateFirebaseData,
    deleteFileFromFirebase,
    addBulkFirebaseData,
    getFirebaseInnerCollectionData,
};
