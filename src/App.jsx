import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Dashboard from "./Pages/Dashboard";
import Onboarding from "./Pages/Auth/Onboarding";

import SchoolAccessSetup from "./Pages/Auth/SchoolAccessSetup";

import PersonalInformation from "./Pages/Auth/PersonalInformation";
import Login from "./Pages/Auth/Login";
import ForgotPassword from "./Pages/Auth/ForgotPassword";
import PasswordSuccess from "./Pages/Auth/PasswordSuccess";
import SetNewPassword from "./Pages/Auth/SetNewPassword";
import CheckMail from "./Pages/Auth/CheckMail";
import Layout from "./components/Layout/Layout";

import Homepage from "./Pages/Dashboard/Homepage";
import Students from "./Pages/Dashboard/Students/Students";
import Subjects from "./Pages/Dashboard/Subjects/Subjects";
import TeachingTools from "./Pages/Dashboard/TeachingTools/TeachingTools";
import Settings from "./Pages/Dashboard/Settings/Settings";

import AssessmentBuilder from "./Pages/Dashboard/TeachingTools/AssessmentBuilder";
import FeedbackBot from "./Pages/Dashboard/TeachingTools/FeedbackBot";
import Chatbot from "./Pages/Dashboard/TeachingTools/Chatbot";
import LessonPlan from "./Pages/Dashboard/TeachingTools/LessonPlan";
import LessonNote from "./Pages/Dashboard/TeachingTools/LessonNote";
import FeedbackBotResponse from "./Pages/Dashboard/TeachingTools/FeedbackBotResponse";
import CommuncationTools from "./Pages/Dashboard/CommunicationTools/CommuncationTools";
import Attendance from "./Pages/Dashboard/Attendance/Attendance";
import ChatPage from "./Pages/Dashboard/CommunicationTools/ChatPage";
import SubjectDetails from "./Pages/Dashboard/Subjects/SubjectDetails";
import AddSubject from "./Pages/Dashboard/Subjects/AddSubject";
import Calendar from "./Pages/Dashboard/Calendar/Calendar";
import StudentDetails from "./Pages/Dashboard/Students/StudentDetails";
import CreateAccount from "./Pages/Auth/CreateAccount";
import PasswordSetup from "./Pages/Auth/PasswordSetup";
import ResultManagement from "./Pages/Dashboard/Subjects/ResultManagement";
import UploadResult from "./Pages/Dashboard/Subjects/UploadResult";
import StudentResult from "./Pages/Dashboard/Students/StudentResult";
import TopicDetails from "./Pages/Dashboard/Subjects/TopicDetails";
import AppContextProvider from "./context/AppContext";
import Topics from "./Pages/Dashboard/Subjects/Topics";
import Assignment from "./Pages/Dashboard/Subjects/Assignment";
import RubricBuilder from "./Pages/Dashboard/TeachingTools/RubricBuilder";
import AssignmentBuilder from "./Pages/Dashboard/TeachingTools/AssignmentBuilder";
import CBTInstance from "./Pages/Dashboard/CBT/CBTInstance";
import QuestionsList from "./Pages/Dashboard/CBT/QuestionsList";

function App() {
  return (
    <>
      <Router>
        <AppContextProvider>
          <Routes>
            <Route path="/" element={<Onboarding />} />

            <Route path="/Login" element={<Login />} />
            <Route path="/CreateAccount" element={<CreateAccount />} />

            <Route path="/SchoolAccessSetup" element={<SchoolAccessSetup />} />

            <Route
              path="/PersonalInformation"
              element={<PersonalInformation />}
            />

            <Route path="/PasswordSetup" element={<PasswordSetup />} />

            <Route path="/ForgotPassword" element={<ForgotPassword />} />

            <Route path="/PasswordSuccess" element={<PasswordSuccess />} />

            <Route path="/SetNewPassword" element={<SetNewPassword />} />

            <Route path="/CheckMail" element={<CheckMail />} />

            <Route element={<Layout />}>
              <Route path="Dashboard" element={<Homepage />} />

              <Route path="Students" element={<Students />} />

              <Route path="StudentDetails" element={<StudentDetails />} />

              <Route path="Subjects" element={<Subjects />} />
              <Route path="subject/topics" element={<Topics />} />
              <Route path="subject/assignment" element={<Assignment />} />

              <Route path="SubjectDetails" element={<SubjectDetails />} />

              {/* <Route path="AddSubject" element={<AddSubject />} /> */}

              <Route path="CBTInstance" element={<CBTInstance />} />
              <Route path="QuestionsList" element={<QuestionsList />} />

              <Route path="TeachingTools" element={<TeachingTools />} />

              <Route
                path="CommunicationTools"
                element={<CommuncationTools />}
              />

              <Route path="ResultManagement" element={<ResultManagement />} />

              <Route path="UploadResult" element={<UploadResult />} />

              <Route path="StudentResult" element={<StudentResult />} />

              <Route path="ChatPage" element={<ChatPage />} />

              <Route path="Attendance" element={<Attendance />} />

              <Route path="Calendar" element={<Calendar />} />
              <Route path="AssessmentBuilder" element={<AssessmentBuilder />} />
              <Route path="AssignmentBuilder" element={<AssignmentBuilder />} />
              <Route path="RubricBuilder" element={<RubricBuilder />} />
              <Route path="Chatbot" element={<Chatbot />} />
              <Route path="FeedbackBot" element={<FeedbackBot />} />

              <Route
                path="FeedbackBotResponse"
                element={<FeedbackBotResponse />}
              />
              <Route path="LessonPlan" element={<LessonPlan />} />
              <Route path="LessonNote" element={<LessonNote />} />
              <Route path="Settings" element={<Settings />} />
              <Route path="TopicDetails" element={<TopicDetails />} />
            </Route>
          </Routes>
        </AppContextProvider>
      </Router>
    </>
  );
}

export default App;
