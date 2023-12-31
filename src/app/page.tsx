import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <header className="relative overflow-hidden max-w-7xl mx-auto">
        <div className="absolute inset-y-0 h-full w-full" aria-label="true">
          <div className="relative h-full">
            <svg
              className="absolute left-full transform -translate-y-3/4 -translate-x-1/4 sm:-translate-x-1/2 md:-translate-y-1/2 lg:-translate-x-3/4"
              width={404}
              height={784}
              fill="none"
              viewBox="0 0 404 784"
            >
              <defs>
                <pattern
                  id="d2a68204-c383-44b1-b99f-42ccff4e5365"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={4}
                    className="text-gray-200"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width={404}
                height={784}
                fill="url(#d2a68204-c383-44b1-b99f-42ccff4e5365)"
              />
            </svg>
          </div>
        </div>

        <div className="relative pt-6 pb-16 sm:pb-24">
          <div className="px-4 sm:px-6">
            <nav className="relative flex items-center justify-between sm:h-10 md:justify-center">
              <div className="flex items-center flex-1 md:absolute md:inset-y-0 md:left-0">
                <div className="flex items-center justify-between w-full md:w-auto">
                  <Link href="/">
                    <div className="flex items-center">
                      <div
                        className="relative inset-y-0 h-20 w-20"
                        aria-label="true"
                      >
                        <Image
                          src="assets/home/notes-notepad-svgrepo-com.svg"
                          alt="logo"
                          fill
                          className="object-contain"
                        />
                      </div>

                      <p className="text-gray-800 ml-2 -mb-2 text-md">
                        Markdown App
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="mt-16 px-4 sm:mt-24 sm:px-6">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Edit and organize your notes with</span>
            <span className="block text-green-600">Markdown App</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            description
          </p>
        </div>
        <div className="flex justify-center mt-6">
          <span className="inline-flex rounded-md shadow">
            <Link
              href="/signup"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-bold rounded-lg text-green-600 bg-white hover:text-green-500"
            >
              Sign Up
            </Link>
          </span>
          <span className="inline-flex rounded-md shadow">
            <Link
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-bold rounded-lg text-green-600 bg-white hover:text-green-500"
            >
              Log In
            </Link>
          </span>
        </div>
      </section>

      {/* app screen shot section */}
      <section className="relative">
        <div className="absolute inset-0 flex flex-col">
          <div className="flex-1" />
          <div className="flex-1 w-full bg-gray-800" />
        </div>
        <div className="px-4 sm:px-6">{/* TODO: App screenshot */}</div>
      </section>

      <footer className="bg-gray-800 mt-16">
        <div className="py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <h2 className="text-center text-gray-400 text-sm font-semibold tracking-wide">
            Made with love &#9825;
          </h2>
        </div>
      </footer>
    </>
  );
}
