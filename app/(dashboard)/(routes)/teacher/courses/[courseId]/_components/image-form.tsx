'use client'

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Course } from '@prisma/client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { ImageIcon, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { FileUpload } from '@/components/file-upload';

interface ImageFormProps {
    initialData: Course,
    courseId: string;
}

const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message: "Image is required"
    }),
});

const ImageForm = ({
    initialData,
    courseId,
}: ImageFormProps) => {

    const router = useRouter();

    const [isImageUpload, setIsImageUpload] = useState(false);

    const ToggleEdit = () => setIsImageUpload((current) => !current);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Course updated");
            ToggleEdit();
            router.refresh();

        } catch (error) {
            console.log("[ImageForm Error]",error)
        }
    }

    return ( 
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                Course Description
                <Button variant="ghost" onClick={ToggleEdit}>
                {isImageUpload && (
                    <>Cancel</>
                )}

                {!isImageUpload && !initialData.imageUrl && (
                    <>
                        <PlusCircle className='h-4 w-4 mr-2'/>
                        Add an Image
                    </>
                )}

                {!isImageUpload && initialData.imageUrl && (
                    <>
                        <PlusCircle className='h-4 w-4 mr-2'/>
                        Edit Image
                    </>
                )}
                </Button>
            </div>
            {!isImageUpload && (
                !initialData.imageUrl ? (
                    <div className='flex items-center justify-center h-60 bg-slate-200 rounded-md'>
                        <ImageIcon className='h-10 w-10 text-slate-500' />
                    </div>
                ) : (
                    <div className='relative aspect-video mt-2'>
                        <Image
                            alt='Upload'
                            fill
                            className='object-cover rounded-md'
                            src={initialData.imageUrl}
                        />
                    </div>
                )
            )}
            {isImageUpload && (
                <div>
                    <FileUpload
                        endpoint='courseImage'
                        onChange={(url)=> {
                            if(url) {
                                onSubmit({imageUrl: url})
                            }
                        }}
                    />

                    <div className='text-xs text-muted-foreground mt-4'>
                        16:9 aspect ratio recommended
                    </div>
                </div>
            )}
            
        </div>
    );
}
 
export default ImageForm;