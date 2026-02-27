import React, { useState, useEffect } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import { BsEmojiSmile } from "react-icons/bs";

const AddAnniversariesInput = ({ anniversaries, setAnniversaries }) => {
  const [option, setOption] = useState("");
  const [textareaRef, setTextareaRef] = useState(null);

  const autoResize = (textarea) => {
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  useEffect(() => {
    if (textareaRef) autoResize(textareaRef);
  }, [option, textareaRef]);

  return (
    <div>
      {anniversaries.map((item, index) => (
        <div
          key={index}
          className="flex justify-between items-start bg-amber-50 border border-amber-100 px-3 py-2 rounded-md mb-2 mt-2"
        >
          <div className="flex flex-1 mr-3 items-start gap-2">
            <BsEmojiSmile className="text-gray-400 flex-shrink-0 mt-0.25"/>
            <p className="text-xs text-gray-700 flex-1 mt-0.5">{item}</p>
          </div>
          <button
            className="cursor-pointer flex-shrink-0 mt-0.5"
            onClick={() => setAnniversaries(anniversaries.filter((_, i) => i !== index))}
          >
            <HiOutlineTrash className="text-lg text-red-500 hover:text-rose-600" />
          </button>
        </div>
      ))}

      <div className="flex items-start gap-3 mt-2">
        <div className="flex-1 flex items-start gap-2 border border-amber-100 bg-amber-50/40 rounded-md px-3 py-2 min-h-[40px] focus-within:border-amber-300 focus-within:ring-1 focus-within:ring-amber-200 transition-all">
          <BsEmojiSmile className="text-gray-400 flex-shrink-0 mt-1" />

          <textarea
            ref={(el) => setTextareaRef(el)}
            placeholder="Add Anniversary"
            value={option}
            onChange={({ target }) => setOption(target.value)}
            className="w-full text-[13px] text-black outline-none bg-transparent resize-none pt-0.5 min-h-[20px] overflow-hidden placeholder:text-gray-400"
            rows="1"
            onInput={(e) => autoResize(e.target)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (option.trim()) {
                  setAnniversaries([...anniversaries, option.trim()]);
                  setOption("");
                }
              }
            }}
          />
        </div>

        <button
          className="flex items-center gap-1 md:gap-2 text-[12px] font-medium text-amber-600 hover:text-white bg-amber-50 hover:bg-amber-400 px-2.5 md:px-4 py-2.5 rounded-lg border border-amber-200 hover:border-amber-400 cursor-pointer whitespace-nowrap transition-colors"
          onClick={() => {
            if (option.trim()) {
              setAnniversaries([...anniversaries, option.trim()]);
              setOption("");
            }
          }}
        >
          <HiMiniPlus className="text-base md:text-lg" />
          <span className="hidden md:inline">Add</span>
        </button>
      </div>
    </div>
  );
};

export default AddAnniversariesInput;