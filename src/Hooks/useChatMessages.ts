import {
    collection,
    query,
    orderBy,
    limit,
    startAfter,
    onSnapshot,
    getDocs,
    DocumentData,
    QueryDocumentSnapshot,
    Timestamp,
    getDoc,
    addDoc,
    doc,
    endBefore,
    limitToLast,
    updateDoc,
} from "firebase/firestore";
import { useEffect, useRef, useState, useCallback } from "react";
import { db } from "../firebase.config";
import toast from "react-hot-toast";

const PAGE_SIZE = 10;

export default function useChatMessages(chatId: string) {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const earliestDoc = useRef<QueryDocumentSnapshot<DocumentData> | null>(
        null
    );
    const latestDoc = useRef<QueryDocumentSnapshot<DocumentData> | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    

    // Helper to hydrate sender_ref → sender
    const hydrateMessage = async (docSnap: QueryDocumentSnapshot) => {
        const data = docSnap.data();
        let sender = null as any;
        if (data.sender_ref) {
            const snap = await getDoc(data.sender_ref);
            if (snap.exists()) sender = snap.data();

        }

        return { id: docSnap.id, ...data, sender };
    };

    // 1) Load the initial batch (latest PAGE_SIZE messages)

    const scrollToBottom = () => {
        setTimeout(() => {
            containerRef.current?.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: "smooth", // or "smooth" if you like
            });
        }, 0);
    }

    const resetMessage = () => {
        setMessages([]);
        latestDoc.current = null;
        earliestDoc.current = null;
        // containerRef.current = null;
    }

    useEffect(() => {
        resetMessage()

        let unsubscribeLive: () => void;

        const loadInitial = async () => {
            setLoading(true);
            // newest first:
            const initialQ = query(
                collection(db, "pts_chats", chatId, "pts_messages"),
                orderBy("timestamp", "desc"),
                limit(PAGE_SIZE)
            );
            const snap = await getDocs(initialQ);
    
            // track pagination cursors:
            earliestDoc.current = snap.docs[snap.docs.length - 1] || null;
            latestDoc.current = snap.docs[0] || null;
    
            // hydrate all docs & reverse for display (oldest→newest)
            const hydrated = await Promise.all(snap.docs.map(hydrateMessage));
            setMessages(hydrated.reverse());
            setLoading(false);
            scrollToBottom();
    
            // 2) Subscribe in real-time to any NEWER docs than latestDoc
            if (latestDoc.current) {
                const liveQ = query(
                    collection(db, "pts_chats", chatId, "pts_messages"),
                    orderBy("timestamp", "asc"),
                    startAfter(latestDoc.current)
                );
                unsubscribeLive = onSnapshot(liveQ, async (liveSnap) => {
                    if (!liveSnap.empty) {
                        const newMsgs = await Promise.all(
                            liveSnap.docs.map(hydrateMessage)
                        );
                        setMessages((prev) => {
                            const existingIds = new Set(prev.map((m) => m.id));
                            const filtered = newMsgs.filter((m) => !existingIds.has(m.id));
                            latestDoc.current = liveSnap.docs[liveSnap.docs.length - 1];
                            return [...prev, ...filtered];
                        });
                        latestDoc.current = liveSnap.docs[liveSnap.docs.length - 1];

                        scrollToBottom()
                    }
                });
            }
        }

        loadInitial();

        return () => {
            unsubscribeLive?.();
            setMessages([]);
        };

    }, [chatId]);

    // 3) fetch older messages when scrolling up

    const loadMore = useCallback(async () => {
        if (!earliestDoc.current) return;
        setLoadingMore(true);

        // 1) Query older messages in ASC order, ending before earliestDoc
        const olderQ = query(
            collection(db, "pts_chats", chatId, "pts_messages"),
            orderBy("timestamp", "asc"),
            endBefore(earliestDoc.current),
            limitToLast(PAGE_SIZE)
        );
        const snap = await getDocs(olderQ);

        if (!snap.empty) {
            // 2) The first doc in ASC order is the new earliest
            earliestDoc.current = snap.docs[0];

            // 3) Hydrate & prepend in one go
            const older = await Promise.all(snap.docs.map(hydrateMessage));
            setMessages((prev) => [...older, ...prev]);
        }

        setLoadingMore(false);
    }, [chatId]);


    // 4) sendMessage unchanged
    const sendMessage = useCallback(
        async (text: string) => {
          const user = JSON.parse(sessionStorage.getItem("user") || "null");
          if (!user) {
            toast.error("User is not logged in");
            return;
          }
      
          try {
            // 1) Add the message
            await addDoc(collection(db, "pts_chats", chatId, "pts_messages"), {
              message: text,
              sender_ref: doc(db, "users", user.uid),
              timestamp: Timestamp.fromDate(new Date()),
              read_by_parent: false,
              read_by_student: false,
              read_by_teacher: true,
            });
      
            // 2) Update the parent chat's updated_at
            const chatRef = doc(db, "pts_chats", chatId);
            await updateDoc(chatRef, {
              updated_at: Timestamp.fromDate(new Date()),
            });
          } catch (err) {
            console.error(err);
            toast.error("Failed to send message");
          }
        },
        [chatId]
    );

    return {
        messages,
        loading,
        loadingMore,
        containerRef,
        loadMore,
        sendMessage,
    };
}
