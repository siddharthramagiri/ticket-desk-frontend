import { createComment, getComments } from '@/services/api';
import { Ticket, TicketComment } from '@/types';
import React, { useCallback, useEffect, useState } from 'react'

export function useComments(ticket: Ticket | null) {
    const [comments, setComments] = useState<TicketComment[]>([]);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const loadComments = useCallback(async () => {
        setCommentsLoading(true);
        try {
            const response = await getComments(ticket.id);
            setComments(response);
        } catch {
            setError("Could not load tickets");
        } finally {
            setCommentsLoading(false);
        }
    }, [ticket.id]);

    const sendComment = async (newComment : string) => {
        if(!ticket) return;
        try {
            const res = await createComment(ticket.id, {comment: newComment, aiGenerated: false});
            loadComments();
        } catch (err) {
           console.log(err);
        } finally {
            setCommentsLoading(false)
        }
    }

    
    useEffect(() => {
        if(!ticket) return;
        
        loadComments();
        
    }, [loadComments]);


    return { comments, commentsLoading, error, sendComment, loadComments }
}