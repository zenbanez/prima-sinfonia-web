// READ-ONLY audit (WS-0068/D-003). Lists every user whose profile says
// role "teacher", and whether they're on the owner-set /teachers list.
// Prints ids and counts only, no names or emails. Writes nothing.
//
// Run with the owner's own credentials:
//   gcloud auth application-default login
//   node scripts/audit-teachers.mjs --project prima-sinfonia
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const i = process.argv.indexOf('--project');
const projectId = i > 0 ? process.argv[i + 1] : '';
if (!projectId) {
  console.error('Usage: node scripts/audit-teachers.mjs --project <projectId>');
  process.exit(2);
}

initializeApp({ credential: applicationDefault(), projectId });
const db = getFirestore();

const claimed = await db.collection('users').where('role', '==', 'teacher').get();
const listed = new Set((await db.collection('teachers').get()).docs.map((d) => d.id));

let unlisted = 0;
console.log(`Profiles claiming role "teacher": ${claimed.size}`);
for (const d of claimed.docs) {
  const onList = listed.has(d.id);
  if (!onList) unlisted++;
  const created = d.get('createdAt')?.toDate?.()?.toISOString?.() ?? 'unknown';
  console.log(`  ${d.id}  on teacher list: ${onList ? 'yes' : 'NO'}  created: ${created}`);
}
console.log(`On the /teachers list: ${listed.size}`);
console.log(`Claiming teacher but NOT on the list: ${unlisted}`);
console.log('Nothing was changed.');
