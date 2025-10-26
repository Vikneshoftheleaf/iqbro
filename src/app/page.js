"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CryptoJS from "crypto-js";
import Image from "next/image";
const SECRET_KEY = "chickuchika"; // change this

export default function IQTestPage() {
  const [questions, setQuestions] = useState([]);
  const [stage, setStage] = useState("home"); // home | quiz | result | shared
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [sharedResult, setSharedResult] = useState(null);

  // 🔐 Load questions from JSON
  useEffect(() => {
    fetch("/data/questions.json")
      .then((res) => res.json())
      .then(setQuestions)
      .catch((err) => console.error("Failed to load questions:", err));
  }, []);

  // 🔐 Check URL for shared result
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("data");
    if (encoded) {
      try {
        const bytes = CryptoJS.AES.decrypt(decodeURIComponent(encoded), SECRET_KEY);
        const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        setSharedResult(decrypted);
        setStage("shared");
      } catch (e) {
        console.error("Invalid or corrupted link");
      }
    }
  }, []);

  // 🎯 Start quiz
  const startQuiz = () => {
    if (!username.trim() || !gender) return alert("Please enter your name and gender");
    setStage("quiz");
  };

  // ✅ Answer selection
  const handleAnswer = (option) => {
    if (questions[current].answer === option) setScore((s) => s + 1);
    const next = current + 1;
    if (next < questions.length) {
      setCurrent(next);
      setProgress(((next + 1) / questions.length) * 100);
    } else {
      setStage("result");
    }
  };

  // 🧠 IQ scoring logic
  const iqScore = Math.round((score / questions.length) * 60 + 70);
  const getCategory = (iq) => {
    if (iq >= 130) return "Genius (Top 2%)";
    if (iq >= 120) return "Very High";
    if (iq >= 110) return "High Average";
    if (iq >= 90) return "Average";
    if (iq >= 80) return "Low Average";
    return "Below Average";
  };

  // 🔗 Share link
  const shareResult = () => {
    const data = { username, iqScore, category: getCategory(iqScore), gender };
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
    const url = `${window.location.origin}/iq?data=${encodeURIComponent(encrypted)}`;
    navigator.clipboard.writeText(url);
    alert("Link copied! Share it with friends.");
  };

  // ♻️ Retake
  const retakeTest = () => {
    setStage("home");
    setUsername("");
    setGender("");
    setScore(0);
    setCurrent(0);
    setProgress(0);
  };

  // ========== Render ==========

  // Loading state
  if (questions.length === 0 && stage === "quiz") {
    return <p className="text-center mt-20">Loading questions...</p>;
  }

  return (
    <>
    <nav className="bg-white px-4 py-2 absolute top-0 right-0 left-0 w-full z-10">
        <Image src={'/img/logo.png'} alt="logo" height={30} width={30} className="rounded-full"></Image>
      </nav>
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-gray-50">
      
      <AnimatePresence mode="wait">
        {/* 🏠 Home */}
        {stage === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center"
          >
            <h1 className="text-4xl font-bold mb-6">IQ Test</h1>
            <p className="text-gray-600 max-w-xl mb-6">
        This test estimates your IQ using logic and reasoning questions. 
        You’ll get your score instantly after completing the quiz.
      </p>
            <input
              type="text"
              placeholder="Enter your name"
              className="border p-2 rounded mb-3 w-64"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <select
              className="border p-2 rounded mb-4 w-64"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            <button
              onClick={startQuiz}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Start Test
            </button>
          </motion.div>
        )}

        {/* 🧩 Quiz */}
        {stage === "quiz" && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center w-full max-w-lg"
          >
            <div className="flex flex-col gap-2 items-center  w-full max-w-lg">
                            <div className="text-gray-400 text-lg font-bold">{current + 1}/30</div>

              <div className="w-full bg-gray-200 rounded-full h-3 mb-6 overflow-hidden flex gap-4 items-center">
                <motion.div
                  className="bg-blue-600 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>

            </div>

            <h2 className="text-2xl font-semibold mb-4">
              {questions[current].question}
            </h2>
            {questions[current].image && (
              <img
                src={questions[current].image}
                alt="question"
                className="w-64 h-64 object-contain mb-4 border rounded"
              />
            )}
            <div className="grid grid-cols-2 gap-3 w-full">
              {questions[current].options.map((opt, i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswer(opt)}
                  className="bg-gray-100 hover:bg-blue-100 border rounded p-3 text-lg"
                >
                  {opt}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* 🧠 Result */}
        {stage === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-2"
          >
            <Image src={(gender == 'Male')?'/img/male.png':'/img/female.png'} alt="user-profile" height={150} width={150}></Image>
            <p className="text-lg mb-2">Well done!</p>
            <p className="text-2xl mb-2"><b>{username}</b>!</p>
            <p className="text-lg mb-2">Your IQ Score is <span className=" font-bold">{iqScore}</span></p>
            <p className="text-md mb-4">Category: <span className={`${(iqScore >= 130)&& 'bg-black' } ${(iqScore >= 120)&& 'bg-red-500' } ${(iqScore >= 120)&& 'bg-blue-500' } ${(iqScore >= 120)&& 'bg-green-500' } ${(iqScore >= 80)&& 'bg-yellow-500' } ${(iqScore < 80)&& 'bg-teal-500' } text-gray-50 px-2 py-1 rounded-full`}>{getCategory(iqScore)}</span></p>
            <div className="flex gap-4 mt-4">
              <button
                onClick={shareResult}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Share Result
              </button>
              <button
                onClick={retakeTest}
                className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
              >
                Retake
              </button>
            </div>
          </motion.div>
        )}

        {/* 🔗 Shared Result */}
        {stage === "shared" && sharedResult && (
          <motion.div
            key="shared"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center"
          >
          <Image src={(sharedResult.gender == 'Male')?'/img/male.png':'/img/female.png'} alt="user-profile" height={150} width={150}></Image>
            <h1 className="text-3xl font-bold mb-2">
              {sharedResult.username}’s IQ Result
            </h1>
            <p className="text-lg mb-2">IQ Score: <b>{sharedResult.iqScore}</b></p>
            <p className="text-md mb-2">Category: <span className={`${(sharedResult.iqScore >= 130)&& 'bg-black' } ${(sharedResult.iqScore >= 120)&& 'bg-red-500' } ${(sharedResult.iqScore >= 120)&& 'bg-blue-500' } ${(sharedResult.iqScore >= 120)&& 'bg-green-500' } ${(sharedResult.iqScore >= 80)&& 'bg-yellow-500' } ${(sharedResult.iqScore < 80)&& 'bg-teal-500' } text-gray-50 px-2 py-1 rounded-full`}>{sharedResult.category}</span> </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}
