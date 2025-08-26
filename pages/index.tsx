import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Summarize from "./components/Summarize";

const HomePage: React.FC = () => {
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentYear(new Date().getFullYear());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head>
        <title>Reexarizer | Summarizer</title>
      </Head>
      <main>
        <div className="flex items-center justify-center">
          <div className="flex-col items-center justify-center py-10 px-10 my-10">
            <div className="flex-col items-center justify-center py-5 px-2">
              <div className="flex items-center justify-start space-x-2">
                <Image
                  src="/favicon/book.ico"
                  alt="Favicon"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <h1 className="font-bold text-4xl items-center text-success">
                  Reexarizer
                </h1>
              </div>
              <p className="text-lg text-gray-450">
                Reexarizer is a tool for summarizing text.
              </p>
            </div>

            <Summarize />
          </div>

          <footer className="fixed bottom-0 w-full footer footer-center p-4 bg-base-300 text-base-content">
            <div>
              <p className="text-base text-gray-500">
                &copy;{currentYear} - Reexarizer
              </p>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
};

export default HomePage;
