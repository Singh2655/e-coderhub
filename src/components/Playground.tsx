"use client";
import { FC, useEffect, useState } from "react";
import PreferenceNav from "./PreferenceNav";
import Split from "react-split";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import EditorFooter from "./EditorFooter";
import { problems } from "@/utils/problems";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/Firebase/firebase";
import { toast } from "sonner";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import useLocalStorage from "@/hooks/useLocalStorage";

interface PlaygroundProps {
  params: string;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setSolved: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface ISettings {
  fontSize: string;
  settingsModalIsOpen: boolean;
  dropdownIsOpen: boolean;
}

const Playground: FC<PlaygroundProps> = ({ params, setSuccess, setSolved }) => {
  const problem = problems[params];
  const boilerPlate = problem.starterCode;
  const [activeTestCase, setActiveTestCase] = useState<number>(0);
  let [userCode, setUserCode] = useState<string>(problem.starterCode);

  const [fontSize, setFontSize] = useLocalStorage("lcc-fontSize", "16px");

  const [settings, setSettings] = useState<ISettings>({
    fontSize: fontSize,
    settingsModalIsOpen: false,
    dropdownIsOpen: false,
  });

  const [user] = useAuthState(auth);
  const handleReset=()=>{
    setUserCode(problem.starterCode)
  }
  const handleSubmit = async () => {
    if (!user) {
      toast.error("You must be logged in to submit your code");
      return;
    }
    try {
      userCode = userCode.slice(userCode.indexOf(problem.starterFunctionName));
      const cb = new Function(`return ${userCode}`)();
      const handler = problem.handlerFunction;
      if (typeof handler === "function") {
        const success = handler(cb);
        if (success) {
          setSolved(true);
          toast.success("Congrats!! All test cases passed", {
            position: "top-center",
          });
          const userRef = doc(firestore, "users", user!.uid);
          await updateDoc(userRef, {
            solvedProblems: arrayUnion(problem.id),
          });
        }
      }
    } catch (error: any) {
      console.log(error.message);
      if (
        error.message.startsWith(
          "AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:"
        )
      ) {
        toast.error("One or more test cases failed", {
          position: "top-center",
          style: { background: "khaki" },
        });
      } else {
        toast.error("Something went wrong", {
          position: "top-center",
        });
      }
    }
  };
  useEffect(() => {
    const code = localStorage.getItem(`code-${problem.id}`);
    if (user) {
      setUserCode(code ? JSON.parse(code) : problem.starterCode);
    } else {
      setUserCode(problem.starterCode);
    }
  }, [user, problem.starterCode, problem.id]);
  const onChange = (value: string) => {
    setUserCode(value);
    localStorage.setItem(`code-${problem.id}`, JSON.stringify(value));
  };
  return (
    <div className="flex flex-col bg-dark-layer-1 relative overflow-x-hidden">
      <PreferenceNav settings={settings} setSettings={setSettings} handleReset={handleReset}/>
      <Split
        className="h-[calc(100vh-94px)]"
        direction="vertical"
        sizes={[60, 40]}
        minSize={60}
      >
        <div className="w-full overflow-auto">
          <CodeMirror
            value={userCode}
            theme={vscodeDark}
            extensions={[javascript()]}
            style={{ fontSize: settings.fontSize }}
            onChange={onChange}
          />
        </div>
        <div className="w-full px-5 overflow-auto">
          <div className="flex items-center h-10 space-y-6">
            <div className="relative h-full flex flex-col justify-center cursor-pointer">
              <div className="text-sm font-medium text-white leading-5">
                test cases
              </div>
              <hr className="absolute bottom-0 h-0.5 w-full bg-white rounded-full border-none " />
            </div>
          </div>

          <div className="flex">
            {problem.examples.map((example, idx) => (
              <div
                className="mr-2 items-start mt-2"
                key={idx}
                onClick={() => setActiveTestCase(idx)}
              >
                <div className="flex flex-wrap items-center gap-y-4">
                  <div
                    className={`font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-[5px] px-4 py-1 cursor-pointer whitespace-nowrap
                    ${activeTestCase === idx ? "text-white" : "text-gray-500"}
                    `}
                  >
                    Case {idx + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="font-semibold my-4">
            <p className="text-sm font-medium mt-4 text-white">Input:</p>
            <div className="w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2">
              {problem.examples[activeTestCase].inputText}
            </div>
            <p className="text-sm font-medium mt-4 text-white">Output:</p>
            <div className="w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2">
              2
            </div>
          </div>
        </div>
      </Split>
      <EditorFooter handleSubmit={handleSubmit} />
    </div>
  );
};

export default Playground;
