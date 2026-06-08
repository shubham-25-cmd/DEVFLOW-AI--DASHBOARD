import { useAuth } from "../context/AuthContext";

const Landing = () => {
  const { login } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-6">
          GitHub OAuth App
        </h1>

        <button
          onClick={login}
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
};

export default Landing;