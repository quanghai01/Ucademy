"use client";

import { useEffect, useRef, useState } from "react";
import { markLessonComplete, updateCurrentLesson } from "@/app/lib/actions/progress.actions";
import { ELessonType } from "@/app/types/enums";

interface LessonProgressTrackerProps {
    lessonId: string;
    lessonType: ELessonType;
    courseSlug: string;
    courseId: string;
    isCompleted?: boolean;
}

export default function LessonProgressTracker({
    lessonId,
    lessonType,
    courseSlug,
    courseId,
    isCompleted = false,
}: LessonProgressTrackerProps) {
    const [hasMarked, setHasMarked] = useState(isCompleted);
    const markAttempted = useRef(false);

    // Track current lesson on mount - SIMPLIFIED
    useEffect(() => {
        console.log('🔵 [LessonProgressTracker] Component mounted', {
            courseId,
            lessonId
        });

        // Immediately call the server action
        updateCurrentLesson({
            courseId,
            lessonId,
        }).then((result) => {
            console.log('✅ [LessonProgressTracker] updateCurrentLesson completed:', result);
            if (result.success) {
                console.log('🎯 Current lesson saved successfully!');
            } else {
                console.error('❌ Failed to save current lesson:', result.message);
            }
        }).catch((error) => {
            console.error('💥 Error calling updateCurrentLesson:', error);
        });

    }, [courseId, lessonId]);

    // Auto-complete for TEXT lessons only
    useEffect(() => {
        if (lessonType === ELessonType.TEXT && !hasMarked && !markAttempted.current) {
            markAttempted.current = true;

            // Mark as complete after 2 seconds
            const timer = setTimeout(async () => {
                const result = await markLessonComplete({
                    courseSlug,
                    lessonId,
                });

                if (result.success) {
                    setHasMarked(true);
                }
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [lessonType, hasMarked, courseSlug, lessonId]);

    // This component doesn't render anything visible
    return null;
}
