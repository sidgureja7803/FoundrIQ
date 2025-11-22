// ibmWatsonxClient.js
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const IBM_API_KEY = process.env.IBM_API_KEY;
const WATSONX_URL = process.env.WATSONX_URL;
const WATSONX_PROJECT_ID = process.env.WATSONX_PROJECT_ID;
const WATSONX_MODEL_ID = process.env.WATSONX_MODEL_ID;

if (!IBM_API_KEY || !WATSONX_URL || !WATSONX_PROJECT_ID || !WATSONX_MODEL_ID) {
    throw new Error("Missing IBM watsonx environment variables");
}

// In-memory cache of token + expiry
let cachedToken = null;
let tokenExpiry = 0; // unix seconds

async function getIamToken() {
    const url = "https://iam.cloud.ibm.com/identity/token";

    const body =
        "grant_type=urn:ibm:params:oauth:grant-type:apikey" +
        `&apikey=${encodeURIComponent(IBM_API_KEY)}`;

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
        },
        body,
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error("Failed to get IAM token: " + text);
    }

    const data = await res.json(); // { access_token, expires_in, ... }
    const now = Math.floor(Date.now() / 1000);

    cachedToken = data.access_token;
    tokenExpiry = now + data.expires_in; // usually 3600 seconds

    return cachedToken;
}

// Always use a valid token (auto-refresh 60s before expiry)
async function getValidToken() {
    const now = Math.floor(Date.now() / 1000);
    if (!cachedToken || now > tokenExpiry - 60) {
        return await getIamToken();
    }
    return cachedToken;
}

/**
 * Call the Granite chat endpoint
 * @param {Array<{role: "user" | "assistant" | "system", content: string}>} messages
 */
export async function callGraniteChat(messages) {
    const accessToken = await getValidToken();

    const url = `${WATSONX_URL}/ml/v1/text/chat?version=2023-05-29`;

    const body = {
        messages,
        project_id: WATSONX_PROJECT_ID,
        model_id: WATSONX_MODEL_ID,
        max_tokens: 2000,
        temperature: 0.3,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: [],
    };

    const res = await fetch(url, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error("Granite request failed: " + text);
    }

    const data = await res.json();
    return data;
}
