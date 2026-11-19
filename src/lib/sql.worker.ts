/// <reference lib="webworker" />
import initSqlJs, { type Database, type SqlJsStatic, type QueryExecResult } from 'sql.js';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';

type Msg =
    | { id: number; type: 'init' }
    | { id: number; type: 'create'; handle: string; schema: string }
    | { id: number; type: 'run'; handle: string; sql: string; forbidden?: string[] }
    | { id: number; type: 'evaluate'; schema: string; sql: string }
    | { id: number; type: 'close'; handle: string };

let SQL: SqlJsStatic | null = null;
const databases = new Map<string, Database>();

const DANGEROUS =
    /\b(DROP|DELETE|UPDATE|INSERT|ALTER|ATTACH|DETACH|PRAGMA|VACUUM|REINDEX)\b/i;
const CREATE_TABLE = /\bCREATE\s+(?!TEMP(ORARY)?\s+TABLE)\w+/i;

function assertSafe(text: string, forbidden: string[] = []) {
    if (DANGEROUS.test(text)) {
        throw new Error('В песочнице разрешены только SELECT-запросы (без DDL/DML).');
    }
    if (CREATE_TABLE.test(text)) {
        throw new Error('Создание постоянных таблиц запрещено. Используйте CREATE TEMP TABLE.');
    }
    for (const pattern of forbidden) {
        if (new RegExp(pattern, 'i').test(text)) {
            throw new Error('Запрос содержит запрещённую конструкцию.');
        }
    }
}

self.onmessage = async (e: MessageEvent<Msg>) => {
    const msg = e.data;
    try {
        if (msg.type === 'init') {
            if (!SQL) {
                SQL = await initSqlJs({ locateFile: () => wasmUrl });
            }
            self.postMessage({ id: msg.id, ok: true });
            return;
        }

        if (!SQL) throw new Error('SQL.js не инициализирован');

        if (msg.type === 'create') {
            const db = new SQL.Database();
            if (msg.schema) db.run(msg.schema);
            databases.set(msg.handle, db);
            self.postMessage({ id: msg.id, ok: true });
            return;
        }

        if (msg.type === 'run') {
            const db = databases.get(msg.handle);
            if (!db) throw new Error('БД не найдена');
            assertSafe(msg.sql, msg.forbidden);
            const results: QueryExecResult[] = db.exec(msg.sql);
            self.postMessage({ id: msg.id, ok: true, results });
            return;
        }

        if (msg.type === 'evaluate') {
            // Свежая БД с той же схемой — для эталонного ответа
            const db = new SQL.Database();
            try {
                db.run(msg.schema);
                const results: QueryExecResult[] = db.exec(msg.sql);
                self.postMessage({ id: msg.id, ok: true, results });
            } finally {
                db.close();
            }
            return;
        }

        if (msg.type === 'close') {
            const db = databases.get(msg.handle);
            if (db) {
                db.close();
                databases.delete(msg.handle);
            }
            self.postMessage({ id: msg.id, ok: true });
            return;
        }
    } catch (err) {
        self.postMessage({
            id: msg.id,
            ok: false,
            error: err instanceof Error ? err.message : String(err),
        });
    }
};

export { };