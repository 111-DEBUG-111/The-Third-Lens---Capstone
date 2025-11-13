import AuthForm from "./AuthForm";
import Navbar from "../components/Navbar";

export default function Login() {
  return (
    <>
      <Navbar />
      <div className="pt-20">
        <AuthForm type="login" />
      </div>
    </>
  );
}
