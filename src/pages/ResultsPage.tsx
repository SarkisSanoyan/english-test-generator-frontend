import { memo, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import { QUIZ_API, RESULTS_API } from "../config/api.config";
import { type Quiz } from "../types/types";
import { useQuizContext } from "../hooks/useQuizContext";
import { useTimer } from "../hooks/useTimer";
import { useAuth } from "../hooks/useAuth";


function ResultsPage() {
    const { quizId } = useParams();
    const { formatTime } = useTimer();
    const { user } = useAuth();
    const {
        lastQuiz,
        lastScore,
        lastElapsedTime
    } = useQuizContext();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState<Quiz | null>(lastQuiz || null);
    const [score] = useState<number>(lastScore || 0);
    const [loading, setLoading] = useState(!lastQuiz);
    const [showConfetti, setShowConfetti] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (quiz || !quizId) return;

        let isMounted = true;

        fetch(`${QUIZ_API}/${quizId}`)
            .then(res => {
                if (!res.ok) throw new Error("Quiz not found");
                return res.json();
            })
            .then((data: Quiz) => {
                if (isMounted) setQuiz(data);
            })
            .catch(() => {
                if (isMounted) setQuiz(null);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [quizId, quiz]);


    useEffect(() => {
        if (!quiz || score === null || saved) return;

        const saveResult = async () => {
            try {
                const response = await fetch(RESULTS_API, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        quizId: quiz._id,
                        score: Number(score),
                        elapsedTime: lastElapsedTime ?? 0,
                        totalQuestions: quiz.questions.length,
                        userId: user?._id || undefined,
                        email: user?.email || undefined,
                    }),
                    credentials: "include",
                });

                if (!response.ok) {
                    if (response.status === 429) {
                        console.warn("Too many requests, try again later");
                        return;
                    }

                    const errText = await response.text();
                    throw new Error(errText || "Failed to save result");
                }

                const data = await response.json();
                console.log("Result saved:", data);
                setSaved(true);
            } catch (err) {
                console.error("Error saving result:", err);
            }
        };

        saveResult();
    }, [quiz, score, lastElapsedTime, saved, user]);

    // Show confetti if score >= 70%
    useEffect(() => {
        if (!quiz) return;
        const total = quiz.questions.length;
        const percentage = Math.round((score / total) * 100);

        if (percentage >= 70) {
            const timer = setTimeout(() => setShowConfetti(true), 300);
            return () => clearTimeout(timer);
        }
    }, [quiz, score]);

    if (loading)
        return (
            <div className="flex items-center justify-center min-h-screen text-white font-semibold text-lg animate-pulse">
                Loading results...
            </div>
        );

    if (!quiz)
        return (
            <div className="flex items-center justify-center min-h-screen text-red-600 font-semibold text-lg animate-pulse">
                Quiz not found.
            </div>
        );

    const total = quiz.questions.length;
    const percentage = Math.round((score / total) * 100);

    const getMessage = () => {
        if (percentage >= 90) return "Excellent!";
        if (percentage >= 70) return "Good job!";
        return "Keep practicing!";
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-6">
            <div className="max-w-3xl w-full p-8 text-center bg-[#141414] rounded-2xl space-y-6 shadow-2xl">
                {showConfetti && <Confetti numberOfPieces={400} recycle={false} />}

                <h1 className="text-4xl font-extrabold text-red-700">
                    Results: {quiz.title.charAt(0).toUpperCase() + quiz.title.slice(1)}
                </h1>
                <h2 className="text-2xl font-semibold text-white animate-pulse">{getMessage()}</h2>

                <p className="text-lg font-medium text-white">
                    Score: <span className="text-red-600">{score}</span> / {total} ({percentage}%) <br />
                    Time spent: <span className="text-red-600">{formatTime(lastElapsedTime ?? 0)}</span>
                </p>


                <div className="h-6 w-full bg-gray-700 rounded-full overflow-hidden mt-4">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${percentage >= 70 ? "bg-green-600" : "bg-red-600"
                            }`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                <div className="flex flex-wrap justify-center gap-4 mt-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 cursor-pointer"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => navigate("/home")}
                        className="px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white font-bold rounded-2xl shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 cursor-pointer"
                    >
                        Generate New Test
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 cursor-pointer"
                    >
                        Save as PDF
                    </button>
                </div>
            </div>
        </div>
    );
}

export default memo(ResultsPage);