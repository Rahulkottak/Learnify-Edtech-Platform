'use client'

import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"
import { Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ConfirmModal } from "@/components/ui/modals/confirm-modal"

interface ChapterActionsProps {
    disabled: boolean
    courseId: string
    chapterId: string
    isPublished: boolean
}

const ChapterActions = ({
    disabled,
    courseId,
    chapterId,
    isPublished
}: ChapterActionsProps) => {
    
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    
    const onDelete = async() => {    
        try {
            setIsLoading(true);
            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
    
            toast.success("Chapter deleted")
            router.refresh();
            router.push(`/teacher/courses/${courseId}`)
        } catch (error) {
            console.log(error)
            toast.error("mastikhor")
        } finally {
            setIsLoading(false);
        }
    }
    
    
    return ( 
        
        <div className="flex items-center gap-x-2">
            <Button 
                onClick={() => {}}
                disabled={disabled}
                variant="outline"
                size="sm"
            >
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading}>
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    );
}
 
export default ChapterActions;