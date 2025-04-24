// src/hooks/useChats.ts
import {
    collection,
    query,
    orderBy,
    limit,
    startAfter,
    onSnapshot,
    getDocs,
    getDoc,
    DocumentData,
    DocumentReference,
    QueryDocumentSnapshot,
  } from "firebase/firestore";
  import { useEffect, useState, useRef, useCallback } from "react";
  import { db } from "../firebase.config";
  
  export type ChatListItem = {
    id: string;
    student: {
      display_name: string;
      photo_url?: string;
    } | null;
    latestMessage: {
      id: string;
      message: string;
      timestamp: any;
    } | null;
  };
  
  const PAGE_SIZE = 20;
  
  export default function useChats() {
    const [chats, setChats] = useState<ChatListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
  
    // Cursor refs for pagination
    const lastVisible = useRef<QueryDocumentSnapshot<DocumentData> | null>(null);
    const firstVisible = useRef<QueryDocumentSnapshot<DocumentData> | null>(null);
  
    // hydrate a single chat doc into ChatListItem
    const hydrateChat = async (chatDoc: QueryDocumentSnapshot<DocumentData>) => {
      const data = chatDoc.data();
      // parent_ref
      let student = null as any;
      if (data.student_ref) {
        try {
          const pSnap = await getDoc(data.student_ref as DocumentReference);
          if (pSnap.exists()) {
            const { display_name, photo_url } = pSnap.data();
            student = { display_name, photo_url };
          }
        } catch (e) {
          console.error(e);
        }
      }
      // latest message
      const msgsQ = query(
        collection(db, "pts_chats", chatDoc.id, "pts_messages"),
        orderBy("timestamp", "desc"),
        limit(1)
      );
      const msgsSnap = await getDocs(msgsQ);
      let latestMessage = null as any;
      if (!msgsSnap.empty) {
        const m = msgsSnap.docs[0];
        const { message, timestamp } = m.data();
        latestMessage = { id: m.id, message, timestamp };
      }
  
      return { id: chatDoc.id, student, latestMessage } as ChatListItem;
    };
  
    // Initial load + live subscription for NEW chats
    useEffect(() => {
      setLoading(true);
      // 1) initial page
      const initialQ = query(
        collection(db, "pts_chats"),
        // orderBy("updated_at", "desc"),
        orderBy("created_at", "desc"),
        limit(PAGE_SIZE)
      );
  
      let unsubscribeLive: () => void;
  
      (async () => {
        const snap = await getDocs(initialQ);
        if (!snap.empty) {
          firstVisible.current = snap.docs[0];
          lastVisible.current = snap.docs[snap.docs.length - 1];
        }
  
        const items = await Promise.all(snap.docs.map(hydrateChat));
        setChats(items);
        setLoading(false);
  
        // 2) subscribe to any NEWER chats (created after firstVisible)
        if (firstVisible.current) {
          const liveQ = query(
            collection(db, "pts_chats"),
            // orderBy("updated_at", "desc"),
            orderBy("created_at", "asc"),
            // startAfter(firstVisible.current)
          );

          unsubscribeLive = onSnapshot(liveQ, async (liveSnap) => {

            if (!liveSnap.empty) {
                const incoming = await Promise.all(liveSnap.docs.map(hydrateChat));

                setChats((prev) => {
                  const prevMap = new Map(prev.map((chat) => [chat.id, chat]));
                  let hasChanged = false;
                
                  for (const chat of incoming) {
                        if (prevMap.has(chat.id)) {
                            // Only update if data is actually different (optional optimization)
                            const existing = prevMap.get(chat.id) as any;
                            if (
                                JSON.stringify(existing?.latestMessage) !== JSON.stringify(chat.latestMessage) ||
                                JSON.stringify(existing?.parent) !== JSON.stringify(chat.parent)
                            ) {
                                prevMap.set(chat.id, chat); // Update it
                                hasChanged = true;
                            }
                            } else {
                            prevMap.set(chat.id, chat); // Add new
                            hasChanged = true;
                        }
                    }
                    
                    if (!hasChanged) return prev;
                    
                        // Update firstVisible for pagination
                        firstVisible.current = liveSnap.docs[liveSnap.docs.length - 1];
                        
                        // Sort the final map by updated_at descending (if needed)
                        const sorted = Array.from(prevMap.values()).sort(
                            (a, b) => b.latestMessage?.timestamp?.seconds - a.latestMessage?.timestamp?.seconds
                        );
                        
                        return sorted;
                    });
                }
          });
          
        }
      })();
  
      return () => {
        unsubscribeLive?.();
        setChats([]);
      };
    }, []);
  
    // load more (older) when scrolled to bottom
    const loadMore = useCallback(async () => {
        // return;
      if (!lastVisible.current) return;
      setLoadingMore(true);
  
      const moreQ = query(
        collection(db, "pts_chats"),
        orderBy("created_at", "desc"),
        startAfter(lastVisible.current),
        limit(PAGE_SIZE)
      );
      const snap = await getDocs(moreQ);
      if (!snap.empty) {
        lastVisible.current = snap.docs[snap.docs.length - 1];
        const older = await Promise.all(snap.docs.map(hydrateChat));
        // append older (they come newest→oldest)
        setChats((prev) => [...prev, ...older]);
      }
  
      setLoadingMore(false);
    }, []);
  
    return { chats, loading, loadingMore, loadMore };
  }
  