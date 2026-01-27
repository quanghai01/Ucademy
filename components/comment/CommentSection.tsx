"use client";


import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

interface CommentSectionProps {
    lessonId: string;
    userId: string;
    clerkId: string;
    isAdmin: boolean;
    comments: any[];
}

const CommentSection = ({
    lessonId,
    userId,
    clerkId,
    isAdmin,
    comments,
}: CommentSectionProps) => {
    return (
        <div className="mt-10 border-t pt-10">
            <h2 className="text-xl font-bold mb-8">Bình luận</h2>
            <div className="mb-10">
                <CommentForm
                    lessonId={lessonId}
                    userId={userId}
                />
            </div>
            {comments.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                    Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                </div>
            ) : (
                <CommentList
                    comments={comments}
                    userId={userId}
                    clerkId={clerkId}
                    lessonId={lessonId}
                    isAdmin={isAdmin}
                />
            )}
        </div>
    );
};

export default CommentSection;
