import { LuCopy } from "react-icons/lu";
import { FaArrowsRotate } from "react-icons/fa6";
import ReactMarkdown from "react-markdown";

const GeneratedQuestions = ({  generatedResponse, onRegenerate }) => {
  // Fallback static questions rendered as markdown
  const defaultQuestionsText = ` # Assignment Questions will appear here`;


  // Copy to clipboard handler
  const copyToClipboard = () => {
    const text = generatedResponse || defaultQuestionsText;
    navigator.clipboard.writeText(text);
    alert("Questions copied to clipboard!");
  };

  // Regenerate handler: if an onRegenerate callback is provided, use it; otherwise, show an alert.
  const regenerateQuestions = () => {
    if (onRegenerate) {
      onRegenerate();
    } else {
      alert("Regeneration not implemented.");
    }
  };

  return (
    <div className="bg-white shadow-md px-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">
        Generated Assignment Questions
      </h2>

      <div className="border p-4 rounded-lg space-y-4">
        {generatedResponse ? (
          <ReactMarkdown>{generatedResponse}</ReactMarkdown>
        ) : (
          <ReactMarkdown>{defaultQuestionsText}</ReactMarkdown>
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
          onClick={regenerateQuestions}
          className="shadow-lg inline-flex items-center gap-2 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
        >
          <FaArrowsRotate /> Regenerate
        </button>
      </div>
    </div>
  );
};

export default GeneratedQuestions;
