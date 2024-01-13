'use client'

import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"
import { Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ConfirmModal } from "@/components/ui/modals/confirm-modal"
import { ConfettiProvider } from "@/components/providers/confetti-provider"
import { useConfettiStore } from "@/hooks/use-confetti-store"

interface ActionsProps {
    disabled: boolean
    courseId: string
    isPublished: boolean
}

const Actions = ({
    disabled,
    courseId,
    isPublished
}: ActionsProps) => {
    
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const confetti = useConfettiStore();

    const onClick = async () => {
        if(isPublished) {
            await axios.patch(`/api/courses/${courseId}/unpublish`)
            toast.success("course unpublished")
            router.refresh();
        } else {
            await axios.patch(`/api/courses/${courseId}/publish`)
            toast.success("course published")
            confetti.onOpen();
            router.refresh();
        }
    }
    const onDelete = async() => {    
        try {
            setIsLoading(true);
            await axios.delete(`/api/courses/${courseId}`)
    
            toast.success("Course deleted")
            router.push(`/teacher/courses`)
            router.refresh();
        } catch (error) {
            console.log(error)
            toast.error("Failed deleting course")
        } finally {
            setIsLoading(false);
        }
    }
    
    
    return ( 
        
        <div className="flex items-center gap-x-2">
            <Button 
                onClick={onClick}
                disabled={disabled || isLoading}
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
 
export default Actions;