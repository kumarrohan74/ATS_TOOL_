import { useState, useEffect, createContext } from "react";


export const CandidateContext = createContext();
export const DataProvider = ({ children }) => {
    const [data, setData] = useState('');

    useEffect(() => {
        fetch('get-candidates')
            .then(res => res.json())
            .then(response => {
                setData(response);
                // console.log(response)
            })
            .catch(err => console.error(err))
    }, []);
    //console.log(data)
    return (
        <CandidateContext.Provider value={data}>
            {children}
        </CandidateContext.Provider>)


}

