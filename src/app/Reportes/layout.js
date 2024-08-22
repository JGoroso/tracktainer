'use client'
import React, { useState, useEffect } from 'react'
import Loader from "../components/dashboard-componentes/Common/Loader";
import '../../css/styles.css'

function layout({ children }) {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {loading ? <Loader /> : children}
    </div>
  )
}

export default layout