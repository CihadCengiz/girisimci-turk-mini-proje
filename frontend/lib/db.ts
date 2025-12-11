import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "db", "db.json");

type User = {
    id: string;
    username: string;
    password: string;
    role: "user" | "instructor" | "admin";
    courseAccess: string[];
    email: string;
    available?: boolean;
    field?: string[];
};

export type Course = {
    id: string;
    title: string;
    description: string;
    instructorId: string;
    instructorName?: string;
    price: number;
    priceId: string;
    currency: string;
    userCourseAccess?: boolean;
    field: string[];
};

type Payment = {
    id: string;
    userId: string;
    amount_total: string;
    createdAt: string;
    productPriceId: string;
};

export type LiveCourseRequest = {
    id: string;
    fieldName: string;
    topicName: string;
    createdAt: string;
    userId: string;
    instructorId: string;
    instructorName?: string;
    userName?: string;
    status: string;
};

type DBData = {
    users: User[];
    admins: { adminId: string; }[];
    instructors: { instructorId: string; }[];
    courses: Course[];
    payments: Payment[];
    liveCourseRequests: LiveCourseRequest[];
};

// Read the database
export const readDb = async (): Promise<DBData> => {
    const data = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(data);
};

// Write to the database
export const writeDb = (data: DBData) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
};

// Save instructor's response to live course requests
export const handleInstructorLiveCourseResponse = async (requestId: string, instructorResponse: boolean) => {
    const db = await readDb();
    const requestIndex = db.liveCourseRequests.findIndex((request) => request.id === requestId);
    if (requestIndex === -1) {
        throw new Error("REQUEST_NOT_FOUND");
    }
    db.liveCourseRequests[requestIndex].status = instructorResponse ? "Approved" : "Declined";
    writeDb(db);
    return { success: true };
};

// Get courses list with user access info
export const getCourses = async (userCookies: { name: string, value: string; }): Promise<Course[]> => {
    const db = await readDb();
    const userEmail = JSON.parse(userCookies.value).email;
    const userCourseAccess = await findUserByEmail(userEmail).then(user => user?.courseAccess);
    const courseData = db.courses.map((course: Course) => ({
        ...course,
        instructorName: db.users.find((user: User) => user.id === course.instructorId)?.username || "Unknown",
        userCourseAccess: userCourseAccess?.includes(course.id),
    }));
    return courseData;
};

// Get live course requests list for a user
export const getUserLiveCourseRequests = async (userCookies: { name: string, value: string; }): Promise<LiveCourseRequest[]> => {
    const db = await readDb();
    const userEmail = JSON.parse(userCookies.value).email;
    const userId = await findUserByEmail(userEmail).then(user => user?.id);
    const liveCourseRequestsList = db.liveCourseRequests.filter(request => request.userId === userId);
    const userLiveCourseRequests = liveCourseRequestsList.map((request) => ({
        ...request,
        instructorName: db.users.find((user: User) => user.id === request.instructorId)?.username || "Unknown",
    }));
    return userLiveCourseRequests;
};

// Get live course requests list for an instructor
export const getInstructorLiveCourseRequests = async (instructorCookies: { name: string, value: string; }): Promise<LiveCourseRequest[]> => {
    const db = await readDb();
    const instructorEmail = JSON.parse(instructorCookies.value).email;
    const instructorId = await findUserByEmail(instructorEmail).then(user => user?.id);
    const liveCourseRequestsList = db.liveCourseRequests.filter(request => request.instructorId === instructorId);
    const instructorLiveCourseRequests = liveCourseRequestsList.map((request) => ({
        ...request,
        userName: db.users.find((user: User) => user.id === request.userId)?.username || "Unknown",
    }));
    return instructorLiveCourseRequests;
};

// Create a new live course request
const createLiveCourseRequest = async (fieldName: string, topicName: string, userId: string, instructorId: string) => {
    const db = await readDb();
    const newRequest = { id: (db.liveCourseRequests.length + 1).toString(), fieldName: fieldName, topicName: topicName, createdAt: new Date().toISOString(), userId: userId, instructorId: instructorId, status: "Pending" };
    db.liveCourseRequests.push(newRequest);
    db.users.find((user) => user.id === instructorId)!.available = false;
    writeDb(db);
    return newRequest;
};

// Handle live course request by matching with available instructors
export const liveCourseRequestHandler = async (fieldName: string, topicName: string, userId: string) => {
    const db = await readDb();
    const availableInstructors = db.users.filter((user) => user.role === "instructor" && user.available);
    if (availableInstructors.length === 0) {
        throw new Error("NO_INSTRUCTORS_AVAILABLE");
    }
    // Find the Top Match: Instructors matching both field and topic
    const topMatch = availableInstructors.filter((instructor) => {
        return instructor?.field?.includes(fieldName) && instructor.field.includes(topicName);
    });
    if (topMatch.length > 0) {
        await createLiveCourseRequest(fieldName, topicName, userId, topMatch[0].id);
        return { matchedInstructor: topMatch[0] };
    }
    // Find Field Match: Instructors matching only the field
    const fieldMatch = availableInstructors.filter((instructor) => {
        return instructor?.field?.includes(fieldName);
    });
    if (fieldMatch.length > 0) {
        await createLiveCourseRequest(fieldName, topicName, userId, fieldMatch[0].id);
        return { matchedInstructor: fieldMatch[0] };
    }
    throw new Error("NO_INSTRUCTORS_AVAILABLE");
};

// Find user by email
export const findUserByEmail = async (email: string) => {
    const db = await readDb();
    return db.users.find((user) => user.email === email);
};

// User login
export const login = async (params: {
    email: string;
    password: string;
}) => {
    const { email, password } = params;
    await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
};

// User signup
export const signup = async (params: {
    email: string;
    username: string;
    password: string;
}) => {
    const { email, username, password } = params;
    const db = await readDb();

    if (db.users.some((user) => user.email === email)) {
        throw new Error("EMAIL_TAKEN");
    }

    // Create new user object
    const newUser: User = {
        id: (db.users.length + 1).toString(),
        email: email,
        username: username,
        password: password,
        role: "user",
        courseAccess: [],
    };

    db.users.push(newUser);
    writeDb(db);

    return newUser;
};

// Update payments and grant course access
export const updatePayments = async (params: {
    amount_total: string;
    createdAt: Date;
    productPriceId: string;
    userEmail: string;
}) => {
    const { amount_total, createdAt, productPriceId, userEmail } = params;
    const db = await readDb();
    const user = db.users.find((user) => user.email === userEmail);
    const course = db.courses.find((course) => course.priceId === productPriceId);

    if (!user) {
        throw new Error("USER_NOT_FOUND");
    }
    const userIndex = db.users.findIndex((u) => u.id === user.id); // Get user index for updating course access

    if (!course) {
        throw new Error("COURSE_NOT_FOUND");
    }

    if (db.payments.some((payment) => payment.productPriceId === productPriceId && payment.userId === user.id)) {
        throw new Error("PAYMENT_ALREADY_EXISTS");
    }

    // Create new payment
    const newPayment: Payment = {
        id: (db.payments.length + 1).toString(),
        userId: user.id,
        amount_total: amount_total,
        createdAt: createdAt.toISOString(),
        productPriceId: productPriceId,
    };

    db.payments.push(newPayment);
    db.users[userIndex].courseAccess.push(course.id); // Grant course access to user
    writeDb(db);

    return newPayment;
};