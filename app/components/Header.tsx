import Link from "next/link";
import { UserButton, auth } from "@clerk/nextjs";

const Header = async ({}) => {
  const { userId } = auth();

  return (
    <nav className=" z-10 relative flex items-center justify-between px-6 py-4 mb-5 bg-black-900" >
      <div className="flex items-center">
        <Link href="/">
          <div className="underline decoration-sky-500 text-lg font-bold text-white">BitBox</div>
        </Link>
      </div>
      <div className="flex items-center text-white">
        {!userId && (
          <>
            <Link
              href="/sign-in"
              className="border border-white text-white hover:text-gray-300 mr-2 px-4 py-2 rounded "
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="bg-blue-500 text-white hover:bg-blue-700 px-4 py-2 rounded"
            >
              Sign Up
            </Link>
          </>
        )}
        {userId && (
          <div>
            <Link
              href="/dashboard"
              className="text-gray-300 hover:text-white mr-4"
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="text-gray-300 hover:text-white mr-4"
            >
              Profile
            </Link>
          </div>
        )}
        <div className="ml-auto">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </nav>
  );
};

export default Header;