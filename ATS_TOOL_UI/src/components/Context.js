import { useState, useEffect, createContext } from "react";


export const CandidateContext = createContext();
export const DataProvider = ({ children }) => {
    const [data, setData] = useState('');

    useEffect(() => {
        fetch('get-candidates')
            .then(res => res.json())
            .then(response => {
                setData(response);
            })
            .catch(err => console.error(err))
    }, []);
    return (
        <CandidateContext.Provider value={data}>
            {children}
        </CandidateContext.Provider>)


}

