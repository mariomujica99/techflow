import React, { useState, useEffect } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import { LiaBirthdayCakeSolid } from "react-icons/lia";

const AddBirthdaysInput = ({ birthdays, setBirthdays }) => {
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
      {birthdays.map((item, index) => (
        <div
          key={index}
          className="flex justify-between items-start bg-orange-50 border border-orange-100 px-3 py-2 rounded-md mb-2 mt-2"
        >
          <div className="flex flex-1 mr-3">
            <LiaBirthdayCakeSolid className="text-gray-400 flex-shrink-0 mr-2 mt-0.25"/>
            <p className="text-xs text-gray-700 flex-1 mt-0.5">{item}</p>
          </div>
          <button
            className="cursor-pointer flex-shrink-0 mt-0.5"
            onClick={() => setBirthdays(birthdays.filter((_, i) => i !== index))}
          >
            <HiOutlineTrash className="text-lg text-red-500 hover:text-rose-600" />
          </button>
        </div>
      ))}

      <div className="flex items-start gap-3 mt-2">
        <div className="flex-1 flex items-start gap-2 border border-orange-100 bg-orange-50/40 rounded-md px-3 py-2 min-h-[40px] focus-within:border-orange-300 focus-within:ring-1 focus-within:ring-orange-200 transition-all">
          <LiaBirthdayCakeSolid className="text-gray-400 flex-shrink-0 mt-1" />
          
          <textarea
            ref={(el) => setTextareaRef(el)}
            placeholder="Add Birthday"
            value={option}
            onChange={({ target }) => setOption(target.value)}
            className="w-full text-[13px] text-black outline-none bg-transparent resize-none pt-0.5 min-h-[20px] overflow-hidden placeholder:text-gray-400"
            rows="1"
            onInput={(e) => autoResize(e.target)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (option.trim()) {
                  setBirthdays([...birthdays, option.trim()]);
                  setOption("");
                }
              }
            }}
          />
        </div>

        <button
          className="flex items-center gap-1 md:gap-2 text-[12px] font-medium text-orange-600 hover:text-white bg-orange-50 hover:bg-orange-400 px-2.5 md:px-4 py-2.5 rounded-lg border border-orange-200 hover:border-orange-400 cursor-pointer whitespace-nowrap transition-colors"
          onClick={() => {
            if (option.trim()) {
              setBirthdays([...birthdays, option.trim()]);
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

export default AddBirthdaysInput;