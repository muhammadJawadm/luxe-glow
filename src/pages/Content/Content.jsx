import React, { useState, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { ClassicEditor, Essentials, Paragraph, Bold, Italic, Heading, List, Link, BlockQuote, Underline, Strikethrough, Font, Alignment } from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import Header from "../../layouts/partials/header";
import { fetchContentByType, saveContent } from "../../services/contentServices";
import { FiFileText, FiSave, FiCheck, FiAlertCircle } from "react-icons/fi";

const Content = () => {
  const [selectedContent, setSelectedContent] = useState("privacyPolicy");
  const [editorData, setEditorData] = useState("<p>Start typing here...</p>");
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadContent();
  }, [selectedContent]);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const type = selectedContent === "privacyPolicy" ? "privacy" : "terms";
      const data = await fetchContentByType(type);
      
      if (data) {
        setContent(data);
        setEditorData(data.description || "<p>Start typing here...</p>");
      } else {
        // No content exists yet
        setContent(null);
        setEditorData("<p>Start typing here...</p>");
      }
    } catch (err) {
      console.error('Error loading content:', err);
      setContent(null);
      setEditorData("<p>Start typing here...</p>");
      // Don't show error for missing content
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const type = selectedContent === "privacyPolicy" ? "privacy" : "terms";
      const savedContent = await saveContent(type, editorData, content?.id);
      
      setContent(savedContent);
      const contentName = selectedContent === "privacyPolicy" ? "Privacy Policy" : "Terms & Conditions";
      setSuccessMessage(`${contentName} saved successfully!`);

      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error saving content:', err);
      setError('Failed to save content. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleContentTypeChange = (type) => {
    setSelectedContent(type);
    setSuccessMessage(null);
    setError(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
 
  return (
    <div>
      <Header header={"Manage Content"} />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-6">
        
        {/* Info Card */}
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FiFileText className="text-primary text-xl flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">Manage Legal Content</h3>
              <p className="text-sm text-gray-600">
                Edit and update your app's Privacy Policy and Terms & Conditions. Changes are saved to the database and displayed in your application.
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-800 px-6 py-4 rounded-lg mb-4 flex items-center gap-3 shadow-sm">
            <FiCheck className="text-green-600 text-xl flex-shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-6 py-4 rounded-lg mb-4 flex items-center gap-3 shadow-sm">
            <FiAlertCircle className="text-red-600 text-xl flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          {/* Header with Tabs */}
          <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
              <FiFileText className="text-lg" />
              Content Editor
            </h2>
            
            {/* Content Type Selection Tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                className={`rounded-lg px-6 py-2.5 font-medium transition-all ${
                  selectedContent === "privacyPolicy"
                    ? "bg-white text-primary shadow-md"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
                onClick={() => handleContentTypeChange("privacyPolicy")}
                disabled={loading || saving}
              >
                Privacy Policy
              </button>
              <button
                className={`rounded-lg px-6 py-2.5 font-medium transition-all ${
                  selectedContent === "termsConditions"
                    ? "bg-white text-primary shadow-md"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
                onClick={() => handleContentTypeChange("termsConditions")}
                disabled={loading || saving}
              >
                Terms & Conditions
              </button>
            </div>
          </div>

          {/* Editor Section */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 font-medium">Loading content...</p>
                </div>
              </div>
            ) : (
              <>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {selectedContent === "privacyPolicy" ? "Privacy Policy Content" : "Terms & Conditions Content"}
                </label>
                
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <CKEditor
                    editor={ClassicEditor}
                    config={{
                      licenseKey: "GPL",
                      plugins: [
                        Essentials, 
                        Paragraph, 
                        Bold, 
                        Italic, 
                        Underline, 
                        Strikethrough,
                        Heading, 
                        List, 
                        Link, 
                        BlockQuote,
                        Font,
                        Alignment
                      ],
                      toolbar: [
                        "undo", "redo", "|",
                        "heading", "|",
                        "bold", "italic", "underline", "strikethrough", "|",
                        "fontSize", "fontFamily", "fontColor", "fontBackgroundColor", "|",
                        "bulletedList", "numberedList", "|",
                        "alignment", "|",
                        "link", "blockQuote"
                      ],
                      heading: {
                        options: [
                          { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                          { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                          { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                          { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
                        ]
                      }
                    }}
                    data={editorData}
                    onChange={(_event, editor) => {
                      const data = editor.getData();
                      setEditorData(data);
                    }}
                  />
                </div>

                {/* Footer with Save Button and Last Updated */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-2 text-white justify-center rounded-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 px-6 py-3 font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiSave className="text-lg" />
                        Save Changes
                      </>
                    )}
                  </button>
                  
                  {content?.created_at && (
                    <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                      <span className="text-sm text-gray-600">
                        Last updated: <span className="font-semibold text-gray-900">{formatDate(content.created_at)}</span>
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;