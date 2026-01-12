import Heading from "@/components/typography/Heading";
import React from "react";

import CourseGrid from "@/components/course/CourseGrid";
import createUser from "../lib/actions/user.actions";

const page = async () => {
  const user = await createUser({
    clerkId: "clerk_123",
    email: "haissd01@gmail.com",
    username: "quanghai",
  });
  return (
    <div>
      <Heading>Khám phá</Heading>

      <CourseGrid />
    </div>
  );
};

export default page;
