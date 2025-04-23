import { LuCopy, LuDownload } from "react-icons/lu";
import { FaArrowsRotate } from "react-icons/fa6";
import ReactMarkdown from "react-markdown";
import { MathJaxContext, MathJax } from "better-react-mathjax";
import toast from "react-hot-toast";
import Loading from "../Layout/Loading";

const GeneratedQuestions = ({  generatedResponse, onRegenerate, isLoading, title, renderDownloadPDFButton }) => {
  // Fallback static questions rendered as markdown
  const defaultQuestionsText = title;


  // Copy to clipboard handler
  const copyToClipboard = () => {
    const text = generatedResponse || defaultQuestionsText;
    navigator.clipboard.writeText(text);
    toast.success("Questions copied to clipboard!");
  };

  // Regenerate handler: if an onRegenerate callback is provided, use it; otherwise, show an alert.
  const regenerateQuestions = () => {
    if (onRegenerate) {
      onRegenerate();
    } else {
      alert("Regeneration not implemented.");
    }
  };

    const downloadAsPDF = () => {
      // Simple download as PDF using a blob. For production use a proper PDF generator.
      const element = document.createElement("a");
      const file = new Blob([generatedResponse], { type: "application/pdf" });
      element.href = URL.createObjectURL(file);
      element.download = "lesson-plan.pdf";
      document.body.appendChild(element);
      element.click();
    };
  

  return (
      <div className="bg-white shadow-md px-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          Generated Assignment Questions
        </h2>

        <div className="border p-4 rounded-lg space-y-4">
          {generatedResponse ? (
            <MathJaxContext>
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p>{children}</p>,
                  code: ({ inline, children }) =>
                    inline ? <MathJax inline>{String(children)}</MathJax> : <pre>{children}</pre>,
                }}
              >
                {generatedResponse}
              </ReactMarkdown>
          </MathJaxContext>
          ) : (
            <p>{defaultQuestionsText}</p >
          )}
        </div>

        <div className="flex justify-end space-x-4 py-4">
          <button
            onClick={copyToClipboard}
            className="bg-[#0598ce] inline-flex items-center gap-2 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <LuCopy /> Copy
          </button>
          <button
            disabled={isLoading}
            onClick={regenerateQuestions}
            className="shadow-lg inline-flex items-center gap-2 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
          >
            {isLoading ? (
              <Loading />
            ) : (
              <>
                <FaArrowsRotate /> Regenerate
              </>
            )}
          </button>
          {renderDownloadPDFButton && 
            <button
              onClick={downloadAsPDF}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 inline-flex gap-2 items-center"
            >
              <LuDownload /> Download as PDF
            </button>
          }
        </div>
      </div>
  );
};

export default GeneratedQuestions;
