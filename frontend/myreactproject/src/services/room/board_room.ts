const API_BASE = 'http://127.0.0.1:8000/api'; // або ваш реальний бекенд-ендпоінт

export async function createBoard(data: { name: string; room_id: string; avatar?: string }) {
    const res = await fetch(`${API_BASE}/boards/create/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return await res.json();
}

export async function deleteBoard(board_id: string) {
    const res = await fetch(`${API_BASE}/boards/delete/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ board_id }),
    });
    return await res.json();
}

export async function updateBoard(board_id: string, update: { name?: string; avatar?: string }) {
    const res = await fetch(`${API_BASE}/boards/update/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ board_id, ...update }),
    });
    return await res.json();
}

export async function getBoardInfo(board_id: string) {
    const res = await fetch(`${API_BASE}/boards/${board_id}/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    return await res.json();
}

export async function getRoomBoards(room_id: string) {
    const res = await fetch(`${API_BASE}/room_boards/${room_id}/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    return await res.json();
}

export async function getAllBoards() {
    const res = await fetch(`${API_BASE}/boards/all/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    return await res.json();
}
