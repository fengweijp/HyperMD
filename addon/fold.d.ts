import * as CodeMirror from 'codemirror';
import { Addon, FlipFlop, TokenSeeker } from '../core';
import { TextMarker, Position, Token } from 'codemirror';
import { cm_t } from '../core/type';
/********************************************************************************** */
/**
 * 1. Check if `token` is a **BEGINNING TOKEN** of fold-able text (eg. "!" for images)
 * 2. Use `stream.findNext` to find the end of the text to be folded (eg. ")" or "]" of link/URL, for images)
 * 3. Compose a range `{from, to}`
 *    - `from` is always `{ line: stream.lineNo, ch: token.start }`
 * 4. Check if `stream.requestRange(from, to)` returns `RequestRangeResult.OK`
 *    - if not ok, return `null` immediately.
 * 5. Use `stream.cm.markText(from, to, options)` to fold text, and return the marker
 *
 * @param token current checking token. a shortcut to `stream.lineTokens[stream.i_token]`
 * @returns a TextMarker if folded.
 */
export declare type FolderFunc = (stream: FoldStream, token: CodeMirror.Token) => CodeMirror.TextMarker;
/** FolderFunc may use FoldStream to lookup for tokens */
export interface FoldStream {
    readonly cm: cm_t;
    readonly line: CodeMirror.LineHandle;
    readonly lineNo: number;
    readonly lineTokens: Token[];
    readonly i_token: number;
    /**
     * Find next Token that matches the condition AFTER current token (whose index is `i_token`), or a given position
     * This function will NOT make the stream precede!
     *
     * @param condition a RegExp to check token.type, or a function check the Token
     * @param maySpanLines by default the searching will not span lines
     */
    findNext(condition: RegExp | ((token: Token) => boolean), maySpanLines?: boolean, since?: Position): {
        lineNo: number;
        token: Token;
        i_token: number;
    };
    /**
     * In current line, find next Token that matches the condition SINCE the token with given index
     * This function will NOT make the stream precede!
     *
     * @param condition a RegExp to check token.type, or a function check the Token
     * @param i_token_since default: i_token+1 (the next of current token)
     */
    findNext(condition: RegExp | ((token: Token) => boolean), i_token_since: number): {
        lineNo: number;
        token: Token;
        i_token: number;
    };
    /**
     * Before creating a TextMarker, check if the range is good to use.
     *
     * Do NOT create TextMarker unless this returns `RequestRangeResult.OK`
     */
    requestRange(from: Position, to: Position): RequestRangeResult;
}
export declare enum RequestRangeResult {
    OK = "ok",
    CURSOR_INSIDE = "ci",
    HAS_MARKERS = "hm"
}
/********************************************************************************** */
export declare var builtinFolder: Record<string, FolderFunc>;
/********************************************************************************** */
/** break a TextMarker, move cursor to where marker is */
export declare function breakMark(cm: cm_t, marker: TextMarker, chOffset?: number): void;
/********************************************************************************** */
export interface Options extends Addon.AddonOptions {
    /** Fold Images */
    image: boolean;
    /** Fold Link URL */
    link: boolean;
    /** Enable TeX math folding. requires `fold-math` addon */
    math: boolean;
    /** Fold HTML. requires `fold-html` addon */
    html: boolean;
    /** User custom FolderFunc. All will be enabled. */
    customFolders: {
        [type: string]: FolderFunc;
    };
}
export declare const defaultOption: Options;
export declare const suggestedOption: Partial<Options>;
export declare type OptionValueType = Partial<Options> | boolean;
declare global {
    namespace HyperMD {
        interface EditorConfiguration {
            /**
             * Options for Fold.
             *
             * You may also provide a `false` to disable all built-in folders; a `true` to enable all of them.
             *
             * **NOTE: if a boolean is given, your `customFolders` will be cleared**
             */
            hmdFold?: OptionValueType;
        }
    }
}
/********************************************************************************** */
export declare class Fold extends TokenSeeker implements Addon.Addon, FoldStream {
    cm: cm_t;
    ff_builtin: {
        [type: string]: FlipFlop<boolean>;
    };
    customFolders: {
        [type: string]: FolderFunc;
    };
    customFolderTypes: string[];
    /** Folder's output goes here */
    folded: {
        [type: string]: CodeMirror.TextMarker[];
    };
    /** Update a builtin folder's status, and fold/unfold */
    setBuiltinStatus(type: string, status: boolean): void;
    constructor(cm: cm_t);
    /**
     * Check if a range is foldable and update _quickFoldHint
     *
     * NOTE: this function is always called after `_quickFoldHint` reset by `startFoldImmediately`
     */
    requestRange(from: Position, to: Position): RequestRangeResult;
    /**
     * Fold everything! (This is a debounced, and `this`-binded version)
     */
    startFold: {
        (): void;
        stop(): void;
    };
    /**
     * Fold everything!
     *
     * @param toLine last line to fold. Inclusive
     */
    startFoldImmediately(fromLine?: number, toLine?: number): void;
    /** stores every affected lineNo */
    private _quickFoldHint;
    /**
     * Start a quick fold: only process recent `requestRange`-failed ranges
     */
    startQuickFold(): void;
    /**
     * Clear one type of folded TextMarkers
     *
     * @param type builtin folder type ("image", "link" etc) or custom fold type
     */
    clear(type: string): void;
    /**
     * Clear all folding result
     */
    clearAll(): void;
}
/** ADDON GETTER (Singleton Pattern): a editor can have only one Fold instance */
export declare const getAddon: (cm: CodeMirror.Editor) => Fold;
declare global {
    namespace HyperMD {
        interface HelperCollection {
            Fold?: Fold;
        }
    }
}
