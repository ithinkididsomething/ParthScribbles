import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Connection state tracker
export let isCloudConnected = false;

export async function testFirestoreConnection(): Promise<{ connected: boolean; latencyMs?: number; error?: string }> {
  const start = performance.now();
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    isCloudConnected = true;
    const latencyMs = Math.round(performance.now() - start);
    return { connected: true, latencyMs };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('the client is offline')) {
      console.warn('Firestore is running in local offline cache mode.');
      isCloudConnected = false;
      return { connected: false, error: 'Offline mode active' };
    }
    // Any other response like doc not found still means connection reached Firestore!
    isCloudConnected = true;
    return { connected: true, latencyMs: Math.round(performance.now() - start) };
  }
}

// Initial probe on startup
testFirestoreConnection().catch(() => {});
