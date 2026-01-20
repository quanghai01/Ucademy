import React from "react";

const Heading = ({ children }: { children: React.ReactNode }) => {
  return <h1 className="text-3xl font-bold mb-4">{children}</h1>;
};

export default Heading;
