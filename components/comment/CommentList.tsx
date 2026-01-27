"use client";

import CommentItem from "./CommentItem";

interface CommentListProps {
    comments: any[];
    userId: string;
    clerkId: string;
    lessonId: string;
    isAdmin: boolean;
}

const CommentList = ({ comments, userId, clerkId, lessonId, isAdmin }: CommentListProps) => {
    const buildTree = (allComments: any[], parentId: string | null = null): any[] => {
        return allComments
            .filter((c) => (c.parentId || null) === parentId)
            .map((c) => ({
                ...c,
                repliesList: buildTree(allComments, c._id),
            }));
    };

    const commentTree = buildTree(comments);

    if (comments.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            {commentTree.map((comment) => (
                <CommentItem
                    key={comment._id}
                    comment={comment}
                    userId={userId}
                    clerkId={clerkId}
                    lessonId={lessonId}
                    isAdmin={isAdmin}
                    replies={comment.repliesList}
                />
            ))}
        </div>
    );
};

export default CommentList;
