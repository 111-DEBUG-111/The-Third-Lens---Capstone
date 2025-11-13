import AuthForm from "./AuthForm";
import Navbar from "../components/Navbar";

export default function Signup() {
  return (
    <>
      <Navbar />
      <div className="pt-20">
        <AuthForm type="signup" />
      </div>
    </>
  );
}
