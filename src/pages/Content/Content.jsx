import React, { useState } from "react";
import Header from "../../layouts/partials/header";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { ClassicEditor, Essentials, Paragraph, Bold, Italic } from "ckeditor5";
import "ckeditor5/ckeditor5.css";

const Content = () => {
  const [editorHtml, setEditorHtml] = useState("");
  const [selectedContent, setSelectedContent] = useState("aboutApp");
  const handleEditorChange = (value) => {
    setEditorHtml(value);
  };

  var toolbarOptions = [
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],

    [{ header: 1 }, { header: 2 }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }][{ direction: "rtl" }],

    [{ size: ["small", false, "large", "huge"] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],

    ["clean"],
  ];

  const modules = {
    toolbar: {
      container: toolbarOptions,
    },
  };
  return (
    <div>
      <Header header={"Manage content"} />
      <div className="max-w-screen-2xl mx-auto">
        <div className="mx-4 sm:mx-9 my-3">
          <div className="flex flex-wrap gap-4 justify-start bg-white px-4 py-2">
            <button
              className={`rounded-md w-full sm:w-auto text-sm px-6 py-2 font-medium capitalize ${
                selectedContent === "privacyPolicy"
                  ? "bg-primary text-white"
                  : "border text-primary"
              }`}
              onClick={() => setSelectedContent("privacyPolicy")}
            >
              Privacy Policy
            </button>
            <button
              className={`rounded-md w-full sm:w-auto text-sm px-6 py-2 font-medium capitalize ${
                selectedContent === "termsConditions"
                  ? "bg-primary text-white"
                  : "border text-primary"
              }`}
              onClick={() => setSelectedContent("termsConditions")}
            >
              Terms and Conditions
            </button>
          </div>
          <div className="space-y-2 my-3">
            <CKEditor
              editor={ClassicEditor}
              config={{
                licenseKey: "GPL",
                plugins: [Essentials, Paragraph, Bold, Italic],
                toolbar: ["undo", "redo", "|", "bold", "italic", "|"],
              }}
              data="<p>Start typing here...</p>"
              onChange={(event, editor) => {
                const data = editor.getData();
                console.log(data);
              }}
            />

            <button
              className="inline-flex my-5 text-white justify-center rounded-md border border-transparent bg-primary
         w-1/3 bg-opacity-25 px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 "
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
