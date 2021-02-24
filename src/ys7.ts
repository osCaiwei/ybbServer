import fetch from 'node-fetch';
import qs from 'querystring';
import fs from 'fs';
import util from 'util';
import { config } from './config';
const BASE_URL = 'https://open.ys7.com/api/lapp/';

const TOKEN_PATH = 'access_token.tk';
const RAM_TOKEN_PATH = 'ram_token.tk';

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
type Token = {
    expireTime: number;
    accessToken: string;
};
let access_token: Token | undefined;
let ram_token: Token | undefined;

async function getToken(): Promise<string> {
    if (!access_token) {
        try {
            console.log('read token from file');
            access_token = JSON.parse(
                await readFile(TOKEN_PATH, { encoding: 'utf-8' }),
            );
        } catch (e) {
            console.log('read token from file fail', e);
        }
    }
    const ts = new Date().getTime();
    if (access_token && access_token.expireTime > ts + 24 * 3600 * 1000) {
        return access_token.accessToken;
    }
    // get token from server
    const url = `${BASE_URL}token/get`;
    try {
        const resp = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                appKey: config.ys7AppKey,
                appSecret: config.ys7AppSecret,
            }),
        });
        const jsonData = await resp.json();
        console.log('token/get', jsonData);
        if (jsonData?.data?.accessToken) {
            await writeFile(TOKEN_PATH, JSON.stringify(jsonData.data), {
                encoding: 'utf-8',
            });
            return jsonData.data.accessToken;
        }
    } catch (e) {
        console.log(e);
    }
    return '';
}

export async function getRamToken(): Promise<Token | null> {
    if (!ram_token) {
        try {
            console.log('read ram token from file');
            ram_token = JSON.parse(
                await readFile(RAM_TOKEN_PATH, { encoding: 'utf-8' }),
            );
        } catch (e) {
            console.log('read ram token from file fail', e);
        }
    }
    const ts = new Date().getTime();
    if (ram_token && ram_token.expireTime > ts + 24 * 3600 * 1000) {
        return ram_token;
    }
    const token = await getToken();
    console.log('getToken', token);
    if (!token) {
        return null;
    }
    const url = `${BASE_URL}ram/token/get`;
    try {
        const resp = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify({
                accessToken: token,
                accountId: config.ys7RamAccountId,
            }),
        });
        const jsonData = await resp.json();
        console.log('ram/token/get', jsonData);
        if (jsonData?.data?.accessToken) {
            await writeFile(RAM_TOKEN_PATH, JSON.stringify(jsonData.data), {
                encoding: 'utf-8',
            });
            ram_token = jsonData.data;
            return jsonData.data;
        }
    } catch (e) {
        console.log(e);
    }
    return null;
}
