import CommentManage from "@/components/comment/CommentManage";
import { getAllComments } from "@/app/lib/actions/comment.actions";
import React from "react";

const Page = async () => {
  const res = await getAllComments();
  const comments = res.success ? res.data : [];

  return (
    <div>
      <CommentManage comments={comments} />
    </div>
  );
};

export default Page;
