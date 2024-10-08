import { ChatAppResponse, ChatAppResponseOrError, ChatAppRequest, Config } from "./models";
import { BACKEND_URI } from "./BACKEND_URI";

function getHeaders(): Record<string, string> {
    var headers: Record<string, string> = {
        "Content-Type": "application/json"
    };
    return headers;
}

export async function chatApi(request: ChatAppRequest): Promise<Response> {
    const body = JSON.stringify(request);
    return await fetch(`${BACKEND_URI}/ai`, {
        method: "POST",
        mode: "cors",
        headers: getHeaders(),
        body: body
    });
}

export function getCitationFilePath(citation: string): string {
    return `${BACKEND_URI}/content/${citation}`;
}

export const getSessions = async (): Promise<{ session_id: string; title: string }[]> => {
    const response = await fetch(`${BACKEND_URI}/session/list`); // Update this to match your API endpoint
    if (!response.ok) {
        if (response.status === 404) {
            console.log("API doesn't support Chat Session functionality.")
            return [];
        }
        throw new Error(`Failed to fetch sessions: ${response.statusText}`);
    }
    return response.json();
};

export const getSessionHistory = async (sessionId: string): Promise<{ history: { role: string; content: string }[] }> => {
    if (sessionId && sessionId != "1234") {
        const response = await fetch(`${BACKEND_URI}/session/load/${sessionId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (response.status === 404) {
            return { history: [] };
        }

        if (!response.ok) {
            throw new Error(`Failed to fetch session history: ${response.statusText}`);
        }

        return response.json();
    }
    return { history: [] };
};
