
export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen">
      <div className="text-3xl font-bold mb-4">
        BPJS Form Generator
      </div>
      <div className="flex justify-center items-center gap-4">
        <a href="/login">
          Login
        </a>
        <a href="">
          Register
        </a>
      </div>
    </div>
  );
}
