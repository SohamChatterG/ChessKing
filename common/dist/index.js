"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpInput = exports.signInInput = void 0;
const zod_1 = __importDefault(require("zod"));
const signUpInput = zod_1.default.object({
    username: zod_1.default.string(),
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(8)
});
exports.signUpInput = signUpInput;
const signInInput = zod_1.default.object({
    // Both email and username are marked as optional using z.string().optional().
    email: zod_1.default.string().email().optional(),
    username: zod_1.default.string().optional(),
    password: zod_1.default.string().min(8)
}); // The refine method is used to enforce that at least one of the fields (email or username) must be provided.
exports.signInInput = signInInput;
