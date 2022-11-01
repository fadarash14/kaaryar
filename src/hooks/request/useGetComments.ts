import { useState } from "react";
import { getData } from "../../api/axios";
import { useAuth } from "../../context/AuthProvider";

export const useGetComments = (page: number) => {
  
  const allCommentLink = `ta/survey/all?pageNum=${page}&pageSize=10`;
  const { auth } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token")
  const getListLearner = async () => {
    try {
      let response = await getData(allCommentLink, {
        headers: {
          Authorization: auth!.token,
        },
      });
      setComments(response.data);
      setLoading(false);
    } catch (error) {
      //TODO:handle Error
      console.log("catch block of error");
      console.log(error);
    }
  };
  return { getListLearner, comments, loading };
};
