import React, { useMemo, useState } from "react"
import { useEffect } from "react"
import { useContext } from "react"
import { useParams } from "react-router-dom"
import { useAsync } from "../hooks/useAsync"
import { getPost } from "../services/posts"

const Context = React.createContext()

export function usePost() {
  return useContext(Context)
}

export function PostProvider({ children }) {
  const { id } = useParams()
  const { loading, error, value: post } = useAsync(() => getPost(id), [id])
  const [comments, setComments] = useState([])

  const commentsByParentId = useMemo(() => {
    const group = {}
    comments.forEach((comment) => {
      group[comment.parentId] ||= []
      group[comment.parentId].push(comment)
    })
    return group
  }, [comments])

  useEffect(() => {
    if (post?.comments == null) return
    setComments(post.comments)
  }, [post?.comments])

  function getReplies(parentId) {
    return commentsByParentId[parentId] || []
  }

  function createLocalComment(comment) {
    setComments((comments) => [...comments, comment])
  }

  function updateLocalComment(id, message) {
    setComments((prevComments) => {
      return prevComments.map((comment) => {
        if (comment.id === id) {
          return { ...comment, message }
        } else {
          return comment
        }
      })
    })
  }

  return (
    <Context.Provider value={{ post: { id, ...post }, getReplies, rootComments: commentsByParentId[null], createLocalComment, updateLocalComment }}>
      {loading ? <h1>Loading</h1> : error ? <h1 className="error-msg">{error}</h1> : children}
    </Context.Provider>
  )
}
