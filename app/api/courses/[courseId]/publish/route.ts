import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server"

import { db } from "@/lib/db";

export async function PATCH(
    req: Request,
    {params} : {params: {courseId: string}}
) {
    try {
        
        const {userId} = auth();
        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            },
            include: {
                chapters: {
                    include: {
                        muxData: true,
                    }
                }
            }
        })

        if(!course) {
            return new NextResponse("Unauthorized", {status: 500});
        }
        
        const hasPublishedChapter = course.chapters.some((chapter) => chapter.isPublished);
        
        if(!course.title || !hasPublishedChapter || !course.description || !course.imageUrl || !course.categoryId) {
            return new NextResponse("Missing required fiels", {status: 501});
        }


        const hasPublishedCourse = await db.course.update({
            where: {
                id: params.courseId,
                userId,
            },
            data: {
                isPublished: true,
            }
        })
        
        return NextResponse.json(hasPublishedCourse);
    } catch (error) {
        console.log("Course-Id Publish ", error)
        return new NextResponse("Unauthorized", {status: 500});
    }


}