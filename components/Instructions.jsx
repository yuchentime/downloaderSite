"use client";

const Instructions = ({ title, subtitle = "", descriptionNode }) => {
  return (
    <>
      <div className="bg-green-400 w-32 h-10 mx-auto rounded-md flex items-center justify-center">
        <h1 className="text-4xl text-center font-bold tracking-tight text-white sm:text-2xl">
          {title}
        </h1>
      </div>
      <p>{subtitle}</p>
      <p className="text-sm text-start leading-8 mr-6">{descriptionNode}</p>
    </>
  );
};

export default Instructions;
