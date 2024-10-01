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

export const getSessions = async (): Promise<{ sessions: { session_id: string; title: string }[] }> => {
    const response = await fetch(`${BACKEND_URI}/sessions`); // Update this to match your API endpoint
    if (!response.ok) {
        throw new Error(`Failed to fetch sessions: ${response.statusText}`);
    }
    return response.json();
};

export const getSessionHistory = async (sessionId: string): Promise<{ chat_history: { role: string; content: string }[] }> => {
    const response = await fetch(`${BACKEND_URI}/sessions/load`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId })
    });

    if (response.status === 404) {
        return { chat_history: [] };
    }

    if (!response.ok) {
        throw new Error(`Failed to fetch session history: ${response.statusText}`);
    }

    return response.json();
};
