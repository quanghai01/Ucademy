import RatingManage from "@/components/course/RatingManage";
import { getAllRatings } from "@/app/lib/actions/rating.actions";
import React from "react";

const Page = async () => {
    const res = await getAllRatings();
    const ratings = res.success ? res.data : [];

    return (
        <div>
            <RatingManage ratings={ratings} />
        </div>
    );
};

export default Page;
