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
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Course } from '@prisma/client';

interface PriceFormProps {
    initialData: Course,
    courseId: string;
}

const formSchema = z.object({
    price: z.coerce.number(),
});

const PriceForm = ({
    initialData,
    courseId,
}: PriceFormProps) => {
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            price: initialData?.price || undefined
        }
    });

    const router = useRouter();


    const {isSubmitting, isValid} = form.formState;
    const [isDescription, setIsDescription] = useState(false);

    const ToggleEdit = () => setIsDescription((current) => !current);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Course updated");
            ToggleEdit();
            router.refresh();

        } catch (error) {
            console.log("[DescriptionForm Error]",error)
        }
    }

    return ( 
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                Course price
                <Button variant="ghost" onClick={ToggleEdit}>
                {isDescription 
                    ? (<>Cancel</>)
                    : (<> 
                        <Pencil className='h-4 w-4 mr-2' />
                        Edit Price
                    </>)
                }
                </Button>
            </div>
            {!isDescription && (
                <p className={cn("text-sm mt-2",
                    !initialData.price && "text-slate-500 italic"
                )}>
                    { initialData.price || "No price"}
                </p>
            )}
            {
                isDescription && (
                    <Form {...form}>
                        <form 
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='space-y-4 mt-4'
                        >
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea
                                                disabled={isSubmitting}
                                                placeholder="Enter price for yourc course"
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
 
export default PriceForm;