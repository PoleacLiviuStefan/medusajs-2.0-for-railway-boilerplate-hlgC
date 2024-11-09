 const Hero = ({ gradient,children,bgPrimary,bgSecond }) => {
  return (
    <div className={`flex flex-col lg:flex-row justify-center items-center gap-[32px]  ${gradient &&  `bg-gradient-to-b from-${bgPrimary} via-${bgPrimary} to-${bgSecond}`}  w-full h-full`}>
      {children}
    </div>
  );
};

export default Hero;