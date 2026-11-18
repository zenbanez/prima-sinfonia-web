// Grants teacher status by adding /teachers/{uid} (WS-0068/D-003). This is
// the only way to become a teacher once the new rules are deployed.
// It must run before the rules deploy, for the owner's own uid, or the owner
// loses teacher access.
//
// Run with the owner's own credentials:
//   gcloud auth application-default login
//   node scripts/grant-teacher.mjs --project prima-sinfonia --uid <uid> --confirm "grant <uid>"
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : '';
};
const projectId = arg('project');
const uid = arg('uid');
const confirm = arg('confirm');
if (!projectId || !uid) {
  console.error('Usage: node scripts/grant-teacher.mjs --project <projectId> --uid <uid> --confirm "grant <uid>"');
  process.exit(2);
}
if (confirm !== `grant ${uid}`) {
  console.error(`Refused: --confirm must be exactly "grant ${uid}"`);
  process.exit(2);
}

initializeApp({ credential: applicationDefault(), projectId });
const db = getFirestore();

const profile = await db.doc(`users/${uid}`).get();
if (!profile.exists) {
  console.error(`Refused: no profile users/${uid}`);
  process.exit(1);
}
const ref = db.doc(`teachers/${uid}`);
if ((await ref.get()).exists) {
  console.log(`${uid} is already on the teacher list. Nothing changed.`);
  process.exit(0);
}
await ref.set({ grantedAt: FieldValue.serverTimestamp(), grantedBy: 'grant-teacher.mjs' });
console.log(`Granted teacher status to ${uid}.`);
