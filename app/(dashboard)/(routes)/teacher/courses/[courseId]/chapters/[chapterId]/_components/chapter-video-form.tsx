'use client'

import * as z from 'zod';
import axios from 'axios';
import MuxPlayer from '@mux/mux-player-react'
import { useRouter } from 'next/navigation';
import { Chapter, MuxData } from '@prisma/client';

import { useState } from 'react';
import { PlusCircle, Video } from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/file-upload';

interface ChapterVideoProps {
    initialData: Chapter & { muxData?: MuxData | null } ,
    courseId: string;
    chapterId: string;
}

const formSchema = z.object({
    videoUrl: z.string().min(1),
});

const ChapterVideoForm = ({
    initialData,
    courseId,
    chapterId
}: ChapterVideoProps) => {

    const router = useRouter();

    const [isImageUpload, setIsImageUpload] = useState(false);

    const ToggleEdit = () => setIsImageUpload((current) => !current);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast.success("Chapter updated");
            ToggleEdit();
            router.refresh();

        } catch (error) {
            console.log("[ChapterVideo Error]",error)
        }
    }

    return ( 
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                Chapter&apos;s Video
                <Button variant="ghost" onClick={ToggleEdit}>
                {isImageUpload && (
                    <>Cancel</>
                )}

                {!isImageUpload && !initialData.videoUrl && (
                    <>
                        <PlusCircle className='h-4 w-4 mr-2'/>
                        Add a Video
                    </>
                )}

                {!isImageUpload && initialData.videoUrl && (
                    <>
                        <PlusCircle className='h-4 w-4 mr-2'/>
                        Edit Video
                    </>
                )}
                </Button>
            </div>
            {!isImageUpload && (
                !initialData.videoUrl ? (
                    <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
                        <Video className='h-10 w-10 text-slate-500' />
                    </div>
                ) : (
                    <div className='relative aspect-video mt-2'>
                        <MuxPlayer playbackId={initialData?.muxData?.playbackId || ""} />
                    </div>
                )
            )}
            {isImageUpload && (
                <div>
                    <FileUpload
                        endpoint="chapterVideo"
                        onChange={(url)=> {
                            if(url) {
                                onSubmit({videoUrl: url})
                            }
                        }}
                    />

                    <div className='text-xs text-muted-foreground mt-4'>
                        Upload this chapter&apos;s video
                    </div>
                </div>
            )}
            {initialData.videoUrl && !isImageUpload && (
                <div className='text-xs text-muted-foreground mt-2'>
                    Videos can take a few minutes to process. Refresh the page if video does not appear.
                </div>
            )}
            
        </div>
    );
}
 
export default ChapterVideoForm;