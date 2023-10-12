import { useState, useEffect } from "react";

export const useAsync = (AsyncFunction, dependencies) => {
  const [data, setData] = useState()
  const [error, setError] = useState(true)

  useEffect(() => {
    AsyncFunction()
      .then((resp) => {
        setData(resp);
      })
      .catch((error) => {
        setError(error)
      })
      .finally(() => {
        console.log("good")
      })
  }, [dependencies])

  return {
    data,
    error,
  }
}