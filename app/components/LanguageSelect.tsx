import { useState, useEffect, use } from "react";
import Files from "../types/projectFiles";
import starterFiles from "../files/starterFiles";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
const LanguageSelect = ({ languages }) => {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [title, setTitle] = useState<string>("");
  const [languageId, setLanguageId] = useState<Number>(10);
  const [files, setFiles] = useState<Files>(
    starterFiles.filter((file) => file.languageId == languageId)
  );
  const [lab, setLab] = useState<string>();
  const [owner, setOwner] = useState<string>("");

  useEffect(() => {
    if (isLoaded) {
      setOwner(user.username);
    }
  }),
    [user];
  const handleClick = async () => {
    try {
      let response = await fetch("/api/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          files,
          lab,
          languageId,
          owner,
        }),
      });

      const newProject = await response.json();
      const projectId = newProject._id;
      router.push(`/projects/${projectId}`);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  };

  const handleLanguageSelect = (newLanguageId: string) => {
    const newLanguageNumber = parseInt(newLanguageId);
    setLanguageId(newLanguageNumber);
    setFiles(
      starterFiles.filter((file) => file.languageId == newLanguageNumber)
    );
    setLab("");
  };

  return (
    <div className='flex flex-col items-start gap-y-4'>
      <div className='w-full'>
        <label htmlFor='projectTitle' className='block mb-2 font-semibold'>
          Title
        </label>
        <input
          type='text'
          name='projectTitle'
          id='projectTitle'
          onChange={(e) => handleTitleChange(e.target.value)}
          className='block border border-gray-300 rounded px-3 py-2 w-full'
          value={title}
        />
      </div>
      <div>
        <label htmlFor='languageSelect' className='block mb-2 font-semibold'>
          Select Template
        </label>
        <select
          id='languageSelect'
          onChange={(e) =>
            handleLanguageSelect(
              e.target.selectedOptions[0].getAttribute("data-key")
            )
          }
          className='border border-gray-300 rounded px-3 py-2'
        >
          {languages.map((language) => (
            <option
              key={language.id}
              value={`${language.editor}-${language.id}`}
              data-key={language.id}
            >
              {language.name}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleClick}
        className='mt-4 px-6 py-2 bg-black text-white rounded hover:bg-slate-600 w-full'
      >
        Create
      </button>
    </div>
  );
};

export default LanguageSelect;
