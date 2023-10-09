"use client";
import { useState, useEffect, useRef } from "react";
import ProjectToolBar from "@/app/components/ProjectToolBar";
import File from "@/app/types/projectFile";
import codeOutputBoiler from "@/app/iframes/codeOutputboiler";
import reactIframeBoiler from "@/app/iframes/reactBoilerPlate";
import languages from "../../data/languages.json";
import { emmetHTML } from "emmet-monaco-es";
import EditorAndPreview from "@/app/components/EditorAndPreview";
import useMonacoContributions from "@/app/hooks/useMonacoImports";
import useProjectSetup from "@/app/hooks/useProjectSetup";
import { pusherClient } from "@/lib/pusher";
import { useUser } from "@clerk/nextjs";

const ProjectPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [mode, setMode] = useState("preview");
  const [output, setOutput] = useState<string>("");
  const [codeChangedTimeout, setCodeChangedTimeout] = useState(null);
  const disposeEmmetHTMLRef = useRef<() => void | undefined>();
  const [isRunLoading, setIsRunloading] = useState(false);
  const [isSaveLoading, setIsSaveloading] = useState(false);
  const [partnerRole, setPartnerRole] = useState("Driver");
  const { isSignedIn, user, isLoaded } = useUser();
  const isWebMode = (langId: number) => langId === 10;
  const additionalFiles = (langId: number) => langId == 82;

  // hook for setting up project
  const {
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
    setSourceCodeObject,
  } = useProjectSetup(id);

  // hook to set up monaco editor dependencies
  useMonacoContributions();
  const changeNavigatorcode = (sourceCode: string) => {
    console.log(partnerRole);
    if (partnerRole === "Navigator") {
      handleCodeChange(sourceCode);
      console.log(partnerRole);
    }
  };

  const changeNavigatorFile = (newFile: string) => {
    console.log(partnerRole);
    if (partnerRole === "Navigator") {
      handleFileChange(newFile);
      console.log(partnerRole);
    }
  };
  useEffect(() => {
    pusherClient.subscribe(id);
    pusherClient.bind("project-message", (sourceCode: string) => {
      changeNavigatorcode(sourceCode);
    });
    // pusherClient.bind("file-change", (newFile: string) => {
    //   changeNavigatorFile(newFile);
    // });
    if(user?.username !== projectOwner) {
      console.log(user?.username, projectOwner);
      setPartnerRole("Navigator");
    }
  }, [partnerRole, user]);

  // useEffect(() => {
  //   if(isLoaded) {
  //     if(user.username === projectOwner) {
  //       setPartnerRole("Driver");
  //     } else {
  //       setPartnerRole("Navigator");
  //     }
  //     console.log(projectOwner, user.username);
  //   }
  // }, [user]);
  // up date the preview when any of it's dependencies are updated
  useEffect(() => {
    if (mode == "preview" && project) {
      updatePreview();
    }
    updateChatInfo();
  }, [files, mode, output, languageId, project]);

  const handleEditorWillMount = (monaco: typeof import("monaco-editor")) => {
    disposeEmmetHTMLRef.current = emmetHTML(monaco);
  };

  const updatePreview = () => {
    const iframe = document.createElement("iframe");
    const preview = document.getElementById("preview");
    let iframeContent: string;

    if (isWebMode(languageId)) {
      const javascript = files.find(
        (file) => file.fileName === "script.js"
      )?.sourceCode;
      const css = files.find(
        (file) => file.fileName === "style.css"
      )?.sourceCode;
      const html = files.find(
        (file) => file.fileName === "index.html"
      )?.sourceCode;
      iframeContent = reactIframeBoiler(css, html, javascript);
    } else {
      iframeContent = codeOutputBoiler(output);
    }

    iframe.srcdoc = iframeContent;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    preview.innerHTML = "";
    preview.appendChild(iframe);
  };

  const handleFileChange = async (newFileName: string) => {
    let newCurrentFile = files.find((file) => file.fileName === newFileName);
    setCurrentFile(newCurrentFile);
    if (partnerRole === "Driver") {
      await fetch("/api/sockets/session/fileChange", {
        method: "POST",
        body: JSON.stringify({
          newFile: currentFile,
          projectId: id,
        }),
      });
    }
  };

  const handleCodeChange = async (value: string) => {

    if (partnerRole === "Driver") {
      await fetch("/api/sockets/session", {
        method: "POST",
        body: JSON.stringify({
          sourceCode: value,
          projectId: id,
        }),
      });
    }
    if (isWebMode(languageId)) {
      const updatedFile = { ...currentFile, sourceCode: value };
      const updatedFiles = files.map((file) =>
        file.fileName === currentFile.fileName ? updatedFile : file
      );
      if (codeChangedTimeout) {
        clearTimeout(codeChangedTimeout);
      }

      const newTimeout = setTimeout(() => {
        setFiles(updatedFiles);
        setCurrentFile(updatedFile);
      }, 1000);

      setCodeChangedTimeout(newTimeout);
    } else {
      setCurrentFile({ ...currentFile, sourceCode: value });
      const updatedFiles = [{ ...currentFile, sourceCode: value }];
      setFiles(updatedFiles);
    }
  };

  const handleRunClick = async () => {
    setIsRunloading(true);
    if (!isWebMode(languageId)) {
      try {
        const result = await fetch("/api/submission", {
          method: "POST",
          body: JSON.stringify({
            input: currentFile.sourceCode,
            languageId,
            additionalFiles: additionalFiles(languageId),
          }),
        });
        console.log(result.body);
        const resultOut = await result.json();
        setOutput(resultOut);
        setIsRunloading(false);
      } catch (e) {
        setIsRunloading(false);
        setOutput(e);
      }
    } else {
      updatePreview();
      setIsRunloading(false);
    }
  };
  const handleParterRoleSwitch = () => {
    if (partnerRole === "Driver") {
      setPartnerRole("Navigator");
    } else {
      setPartnerRole("Driver");
    }
  };
  const handleSaveClick = async () => {
    setIsSaveloading(true);
    try {
      const response = await fetch(`/api/project/${id}`, {
        method: "PUT",
        body: JSON.stringify({ files }),
      });

      setIsSaveloading(false);
    } catch (err) {
      setIsSaveloading(false);
      console.log(err.message);
    }
  };

  const updateChatInfo = () => {
    if (isWebMode(languageId)) {
      setSourceCodeObject({
        css: files.find((file) => file.fileName === "style.css")?.sourceCode,
        js: files.find((file: File) => file.fileName === "script.js")
          ?.sourceCode,
        html: files.find((file: File) => file.fileName === "index.html")
          ?.sourceCode,
      });
    } else {
      setSourceCodeObject({
        source: currentFile.sourceCode,
        output: output,
        language: languages.find((lang) => lang.id === languageId).name,
      });
    }
  };

  const handleSwitchToPreview = () => {
    setMode("preview");
  };

  const handleSwitchToChat = () => {
    setMode("chat");
  };

  const handleSwitchToLab = () => {
    setMode("quiz");
  };
  return (
    <>
      <button onClick={handleParterRoleSwitch}>{partnerRole}</button>
      <ProjectToolBar
        handleSwitchToChat={handleSwitchToChat}
        handleSwitchToLab={handleSwitchToLab}
        handleSwitchToPreview={handleSwitchToPreview}
        mode={mode}
        handleFileChange={handleFileChange}
        handleRunClick={handleRunClick}
        fileName={currentFile?.fileName}
        displayFiles={isWebMode(languageId)}
        handleSaveClick={handleSaveClick}
        isRunLoading={isRunLoading}
        isSaveLoading={isSaveLoading}
        isWebMode={isWebMode}
        currentFile={currentFile}
        languageId={languageId}
      />
      {project && (
        <EditorAndPreview
          height='80vh'
          theme='vs-dark'
          path={currentFile?.fileName}
          defaultLanguage={
            languages.find((lang) => languageId === lang.id)?.editor
          }
          handleCodeChange={handleCodeChange}
          handleEditorWillMount={handleEditorWillMount}
          source={currentFile?.sourceCode}
          sourceCodeObject={sourceCodeObject}
          mode={mode}
          currentFile={currentFile}
          languageId={languageId}
          id={id}
          projectLab={projectLab}
          setProjectLab={setProjectLab}
        />
      )}
    </>
  );
};

export default ProjectPage;
