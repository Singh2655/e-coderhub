"use client";
import { DBProblem, Problem } from "@/utils/types/problem";
import {
  AiFillLike,
  AiFillDislike,
  AiOutlineLoading3Quarters,
  AiFillStar,
} from "react-icons/ai";
import { BsCheck2Circle } from "react-icons/bs";
import { TiStarOutline } from "react-icons/ti";
import { problems } from "@/utils/problems";
import Image from "next/image";
import { useEffect, useState } from "react";
import { auth, firestore } from "@/Firebase/firebase";
import { doc, getDoc, runTransaction } from "firebase/firestore";
import RectangleSkeleton from "./Skeletons/RectangleSkeleton";
import CircleSkeleton from "./Skeletons/CircleSkeleton";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "sonner";

type ProblemDescriptionProps = {
  params: string;
  _solved:boolean;
};

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ params,_solved }) => {
  const problem = problems[params];
  //console.log("WorkSpace",problem.order)
  const { currentProblem, loading, problemDifficultyClass, setCurrentProblem } =
    useGetCurrentProblem(problem.id);
  const { liked, disliked, starred, solved, setData } = useGetUserDataOnProblem(
    problem.id
  );
  const [updating, setUpdating] = useState<boolean>(false);

  const [user] = useAuthState(auth);

  const handleLikes = async () => {
    if (!user) {
      toast.error("You must be logged in to like a problem", {
        position: "top-left",
      });
      return;
    }
    if (updating) return;
    setUpdating(true);
    await runTransaction(firestore, async (transaction) => {
      const userRef = doc(firestore, "users", user.uid);
      const probRef = doc(firestore, "problems", problem.id);
      const userDoc = await transaction.get(userRef);
      const probDoc = await transaction.get(probRef);
      if (userDoc.exists() && probDoc.exists()) {
        if (liked) {
          transaction.update(userRef, {
            likedProblems: userDoc
              .data()
              .likedProblems.filter((id: string) => id !== problem.id),
          });
          transaction.update(probRef, {
            likes: probDoc.data().likes - 1,
          });

          setCurrentProblem((prev) =>
            prev ? { ...prev, likes: prev?.likes - 1 } : null
          );
          setData((prev) => ({ ...prev, liked: false }));
        } else if (disliked) {
          transaction.update(userRef, {
            likedProblems: [...userDoc.data().likedProblems, problem.id],
            dislikedProblems: userDoc
              .data().dislikedProblems
              .filter((id: string) => id !== problem.id),
          });
          transaction.update(probRef, {
            likes: probDoc.data().likes + 1,
            dislikes: probDoc.data().dislikes - 1,
          });
          setCurrentProblem((prev) =>
            prev
              ? {
                  ...prev,
                  likes: prev?.likes + 1,
                  dislikes: prev?.dislikes - 1,
                }
              : null
          );
          setData((prev) => ({ ...prev, liked: true, disliked: false }));
        } else {
          transaction.update(userRef, {
            likedProblems: [...userDoc.data().likedProblems, problem.id],
          });
          transaction.update(probRef, {
            likes: probDoc.data().likes + 1,
          });
          setCurrentProblem((prev) =>
            prev ? { ...prev, likes: prev?.likes + 1 } : null
          );
          setData((prev) => ({ ...prev, liked: true }));
        }
      }
    });
    setUpdating(false);
  };
  const handleDislike = async () => {
    if (!user) {
      toast.error("You must be logged in to dislike problem", {
        position: "top-left",
      });
      return;
    }
    if(updating)return
    setUpdating(true)
    await runTransaction(firestore, async (transaction) => {
      const userRef = doc(firestore, "users", user.uid);
      const probRef = doc(firestore, "problems", problem.id);
      const userDoc=await transaction.get(userRef)
      const probDoc = await transaction.get(probRef);
      if(userDoc.exists() && probDoc.exists()){
        if(disliked){
          transaction.update(userRef, {
            dislikedProblems: userDoc
              .data()
              .dislikedProblems.filter((id: string) => id !== problem.id),
          });
          transaction.update(probRef,{
            dislikes:probDoc.data().dislikes-1
          })
          setCurrentProblem(prev=>(prev?{...prev,dislikes:prev?.dislikes-1}:null))
          setData(prev=>({...prev,disliked:false}))
        }else if(liked){
          transaction.update(userRef, {
            dislikedProblems: [...userDoc.data().dislikedProblems, problem.id],
            likedProblems: userDoc
              .data().likedProblems
              .filter((id: string) => id !== problem.id),
          });
          transaction.update(probRef, {
            dislikes: probDoc.data().dislikes + 1,
            likes: probDoc.data().likes - 1,
          });
          setCurrentProblem((prev) =>
            prev
              ? {
                  ...prev,
                  dislikes: prev?.dislikes + 1,
                  likes: prev?.likes - 1,
                }
              : null
          );
          setData((prev) => ({ ...prev, liked: false, disliked: true }));
        }else{
          transaction.update(userRef, {
            likedProblems: [...userDoc.data().dislikedProblems, problem.id],
          });
          transaction.update(probRef, {
            dislikes: probDoc.data().dislikes + 1,
          });
          setCurrentProblem((prev) =>
            prev ? { ...prev, dislikes: prev?.dislikes + 1 } : null
          );
          setData((prev) => ({ ...prev, disliked: true }));
        }
      }
    });
    setUpdating(false)
  };
  const handleStarred=async()=>{
    if(!user){
      toast.error('You must be logged in to star a problem',{
        position:'top-left'
      })
      return
    }
    await runTransaction(firestore,async(transaction)=>{
      const userRef = doc(firestore, "users", user.uid);
      const probRef = doc(firestore, "problems", problem.id);
      const userDoc=await transaction.get(userRef)
      const probDoc = await transaction.get(probRef);
      if(updating)return
      setUpdating(true)
      if(userDoc.exists() && probDoc.exists()){
        if(starred){
          transaction.update(userRef,{
            starredProblems:userDoc.data().starredProblems.filter((id:string)=>id!==problem.id)
          })
          setData(prev=>({...prev,starred:false}))
        }else{
          transaction.update(userRef,{
            starredProblems:[...userDoc.data().starredProblems,problem.id]
          })
          setData(prev=>({...prev,starred:true}))
        }
      }
    })
    setUpdating(false)
  }
  return (
    <div className="bg-dark-layer-1">
      {/* TAB */}
      <div className="flex h-11 w-full items-center pt-2 bg-dark-layer-2 text-white overflow-x-hidden">
        <div
          className={
            "bg-dark-layer-1 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer"
          }
        >
          Description
        </div>
      </div>

      <div className="flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto">
        <div className="px-5">
          {/* Problem heading */}
          <div className="w-full">
            <div className="flex space-x-4">
              <div className="flex-1 mr-2 text-lg text-white font-medium">
                {problem.title}
              </div>
            </div>
            {!loading && currentProblem && (
              <div className="flex items-center mt-3">
                <div
                  className={`${problemDifficultyClass} inline-block rounded-[21px] bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize `}
                >
                  {currentProblem.difficulty}
                </div>
                {(_solved || solved) && <div className="rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-green-s text-dark-green-s">
                  <BsCheck2Circle />
                </div>}
                <div
                  className="flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-dark-gray-6"
                  onClick={handleLikes}
                >
                  {liked && !updating && (
                    <AiFillLike className="text-dark-blue-s" />
                  )}
                  {!liked && !updating && <AiFillLike />}
                  {updating && (
                    <AiOutlineLoading3Quarters className="animate-spin" />
                  )}
                  <span className="text-xs">{currentProblem.likes}</span>
                </div>
                <div className="flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-green-s text-dark-gray-6" onClick={handleDislike}>
                  {disliked && !updating && (
                    <AiFillDislike className="text-dark-blue-s" />
                  )}
                  {updating && (
                    <AiOutlineLoading3Quarters className="animate-spin" />
                  )}
                  {!disliked && !updating &&<AiFillDislike />}
                  <span className="text-xs">{currentProblem.dislikes}</span>
                </div>
                <div className="cursor-pointer hover:bg-dark-fill-3  rounded p-[3px]  ml-4 text-xl transition-colors duration-200 text-green-s text-dark-gray-6 " onClick={handleStarred}>
                  {!updating && !starred && <TiStarOutline />}
                  {updating && <AiOutlineLoading3Quarters/>}
                  {!updating && starred && <AiFillStar className="text-dark-yellow"/>}
                </div>
              </div>
            )}

            {loading && (
              <div className="mt-3 flex space-x-2">
                <RectangleSkeleton />
                <CircleSkeleton />
                <RectangleSkeleton />
                <RectangleSkeleton />
                <CircleSkeleton />
              </div>
            )}

            {/* Problem Statement(paragraphs) */}
            <div className="text-white text-sm">
              <div
                dangerouslySetInnerHTML={{ __html: problem.problemStatement }}
              />
            </div>

            {/* Examples */}
            <div className="mt-4">
              {problem.examples.map((example, index) => (
                <div key={example.id}>
                  <p className="font-medium text-white ">
                    Example {index + 1}:{" "}
                  </p>
                  {example.img && (
                    <Image
                      src={example.img}
                      alt=""
                      className="mt-3"
                      height={350}
                      width={450}
                    />
                  )}
                  <div className="example-card">
                    <pre>
                      <strong className="text-white">Input: </strong>{" "}
                      {example.inputText}
                      <br />
                      <strong>Output:</strong>
                      {example.outputText} <br />
                      {example.explanation && (
                        <>
                          <strong>Explanation:</strong> {example.explanation}
                        </>
                      )}
                    </pre>
                  </div>
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div className="my-5 pb-4">
              <div className="text-white text-sm font-medium">Constraints:</div>
              <ul className="text-white ml-5 list-disc">
                <div
                  dangerouslySetInnerHTML={{ __html: problem.constraints }}
                />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProblemDescription;

function useGetCurrentProblem(problemId: string) {
  const [currentProblem, setCurrentProblem] = useState<DBProblem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [problemDifficultyClass, setProblemDifficultyClass] =
    useState<string>("");
  useEffect(() => {
    const getCurrentProblem = async () => {
      setLoading(true);
      const docRef = doc(firestore, "problems", problemId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const problem = docSnap.data();
        // console.log(problem,"current problem is here")
        setCurrentProblem({ id: docSnap.id, ...problem } as DBProblem);
        setProblemDifficultyClass(
          problem.difficulty === "Easy"
            ? "bg-olive text-olive"
            : problem.difficulty === "Medium"
            ? "bg-dark-yellow text-dark-yellow"
            : "bg-dark-pink text-dark-pink"
        );
        setLoading(false);
      }
    };
    getCurrentProblem();
  }, [problemId]);
  return { currentProblem, loading, problemDifficultyClass, setCurrentProblem };
}

function useGetUserDataOnProblem(problemId: string) {
  const [data, setData] = useState({
    liked: false,
    disliked: false,
    starred: false,
    solved: false,
  });
  const [user] = useAuthState(auth);
  useEffect(() => {
    const getUserDataOnProblem = async () => {
      const userRef = doc(firestore, "users", user!.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        const {
          likedProblems,
          dislikedProblems,
          solvedProblems,
          starredProblems,
        } = data;
        setData({
          liked: likedProblems.includes(problemId),
          disliked: dislikedProblems.includes(problemId),
          starred: starredProblems.includes(problemId),
          solved: solvedProblems.includes(problemId),
        });
      }
    };
    if (user) getUserDataOnProblem();
    return () =>
      setData({ liked: false, disliked: false, starred: false, solved: false });
  }, [problemId, user]);

  return { ...data, setData };
}
