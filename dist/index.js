"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createApp_1 = __importDefault(require("./createApp"));
const app = (0, createApp_1.default)();
const PORT = 3000;
app.listen(PORT, () => {
    console.log('ticket server listening on port: ', PORT);
});
