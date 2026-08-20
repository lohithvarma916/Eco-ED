import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "server", "user_data");

type UserEvent = {
  type: string;
  timestamp: string;
  payload?: Record<string, any>;
};

type UserDataFile = {
  userId: string;
  createdAt: string;
  profile?: {
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    role?: string | null;
  };
  state: {
    challengesJoined: Array<{ challengeId: string; joinedAt: string }>;
    submissions: Array<{ id: string; challengeId: string; submittedAt: string }>;
    posts: Array<{ id: string; title: string; createdAt: string }>;
  };
  events: UserEvent[];
};

async function ensureDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {}
}

function userFilePath(userId: string): string {
  return path.join(DATA_DIR, `${userId}.json`);
}

export async function ensureUserFile(user: {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  role?: string | null;
}) {
  await ensureDir();
  const file = userFilePath(user.id);
  try {
    await fs.access(file);
    return;
  } catch {}

  const now = new Date().toISOString();
  const initial: UserDataFile = {
    userId: user.id,
    createdAt: now,
    profile: {
      email: user.email ?? null,
      firstName: user.firstName ?? null,
      lastName: user.lastName ?? null,
      role: (user as any).role ?? null,
    },
    state: {
      challengesJoined: [],
      submissions: [],
      posts: [],
    },
    events: [
      { type: "user.created", timestamp: now, payload: { role: (user as any).role ?? null } },
    ],
  };

  await fs.writeFile(file, JSON.stringify(initial, null, 2), "utf8");
}

async function read(userId: string): Promise<UserDataFile> {
  await ensureDir();
  const file = userFilePath(userId);
  try {
    const json = await fs.readFile(file, "utf8");
    return JSON.parse(json);
  } catch {
    const now = new Date().toISOString();
    const data: UserDataFile = {
      userId,
      createdAt: now,
      state: { challengesJoined: [], submissions: [], posts: [] },
      events: [],
    } as any;
    await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
    return data;
  }
}

async function write(userId: string, data: UserDataFile) {
  const file = userFilePath(userId);
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
}

export async function appendEvent(userId: string, event: UserEvent) {
  const data = await read(userId);
  data.events.push(event);
  await write(userId, data);
}

export async function recordChallengeJoin(userId: string, challengeId: string) {
  const data = await read(userId);
  const now = new Date().toISOString();
  data.state.challengesJoined.push({ challengeId, joinedAt: now });
  data.events.push({ type: "challenge.joined", timestamp: now, payload: { challengeId } });
  await write(userId, data);
}

export async function recordSubmission(
  userId: string,
  payload: { id: string; challengeId: string; submittedAt?: string }
) {
  const data = await read(userId);
  const now = new Date().toISOString();
  data.state.submissions.push({ id: payload.id, challengeId: payload.challengeId, submittedAt: payload.submittedAt || now });
  data.events.push({ type: "submission.created", timestamp: now, payload });
  await write(userId, data);
}

export async function recordForumPost(
  userId: string,
  payload: { id: string; title: string; createdAt?: string }
) {
  const data = await read(userId);
  const now = new Date().toISOString();
  data.state.posts.push({ id: payload.id, title: payload.title, createdAt: payload.createdAt || now });
  data.events.push({ type: "forum.post.created", timestamp: now, payload });
  await write(userId, data);
}

export async function readUserData(userId: string): Promise<UserDataFile> {
  return await read(userId);
}

export async function removeSubmission(userId: string, submissionId: string) {
  const data = await read(userId);
  const now = new Date().toISOString();
  data.state.submissions = data.state.submissions.filter(s => s.id !== submissionId);
  data.events.push({ type: "submission.deleted", timestamp: now, payload: { id: submissionId } });
  await write(userId, data);
}

export async function removeForumPost(userId: string, postId: string) {
  const data = await read(userId);
  const now = new Date().toISOString();
  data.state.posts = data.state.posts.filter(p => p.id !== postId);
  data.events.push({ type: "forum.post.deleted", timestamp: now, payload: { id: postId } });
  await write(userId, data);
}


