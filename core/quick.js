/**
 * Ready-to-use functions that powers up your Markdown editor
 *
 * @internal Part of HyperMD core.
 *
 * You shall NOT import this file; please import "core" instead
 */

(function (mod){ //[HyperMD] UMD patched!
  /*commonjs*/  ("object"==typeof exports&&"undefined"!=typeof module) ? mod(null, exports, require("codemirror"), require("codemirror/addon/fold/foldcode"), require("codemirror/addon/fold/foldgutter"), require("codemirror/addon/fold/markdown-fold"), require("codemirror/addon/edit/closebrackets"), require("codemirror/lib/codemirror.css"), require("codemirror/addon/fold/foldgutter.css"), require("../theme/hypermd-light.css")) :
  /*amd*/       ("function"==typeof define&&define.amd) ? define(["require","exports","codemirror","codemirror/addon/fold/foldcode","codemirror/addon/fold/foldgutter","codemirror/addon/fold/markdown-fold","codemirror/addon/edit/closebrackets","codemirror/lib/codemirror.css","codemirror/addon/fold/foldgutter.css","../theme/hypermd-light.css"], mod) :
  /*plain env*/ mod(null, (this.HyperMD = this.HyperMD || {}), CodeMirror);
})(function (require, exports, CodeMirror) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * The default configuration that used by `HyperMD.fromTextArea`
     *
     * Addons may update this object freely!
     */
    exports.suggestedEditorConfig = {
        lineNumbers: true,
        lineWrapping: true,
        theme: "hypermd-light",
        mode: "text/x-hypermd",
        tabSize: 4,
        autoCloseBrackets: true,
        foldGutter: true,
        gutters: [
            "CodeMirror-linenumbers",
            "CodeMirror-foldgutter",
            "HyperMD-goback" // (addon: click) 'back' button for footnotes
        ],
    };
    /**
     * Initialize an editor from a <textarea>
     * Calling `CodeMirror.fromTextArea` with recommended HyperMD options
     *
     * @see CodeMirror.fromTextArea
     *
     * @param {HTMLTextAreaElement} textArea
     * @param {object} [config]
     * @returns {cm_t}
     */
    function fromTextArea(textArea, config) {
        var final_config = Object.assign({}, exports.suggestedEditorConfig, config);
        var cm = CodeMirror.fromTextArea(textArea, final_config);
        return cm;
    }
    exports.fromTextArea = fromTextArea;
    /**
     * Turn HyperMD editor into to a normal editor
     *
     * Disable HyperMD visual effects.
     * Interactive addons like click or paste are not affected.
     *
     * @param {cm_t} editor Created by **HyperMD.fromTextArea**
     * @param {string} [theme]
     */
    function switchToNormal(editor, theme) {
        editor.setOption('theme', theme || "default");
        editor.setOption('hmdFold', false); // unfold all folded parts
        editor.setOption('hmdHideToken', false); // stop hiding tokens
        editor.setOption('hmdTableAlign', false); // stop aligining table columns
    }
    exports.switchToNormal = switchToNormal;
    /**
     * Revert what `HyperMD.switchToNormal` does
     *
     * @param {cm_t} editor Created by **HyperMD.fromTextArea**
     * @param {string} [theme]
     */
    function switchToHyperMD(editor, theme) {
        editor.setOption('theme', theme || 'hypermd-light');
        editor.setOption('hmdFold', true);
        editor.setOption('hmdHideToken', true);
        editor.setOption('hmdTableAlign', true);
    }
    exports.switchToHyperMD = switchToHyperMD;
});
