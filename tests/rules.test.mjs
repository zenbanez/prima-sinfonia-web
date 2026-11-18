// Security rules tests for WS-0068/D-003: teacher status comes only from
// /teachers/{uid}; sign-up makes students; nobody can change their own role.
// Synthetic users only. Run with: npm run test:rules
import { test, before, after, beforeEach } from 'node:test';
import { readFileSync } from 'node:fs';
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadString } from 'firebase/storage';

let env;

before(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-prima-sinfonia',
    firestore: { rules: readFileSync('firestore.rules', 'utf8') },
    storage: { rules: readFileSync('storage.rules', 'utf8') },
  });
});

after(async () => { await env.cleanup(); });

beforeEach(async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    // The owner: a real teacher, on the owner-set list
    await setDoc(doc(db, 'teachers/owner'), { grantedBy: 'admin-script' });
    await setDoc(doc(db, 'users/owner'), { uid: 'owner', name: 'Owner', role: 'teacher' });
    // A student
    await setDoc(doc(db, 'users/stu1'), { uid: 'stu1', name: 'Student One', role: 'student' });
    await setDoc(doc(db, 'lessons/l1'), { teacherId: 'owner', studentId: 'stu1' });
    await setDoc(doc(db, 'practice_sessions/p1'), { studentId: 'stu1' });
    // An attacker who already wrote role "teacher" into their own profile
    // (what the old rules allowed), but is not on the teacher list
    await setDoc(doc(db, 'users/mallory'), { uid: 'mallory', name: 'M', role: 'teacher' });
  });
});

const as = (uid) => env.authenticatedContext(uid).firestore();

test('sign-up as a student is allowed', async () => {
  await assertSucceeds(setDoc(doc(as('newkid'), 'users/newkid'), { uid: 'newkid', role: 'student' }));
});

test('sign-up as a teacher is refused', async () => {
  await assertFails(setDoc(doc(as('newkid'), 'users/newkid'), { uid: 'newkid', role: 'teacher' }));
});

test('a student cannot promote themselves to teacher', async () => {
  await assertFails(updateDoc(doc(as('stu1'), 'users/stu1'), { role: 'teacher' }));
});

test('a student can still edit their own profile', async () => {
  await assertSucceeds(updateDoc(doc(as('stu1'), 'users/stu1'), { name: 'Student 1' }));
});

test('nobody can write the teacher list from the app', async () => {
  await assertFails(setDoc(doc(as('mallory'), 'teachers/mallory'), { x: 1 }));
  await assertFails(setDoc(doc(as('owner'), 'teachers/stu1'), { x: 1 }));
});

test('a self-declared teacher cannot read other profiles', async () => {
  await assertFails(getDoc(doc(as('mallory'), 'users/stu1')));
  await assertFails(getDocs(collection(as('mallory'), 'users')));
});

test('a self-declared teacher cannot read practice sessions', async () => {
  await assertFails(getDoc(doc(as('mallory'), 'practice_sessions/p1')));
});

test('a self-declared teacher cannot create lessons or resources', async () => {
  await assertFails(setDoc(doc(as('mallory'), 'lessons/l2'), { teacherId: 'mallory', studentId: 'stu1' }));
  await assertFails(setDoc(doc(as('mallory'), 'resources/r1'), { title: 'x' }));
});

test('the verified teacher keeps her access', async () => {
  const db = as('owner');
  await assertSucceeds(getDoc(doc(db, 'users/stu1')));
  await assertSucceeds(getDocs(collection(db, 'users')));
  await assertSucceeds(getDoc(doc(db, 'practice_sessions/p1')));
  await assertSucceeds(getDoc(doc(db, 'lessons/l1')));
  await assertSucceeds(setDoc(doc(db, 'lessons/l2'), { teacherId: 'owner', studentId: 'stu1' }));
  await assertSucceeds(setDoc(doc(db, 'resources/r1'), { title: 'Scales' }));
});

test('the verified teacher cannot change her own role field away from teacher', async () => {
  await assertFails(updateDoc(doc(as('owner'), 'users/owner'), { role: 'student' }));
});

test('a student reads only their own profile and lessons', async () => {
  const db = as('stu1');
  await assertSucceeds(getDoc(doc(db, 'users/stu1')));
  await assertFails(getDoc(doc(db, 'users/owner')));
  await assertSucceeds(getDoc(doc(db, 'lessons/l1')));
});

test('signed-out callers get nothing', async () => {
  const db = env.unauthenticatedContext().firestore();
  await assertFails(getDoc(doc(db, 'users/stu1')));
  await assertFails(getDoc(doc(db, 'lessons/l1')));
});

test('storage: only the verified teacher uploads lesson files', async () => {
  const st = (uid) => env.authenticatedContext(uid).storage();
  await assertSucceeds(uploadString(ref(st('owner'), 'lessons/owner/scale.txt'), 'x'));
  await assertFails(uploadString(ref(st('mallory'), 'lessons/mallory/x.txt'), 'x'));
  await assertFails(uploadString(ref(st('mallory'), 'resources/x.txt'), 'x'));
  await assertSucceeds(uploadString(ref(st('owner'), 'resources/x.txt'), 'x'));
});
