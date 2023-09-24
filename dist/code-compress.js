"use strict";
function codeCompressForURI(code) {
    const prefix = '1-';
    code = arrayBufferToBase64(LZMA.compress(code, 1));
    code = encodeURIComponent(code);
    return prefix + code;
}
function codeDecompressFromURI(code) {
    const prefix = '1-';
    if (code.startsWith(prefix)) {
        code = code.substr(prefix.length);
    }
    else {
        throw 'codeDecompressFromURI: Prefix not supported!';
    }
    code = decodeURIComponent(code);
    return LZMA.decompress(base64ToArrayBuffer(code));
}
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}
function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}
