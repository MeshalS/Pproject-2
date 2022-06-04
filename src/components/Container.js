function Container({ children }) {
  return (
    <div className="box mx-5 flex w-auto flex-col gap-y-8 py-7 px-5 drop-shadow-md sm:w-[600px] md:mx-auto md:w-[625px] lg:w-[900px]">
      {children}
    </div>
  );
}

export default Container;
