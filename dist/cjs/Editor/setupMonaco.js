"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupMonaco = setupMonaco;
exports.getMonacoSetup = getMonacoSetup;
const createStore_1 = require("../createStore");
const store = (0, createStore_1.createStore)();
function setupMonaco(options) {
    store.setValue('monacoSetup', options);
}
function getMonacoSetup() {
    return store.getValue('monacoSetup') || {};
}
