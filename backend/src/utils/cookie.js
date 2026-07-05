import { randomUUID } from "crypto";


const COOKIE_NAME = "guestId";
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

// get existing cookie id or ceates a new one and sets it on res
export function getOrCreateCookieId(req, res) {
    const existing = req.cookies[COOKIE_NAME];

    if (existing) {
        return existing;
    }
    // no cookie yet, generate a random id
    const newId = randomUUID();

    res.cookies(COOKIE_NAME, newId, {
        maxAge: COOKIE_MAX_AGE,
        httpOnly: true,
        sameSite: "lax",
    });

    return newId;
}