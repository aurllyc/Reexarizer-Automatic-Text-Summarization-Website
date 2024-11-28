import React, { useEffect, useState } from "react";
import SummarizeComponent from "../components/SummaryComponent";

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
    <div>
      <div className="py-10 px-10">
        <div className="py-5 px-2">
          <h1 className="font-bold text-4xl items-center text-success">
            Summarizer
          </h1>

          <p className="text-lg text-gray-450">
            Summarizer is a tool for summarizing text.
          </p>
        </div>

        <SummarizeComponent />
      </div>
      <footer className="fixed bottom-0 w-full footer footer-center p-4 bg-base-300 text-base-content">
        <div>
          <p className="text-base text-gray-500">&copy; {currentYear} - Reexarizer</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
