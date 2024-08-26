import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Route,
  Routes,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  HomePage,
  Register,
  Login,
  DashboardPage,
  TrialDashboardPage,
  AdminDashboard,
} from "./pages";
import { checkIsLoggedIn } from "./redux/actionCreators/authActionCreator";
import { RootState } from "./redux/store";
import {
  initSpeechRecognition,
  debouncedProcessTranscript,
} from "./voice/Navigation/speechRecognition";
import SpeechBubble from "./components/SpeechBubbleComponent/speechBubble";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, role, userId } = useSelector((state: RootState) => ({
    isAuthenticated: state.auth.isAuthenticated,
    role: state.auth.role,
    userId: state.auth.user?.uid || "",
    shallowEqual,
  }));
  const [isCreateFileModalOpen, setIsCreateFileModalOpen] = useState(false);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isTrialCreateFileModalOpen, setIsTrialCreateFileModalOpen] =
    useState(false);
  const [speechText, setSpeechText] = useState("");
  const [isTrial, setIsTrial] = useState(false);
  const [loading, setLoading] = useState(true);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const recognitionRunning = useRef(false);

  useEffect(() => {
    const authenticate = async () => {
      try {
        await dispatch(checkIsLoggedIn() as any);
      } catch (error) {
        console.error("Authentication error:", error);
      } finally {
        setLoading(false);
      }
    };

    authenticate();
  }, [dispatch]);

  const handleSpeechRecognition = useCallback(
    (transcript: string) => {
      setSpeechText(transcript);
      debouncedProcessTranscript(
        transcript,
        navigate,
        setIsCreateFileModalOpen,
        setIsCreateFolderModalOpen,
        setIsTrialCreateFileModalOpen,
        isTrial,
        userId || ""
      );
    },
    [navigate, isTrial, userId]
  );

  useEffect(() => {
    if (
      location.pathname.startsWith("/dashboard/file/") ||
      location.pathname.startsWith("/trial/file/")
    ) {
      if (recognitionRunning.current) {
        recognitionRef.current?.stop();
        recognitionRunning.current = false;
      }
    } else {
      const recognition = initSpeechRecognition(handleSpeechRecognition);
      recognitionRef.current = recognition;

      if (!recognitionRunning.current) {
        recognition.start();
        recognition.continuous;
        recognitionRunning.current = true;
      }
      return () => {
        if (recognitionRunning.current) {
          recognition.stop();
          recognitionRunning.current = false;
        }
      };
    }
  }, [handleSpeechRecognition, location]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/trial/*"
          element={
            <TrialDashboardPage
              isCreateFileModalOpen={isTrialCreateFileModalOpen}
              setIsCreateFileModalOpen={setIsTrialCreateFileModalOpen}
              setIsTrial={setIsTrial}
            />
          }
        />
        <Route
          path="/dashboard/*"
          element={
            isAuthenticated ? (
              <DashboardPage
                isCreateFileModalOpen={isCreateFileModalOpen}
                setIsCreateFileModalOpen={setIsCreateFileModalOpen}
                isCreateFolderModalOpen={isCreateFolderModalOpen}
                setIsCreateFolderModalOpen={setIsCreateFolderModalOpen}
                setIsTrial={setIsTrial}
              />
            ) : (
              <Navigate to="/trial" />
            )
          }
        />
        <Route
          path="/admin"
          element={
            isAuthenticated && role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/trial" />
            )
          }
        />
      </Routes>
      {!location.pathname.startsWith("/dashboard/file/") &&
        !location.pathname.startsWith("/trial/file/") && (
          <SpeechBubble text={speechText} />
        )}
    </div>
  );
};

export default App;
