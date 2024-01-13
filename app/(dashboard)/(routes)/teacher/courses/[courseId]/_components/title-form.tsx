'use client'

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Pencil } from 'lucide-react';
import toast from 'react-hot-toast';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TitleFormProps {
    initialData: {
        title: string;
    },
    courseId: string;
}

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required"
    }),
});

const TitleForm = ({
    initialData,
    courseId,
}: TitleFormProps) => {
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    });

    const router = useRouter();


    const {isSubmitting, isValid} = form.formState;
    const [isEditing, setIsEditing] = useState(false);

    const ToggleEdit = () => setIsEditing((current) => !current);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Course updated");
            ToggleEdit();
            router.refresh();

        } catch (error) {
            console.log("[TitleForm Error]",error)
        }
    }

    return ( 
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                Course Title
                <Button variant="ghost" onClick={ToggleEdit}>
                {isEditing 
                    ? (<>Cancel</>)
                    : (<> 
                        <Pencil className='h-4 w-4 mr-2' />
                        Edit title
                    </>)
                }
                </Button>
            </div>
            {!isEditing && (
                <p className='text-sm mt-2'>{initialData.title}</p>
            )}
            {
                isEditing && (
                    <Form {...form}>
                        <form 
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='space-y-4 mt-4'
                        >
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                disabled={isSubmitting}
                                                placeholder="e.g.'Advanced web developement'"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />
                            <div className='flex items-center gap-x-2'>
                                <Button disabled={isSubmitting || !isValid} type='submit'>
                                    Save
                                </Button>
                            </div>
                        </form>
                    </Form>
                )
            }
        </div>
    );
}
 
export default TitleForm;