import { useState, useEffect, createContext } from "react";


export const CandidateContext = createContext();
export const DataProvider = ({ children }) => {
    const [data, setData] = useState('');
    const apiURI = process.env.REACT_APP_API_URL;
    const endpoint = "/get-candidates"

    useEffect(() => {
        fetch(`${apiURI}${endpoint}`)
            .then(res => res.json())
            .then(response => {
                setData(response);
            })
            .catch(err => console.error(err))
    }, [apiURI]);
    return (
        <CandidateContext.Provider value={data}>
            {children}
        </CandidateContext.Provider>)


}

