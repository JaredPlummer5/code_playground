import { useState, useEffect } from 'react';
import languages from '../data/languages.json'
import File from '../types/projectFile';
function useProjectSetup(id: string) {
  const [project, setProject] = useState();
  const [projectLab, setProjectLab] = useState('');
  const [languageId, setLanguageId] = useState(10);
  const [files, setFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [sourceCodeObject, setSourceCodeObject] = useState(null);
  const [projectOwner, setProjectOwner] = useState("");
  useEffect(() => {
    setUpProject();
  }, []);

  const setUpProject = async () => {
    if(!parseInt(id)) return
    try {
      const response = await fetch(`/api/project/${id}`);
      const newProject = await response.json();
      setProject(newProject);
      setProjectLab(newProject.lab);
      setLanguageId(newProject.languageId);
      setFiles(newProject.files);
      setCurrentFile(newProject.files[0]);
      setProjectOwner(newProject.owner);
      // Set sourceCodeObject based on project setup
      if (newProject.languageId == 10) {
        setSourceCodeObject({
          css: newProject.files.find((file : File) => file.fileName === 'style.css'),
          js: newProject.files.find((file : File) => file.fileName === 'script.js'),
          html: newProject.files.find((file : File) => file.fileName === 'index.html'),
        });
      } else {
        setSourceCodeObject({
          source: newProject.files[0].sourceCode,
          output: "",
          language: languages.find((lang) => lang.id === newProject.languageId)
            .name,
        });
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return {
    project,
    projectLab,
    languageId,
    files,
    currentFile,
    sourceCodeObject,
    projectOwner,
    setProjectOwner,
    setUpProject,
    setProject,
    setProjectLab,
    setLanguageId,
    setFiles,
    setCurrentFile,
    setSourceCodeObject
  };
}

export default useProjectSetup;
