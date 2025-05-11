import { LuCopy, LuDownload } from "react-icons/lu";
import { FaArrowsRotate } from "react-icons/fa6";
import ReactMarkdown from "react-markdown";
import { MathJaxContext, MathJax } from "better-react-mathjax";
import toast from "react-hot-toast";
import Loading from "../Layout/Loading";
import remarkMath from "remark-math";
import rehypeMathjax from "rehype-mathjax";

const GeneratedQuestions = ({
    generatedResponse,
    onRegenerate,
    isLoading,
    title,
    renderDownloadPDFButton,
    pdfDownloadFilename,
}) => {
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
        // 1. Clone the print container
        const content = document.getElementById("pdf-content");
        if (!content) return;

        // 2. Open a new invisible window/iframe
        const iframe = document.createElement("iframe");
        iframe.style.position = "fixed";
        iframe.style.right = "0";
        iframe.style.bottom = "0";
        iframe.style.width = "0";
        iframe.style.height = "0";
        iframe.style.border = "0";
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow.document;
        doc.open();
        // 3. Copy the head (for your CSS & MathJax)
		doc.write(`<html><head>${document.head.innerHTML}
			<style>
			  @media print {
				@page { margin: 0; size: auto; }
				body { margin: 30px; }
			  }
			</style>
		  </head><body>`
		);
		// 4. Write the cloned content
        doc.write(content.innerHTML);
        doc.write("</body></html>");
        doc.close();

        // 5. Give MathJax a moment to typeset
        iframe.onload = () => {
            // 6. Kick off print
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            // 7. Clean up
            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 1000);
        };
    };

    function normalizeMathDelimiters(md) {
        // return md;

        return (
            md
                // convert \(…\) → $…$
                .replace(
                    /\\\(\s*([^]+?)\s*\\\)/g,
                    (_, expr) => `$$${expr.trim()}$$`
                )
                // convert \[…\] → $$…$$
                .replace(
                    /\\\[\s*([^]+?)\s*\\\]/g,
                    (_, expr) => `$$${expr.trim()}$$`
                )
        );
    }

    return (
        <div className="bg-white shadow-md px-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
                Generated Assignment Questions
            </h2>

            <div id="pdf-content" className="border p-4 rounded-lg space-y-4">
                {generatedResponse ? (
                    <>
                        <MathJaxContext>
                            <MathJax>
                                <ReactMarkdown
                                    remarkPlugins={[remarkMath]}
                                    rehypePlugins={[rehypeMathjax]}
                                >
                                    {normalizeMathDelimiters(generatedResponse)}
                                </ReactMarkdown>
                            </MathJax>
                        </MathJaxContext>
                    </>
                ) : (
                    <p>{defaultQuestionsText}</p>
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
                {renderDownloadPDFButton && generatedResponse && (
                    <button
                        onClick={downloadAsPDF}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 inline-flex gap-2 items-center"
                    >
                        <LuDownload /> Download as PDF
                    </button>
                )}
            </div>
        </div>
    );
};

export default GeneratedQuestions;
